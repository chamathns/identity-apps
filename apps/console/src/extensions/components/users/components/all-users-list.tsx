/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { hasRequiredScopes, isFeatureEnabled, resolveUserstore } from "@wso2is/core/helpers";
import {
    AlertLevels,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    ListLayout,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownProps, Header, Icon, ListItemProps, PaginationProps, Popup, SemanticICONS } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations, history
} from "../../../../features/core";
import { RealmConfigInterface } from "../../../../features/server-configurations";
import { deleteUser } from "../../../../features/users/api";
import { UserManagementConstants } from "../../../../features/users/constants";
import { UserBasicInterface, UserListInterface } from "../../../../features/users/models";
import { CONSUMER_USERSTORE } from "../../../../features/userstores";
import { deleteGuestUser } from "../api";
import { UsersConstants } from "../constants";
import { UserAccountTypes } from "../pages";
import { SCIMConfigs } from "../../../configs/scim";
import { MultiValueAttributeInterface } from "@wso2is/core/models";

/**
 * Prop types for the all users list component.
 */
interface AllUsersListProps extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Callback to inform the new set of visible columns.
     * @param {TableColumnInterface[]} columns - New columns.
     */
    onColumnSelectionChange?: (columns: TableColumnInterface[]) => void;
    /**
     * Callback to be fired when the empty list placeholder action is clicked.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, data: ListItemProps) => void;
    /**
     * Admin user details content.
     */
    realmConfigs: RealmConfigInterface;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Meta column list for the user list.
     */
    userMetaListContent?: Map<string, string>;
    /**
     * Users list.
     */
    allUsersList: UserListInterface;
    /**
     * Callback to fetch all users list.
     *
     * @param limit
     * @param offset
     * @param filter
     * @param attribute
     * @param domain
     */
    getAllUsersList: (limit: number, offset: number, filter: string, attribute: string, domain: string) => void;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * Flag for request loading status.
     */
    isLoading: boolean;
    isNextPage?: boolean;
}

/**
 * All users list component.
 *
 * @return {ReactElement}
 */
