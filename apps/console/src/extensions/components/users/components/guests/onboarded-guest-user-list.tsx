/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { UserstoreConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled, resolveUserstore } from "@wso2is/core/helpers";
import {
    AlertLevels,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils } from "@wso2is/core/utils";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, ListItemProps,  Popup, SemanticICONS } from "semantic-ui-react";
import {
    AppState,
    FeatureConfigInterface,
    getEmptyPlaceholderIllustrations,
    history,
    UIConstants,
} from "../../../../../features/core";
import { RealmConfigInterface } from "../../../../../features/server-configurations";
import { UserManagementConstants } from "../../../../../features/users/constants";
import { UserBasicInterface } from "../../../../../features/users/models";
import { CONSUMER_USERSTORE } from "../../../../../features/userstores";
import { deleteGuestUser } from "../../api";
import { UsersConstants } from "../../constants";
import { UserAccountSources } from "../../pages";

/**
 * Prop types for the onboarded guest users list component.
 */
interface OnboardedGuestUsersListProps extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * On user delete callback.
     *
     * @param {string} userId - ID of the deleting user.
     */
    onUserDelete?: () => void;
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
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Admin user details content.
     */
    realmConfigs: RealmConfigInterface;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Meta column list for the user list.
     */
    userMetaListContent?: Map<string, string>;
    /**
     * Users list.
     */
    onboardedGuestUsersList: UserBasicInterface[];
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * Toggle help panel visibility
     */
    showHelpPanel?: boolean;
    setShowHelpPanel: (value: boolean) => void;
}

/**
 * Onboarded guest users list component.
 *
 * @return {ReactElement}
 */
export const OnboardedGuestUsersList: React.FunctionComponent<OnboardedGuestUsersListProps> = (
    props: OnboardedGuestUsersListProps): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        onUserDelete,
        isLoading,
        readOnlyUserStores,
        featureConfig,
        onColumnSelectionChange,
        onEmptyListPlaceholderActionClick,
        onListItemClick,
        onSearchQueryClear,
        realmConfigs,
        searchQuery,
        selection,
        showListItemActions,
        onboardedGuestUsersList,
        showHelpPanel,
        setShowHelpPanel,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);

    /**
     * Set users list.
     */
    useEffect(() => {
        if (!onboardedGuestUsersList) {
            return;
        }

        setUsersList(onboardedGuestUsersList);
    }, [ onboardedGuestUsersList ]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const handleUserEdit = (userId: string) => {
        history.push(UsersConstants.getPaths().get("GUEST_USER_EDIT_PATH").replace(":id", userId));
    };

    const handleUserDelete = (userId: string): void => {
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
                onUserDelete();
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
                    const resolvedUserName = (user.name && user.name.givenName !== undefined)
                        ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                        : user.userName.split("/")?.length > 1
                            ? user.userName.split("/")[ 1 ]
                            : user.userName.split("/")[ 0 ];

                    const resolvedDescription = user.emails
                        ? user.emails[ 0 ]?.toString()
                        : user.userName;

                    const isNameAvailable = user.name?.familyName === undefined && user.name?.givenName === undefined;

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-item-heading` }
                        >
                            <UserAvatar
                                name={ user.userName }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                            />
                            <Header.Content>
                                <div className={ isNameAvailable ? "mt-2" : "" }>{ resolvedUserName }</div>
                                {
                                    (!isNameAvailable) &&
                                    <Header.Subheader
                                        data-testid={ `${ testId }-item-sub-heading` }
                                    >
                                        { resolvedDescription }
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
                dataIndex: "source",
                id: "source",
                key: "source",
                title: (
                    <> 
                        Source
                        <Popup
                            trigger={
                                <div onClick={ () => {setShowHelpPanel(!showHelpPanel)} } className="inline" >
                                    <Icon disabled name='info circle' className="link pointing pl-1" />
                                </div>
                            }
                            content="Where user is managed."
                            position="top center"
                            size="mini"
                            hideOnScroll
                            inverted
                        />
                    </>
                ),
                render: (user: UserBasicInterface): ReactNode => {
                    if (resolveUserstore(user.userName) === CONSUMER_USERSTORE) {
                        return UserAccountSources.LOCAL_CONSUMER;
                    } else {
                        return UserAccountSources.ASGARDEO;
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
                        : "PRIMARY";

                    return !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void =>
                    handleUserEdit(user?.id),
                popupText: (user: UserBasicInterface): string => {
                    const userStore = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : "PRIMARY";

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
                    : UserstoreConstants.PRIMARY_USER_STORE;

                return !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.delete, allowedScopes)
                    || readOnlyUserStores?.includes(userStore.toString())
                    || user.userName === realmConfigs?.adminUser;
            },
            icon: (): SemanticICONS => "trash alternate",
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
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
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

        if (usersList.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ "There are no guest users associated with your tenant at the moment." ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<UserBasicInterface>
                className="users-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ usersList }
                onColumnSelectionChange={ onColumnSelectionChange }
                onRowClick={ (e: SyntheticEvent, user: UserBasicInterface): void => {
                    handleUserEdit(user?.id);
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
                        assertion={ deletingUser.userName }
                        assertionHint={
                            (
                                <p>
                                    <Trans
                                        i18nKey={ "console:manage.features.user.deleteUser.confirmationModal." +
                                        "assertionHint" }
                                        tOptions={ { userName: deletingUser.userName } }
                                    >
                                        Please type <strong>{ deletingUser.userName }</strong> to confirm.
                                    </Trans>
                                </p>
                            )
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void =>{
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => handleUserDelete(deletingUser.id) }
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
                            { t("console:manage.features.user.deleteUser.confirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-confirmation-modal-content` }>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { t("console:manage.features.user.deleteUser.confirmationModal.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
OnboardedGuestUsersList.defaultProps = {
    selection: true,
    showListItemActions: true,
    showMetaContent: true
};