export const AllUsersList: React.FunctionComponent<AllUsersListProps> = (props: AllUsersListProps): ReactElement => {
    const {
        defaultListItemLimit,
        isLoading,
        readOnlyUserStores,
        featureConfig,
        onColumnSelectionChange,
        onListItemClick,
        realmConfigs,
        selection,
        showListItemActions,
        getAllUsersList,
        allUsersList,
        isNextPage,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const [ searchQuery, setSearchQuery ] = useState<string>("");

    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ usersList, setUsersList ] = useState<UserListInterface>({});
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ userStoreError, setUserStoreError ] = useState(false);
    const [ emailVerificationEnabled, setEmailVerificationEnabled ] = useState<boolean>(undefined);

    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ isPreviousPageAvailable, setIsPreviousPageAvailable ] = useState<boolean>(false);
    const [ tenantAdmin, setTenantAdmin ] = useState<string>("");
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);

    /**
     * Set tenant admin.
     */
    useEffect(() => {
        if (!realmConfigs) {
            return;
        }

        setTenantAdmin(realmConfigs?.adminUser);
    }, [ realmConfigs ]);

    /**
     * Set users list.
     */
    useEffect(() => {
        if (!allUsersList) {
            return;
        }

        setUsersList(allUsersList);
    }, [ allUsersList ]);

    useEffect(() => {
        if (searchQuery == undefined || searchQuery == "") {
            getAllUsersList(listItemLimit, listOffset, null, null, null);
        } else  {
            getAllUsersList(listItemLimit, listOffset, searchQuery, null, null);

        }
    }, [ listOffset, listItemLimit ]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const handleUserEdit = (user: UserBasicInterface) => {
        if (resolveUserstore(user.userName) === CONSUMER_USERSTORE) {
            history.push(UsersConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH").replace(":id", user.id));
        } else {
            history.push(UsersConstants.getPaths().get("COLLABORATOR_USER_EDIT_PATH").replace(":id", user.id));
        }

    };

    const handleGuestUserDelete = (userId: string): void => {
        deleteGuestUser(userId)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "console:manage.features.invite.notifications.deleteInvite.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.users.notifications.deleteUser.success.message"
                    )
                }));
                setDeletingUser(undefined);
                getAllUsersList(listItemLimit, listOffset, null, null, null);
            }).catch((error) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.deleteUser.error.message")
                }));
                return;
            }
            dispatch(addAlert({
                description: t("console:manage.features.users.notifications.deleteUser.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications.deleteUser.genericError" +
                    ".message")
            }));
        });
    };

    const handleConsumerUserDelete = (userId: string): void => {
        deleteUser(userId)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "console:manage.features.users.notifications.deleteUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.users.notifications.deleteUser.success.message"
                    )
                }));
                setDeletingUser(undefined);
                getAllUsersList(listItemLimit, listOffset, null, null, null);
            }).catch((error) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.deleteUser.error.message")
                }));
                return;
            }
            dispatch(addAlert({
                description: t("console:manage.features.users.notifications.deleteUser.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications.deleteUser.genericError" +
                    ".message")
            }));
        });
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (user: UserBasicInterface): ReactNode => {
                    let header: string | MultiValueAttributeInterface;
                    let subHeader: string | MultiValueAttributeInterface;
                    const isNameAvailable = user.name?.familyName === undefined && user.name?.givenName === undefined;

                    if (user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId) {
                        subHeader = user.emails[0]
                            ? user.emails[0]
                            : user.id;

                        header = (user.name && user.name.givenName !== undefined)
                            ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                            : subHeader;

                    } else {
                        subHeader = user.userName.split("/")?.length > 1
                            ? user.userName.split("/")[ 1 ]
                            : user.userName.split("/")[ 0 ];

                        header = (user.name && user.name.givenName !== undefined)
                            ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                            : subHeader;
                    }

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-item-heading` }
                        >
                            <UserAvatar
                                data-testid="all-users-list-item-image"
                                name={
                                    user.userName.split("/")?.length > 1
                                        ? user.userName.split("/")[ 1 ]
                                        : user.userName.split("/")[ 0 ]
                                }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                            />
                            <Header.Content>
                                <div className={ isNameAvailable ? "mt-2" : "" }>{ header }</div>
                                {
                                    (!isNameAvailable) &&
                                    <Header.Subheader
                                        data-testid={ `${ testId }-item-sub-heading` }
                                    >
                                        { subHeader }
                                    </Header.Subheader>
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "type",
                id: "type",
                key: "type",
                title: (
                    <>
                        <div className={ "header-with-popup" }>
                            <span>
                                { t("extensions:manage.users.list.columns.accountType") }
                            </span>
                            <Popup
                                trigger={
                                    <div className="inline" >
                                        <Icon disabled name="info circle" className="link pointing pl-1" />
                                    </div>
                                }
                                content={ t("extensions:manage.users.list.popups.content.AccountTypeContent") }
                                position="top center"
                                size="mini"
                                hideOnScroll
                                inverted
                            />
                        </div>
                    </>
                ),
                render: (user: UserBasicInterface): ReactNode => {
                    if (user.userName === tenantAdmin) {
                        return "Owner";
                    }
                    if (resolveUserstore(user.userName) === CONSUMER_USERSTORE) {
                        return UserAccountTypes.CUSTOMER;
                    } else {
                        return UserAccountTypes.COLLABORATOR;
                    }
                }
            },
            {
                allowToggleVisibility: false,
                dataIndex: "idpType",
                id: "idpType",
                key: "idpType",
                title: (
                    <>
                        <div className={ "header-with-popup" }>
                            <span>
                                { t("extensions:manage.users.list.columns.idpType") }
                            </span>
                            <Popup
                                trigger={
                                    <div className="inline" >
                                        <Icon disabled name="info circle" className="link pointing pl-1" />
                                    </div>
                                }
                                content={ t("extensions:manage.users.list.popups.content.AccountTypeContent") }
                                position="top center"
                                size="mini"
                                hideOnScroll
                                inverted
                            />
                        </div>
                    </>
                ),
                render: (user: UserBasicInterface): ReactNode => {
                    if (user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType) {
                        return user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType;
                    } else {
                        return "N/A"
                    }
                }
            },
            {
                allowToggleVisibility: false,
                dataIndex: "userStore",
                id: "userStore",
                key: "userStore",
                title: (
                    <>
                        <div className={ "header-with-popup" }>
                            <span>
                                { t("extensions:manage.users.list.columns.userStore") }
                            </span>
                            <Popup
                                trigger={
                                    <div className="inline" >
                                        <Icon disabled name="info circle" className="link pointing pl-1" />
                                    </div>
                                }
                                content={ t("extensions:manage.users.list.popups.content.sourceContent") }
                                position="top center"
                                size="mini"
                                hideOnScroll
                                inverted
                            />
                        </div>
                    </>
                ),
                render: (user: UserBasicInterface): ReactNode => {
                    if (user[ SCIMConfigs.scim.enterpriseSchema ]?.userSource) {
                        return user[ SCIMConfigs.scim.enterpriseSchema ]?.userSource;
                    } else {
                        return "N/A";
                    }
                }
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ""
            }
        ];

        return defaultColumns;
        // if (!showMetaContent || !userMetaListContent) {
        //     return defaultColumns;
        // }
        //
        // const dynamicColumns: TableColumnInterface[]= [];
        //
        // for (const [key, value] of userMetaListContent.entries()) {
        //     if (key === "name" || key === "emails" || key === "profileUrl" || value === "") {
        //         continue;
        //     }
        //
        //     let dynamicColumn: TableColumnInterface = {
        //         allowToggleVisibility: true,
        //         dataIndex: value,
        //         id: key,
        //         key: key,
        //         title: value
        //     };
        //
        //     if (key === "meta.lastModified") {
        //         dynamicColumn = {
        //             ...dynamicColumn,
        //             render: (user: UserBasicInterface): ReactNode =>
        //                 CommonUtils.humanizeDateDifference(user?.meta?.lastModified),
        //             title: "Modified Time"
        //         };
        //     }
        //
        //     dynamicColumns.push(dynamicColumn);
        // }
        //
        // dynamicColumns.unshift(defaultColumns[0]);
        // dynamicColumns.push(defaultColumns[1);
        //
        // return dynamicColumns;
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        getAllUsersList(listItemLimit, 1, null, null, null);
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === "userName sw ") {
            getAllUsersList(listItemLimit, 1, null, null, null);
            return;
        }

        setSearchQuery(query);
        getAllUsersList(listItemLimit, 1, query, null, null);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit + 1);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const actions: TableActionsInterface[] = [
            {
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_READ")),
                icon: (user: UserBasicInterface): SemanticICONS => {
                    const userStore = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : UsersConstants.ASGARDEO_USERSTORE;

                    return !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                        ? "eye"
                        : "pencil alternate";
                },
                "data-testid": "all-users-list-item-edit-button",
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void =>
                    handleUserEdit(user),
                popupText: (user: UserBasicInterface): string => {
                    const userStore = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : UsersConstants.ASGARDEO_USERSTORE;

                    return !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            hidden: (user: UserBasicInterface): boolean => {
                const userStore = user?.userName?.split("/").length > 1
                    ? user?.userName?.split("/")[0]
                    : UsersConstants.ASGARDEO_USERSTORE;

                return !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.delete, allowedScopes)
                    || readOnlyUserStores?.includes(userStore.toString())
                    || user.userName === realmConfigs?.adminUser || authenticatedUser.includes(user.userName);
            },
            icon: (): SemanticICONS => "trash alternate",
            "data-testid": "all-users-list-item-delete-button",
            onClick: (e: SyntheticEvent, user: UserBasicInterface): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingUser(user);
            },
            popupText: (): string => t("console:manage.features.users.usersList.list.iconPopups.delete"),
            renderer: "semantic-icon"
        });

        return actions;
    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && usersList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            { t("console:manage.features.users.usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.users.usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (usersList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("console:manage.features.users.usersList.list.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("console:manage.features.users.usersList.list.emptyResultPlaceholder.subTitle.0"),
                        t("console:manage.features.users.usersList.list.emptyResultPlaceholder.subTitle.1"),
                        t("console:manage.features.users.usersList.list.emptyResultPlaceholder.subTitle.2")
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <ListLayout
            // TODO add sorting functionality.
            advancedSearch={
                <AdvancedSearchWithBasicFilters
                    onFilter={ handleUserFilter }
                    filterAttributeOptions={ [
                        {
                            key: 0,
                            text: t("console:manage.features.users.advancedSearch.form.dropdown." +
                                "filterAttributeOptions.username"),
                            value: "userName"
                        },
                        {
                            key: 1,
                            text: t("console:manage.features.users.advancedSearch.form.dropdown." +
                                "filterAttributeOptions.email"),
                            value: "emails"
                        },
                        {
                            key: 2,
                            text: "First Name",
                            value: "name.givenName"
                        },
                        {
                            key: 3,
                            text: "Last Name",
                            value: "name.familyName"
                        }
                    ] }
                    filterAttributePlaceholder={
                        t("console:manage.features.users.advancedSearch.form.inputs.filterAttribute" +
                            ".placeholder")
                    }
                    filterConditionsPlaceholder={
                        t("console:manage.features.users.advancedSearch.form.inputs.filterCondition" +
                            ".placeholder")
                    }
                    filterValuePlaceholder={
                        t("console:manage.features.users.advancedSearch.form.inputs.filterValue" +
                            ".placeholder")
                    }
                    placeholder={ t("console:manage.features.users.advancedSearch.placeholder") }
                    defaultSearchAttribute="userName"
                    defaultSearchOperator="co"
                />
            }
            currentListSize={ usersList.itemsPerPage }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            data-testid="user-mgt-user-list-layout"
            onPageChange={ handlePaginationChange }
            showPagination={ true }
            showTopActionPanel={ isLoading
            || !(!searchQuery
                && !userStoreError
                && userStoreOptions.length < 3
                && usersList?.totalResults <= 0) }
            totalPages={ Math.ceil(usersList.totalResults / listItemLimit) }
            totalListSize={ usersList.totalResults }
            paginationOptions={ {
                disableNextButton: !isNextPage
            } }
        >
            <DataTable<UserBasicInterface>
                className="users-table"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ usersList.Resources }
                onColumnSelectionChange={ onColumnSelectionChange }
                onRowClick={ (e: SyntheticEvent, user: UserBasicInterface): void => {
                    handleUserEdit(user);
                    onListItemClick && onListItemClick(e, user);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ true }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                deletingUser && (
                    <ConfirmationModal
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("console:manage.features.user.deleteUser.confirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void =>{
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => {
                            if (deletingUser.userName?.split("/")[0] === CONSUMER_USERSTORE) {
                                handleConsumerUserDelete(deletingUser.id);
                            } else {
                                handleGuestUserDelete(deletingUser.id);
                            }
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                            { t("console:manage.features.user.deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${ testId }-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { resolveUserstore(deletingUser.userName) === CONSUMER_USERSTORE
                                ? t("console:manage.features.user.deleteUser.confirmationModal.message")
                                : t("extensions:manage.guest.deleteUser.confirmationModal.message")
                            }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-confirmation-modal-content` }>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { resolveUserstore(deletingUser.userName) === CONSUMER_USERSTORE
                                ? (
                                    deletingUser[SCIMConfigs.scim.enterpriseSchema]?.userSourceId
                                        ? t("console:manage.features.user.deleteJITUser.confirmationModal.content")
                                        : t("console:manage.features.user.deleteUser.confirmationModal.content")
                                )
                                : t("extensions:manage.guest.deleteUser.confirmationModal.content")
                            }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </ListLayout>
    );
};

/**
 * Default props for the component.
 */
AllUsersList.defaultProps = {
    selection: true,
    showListItemActions: true
};
