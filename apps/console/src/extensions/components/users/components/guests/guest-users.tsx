/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { ListLayout, Message, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownProps, PaginationProps } from "semantic-ui-react";
import { GuestUsersList } from "./guest-users-list";
import { OnboardedGuestUsersList } from "./onboarded-guest-user-list";
import { AdvancedSearchWithBasicFilters, UIConstants, UserBasicInterface, FeatureConfigInterface, AppState } from "../../../../../features/core";
import { UserInviteInterface } from "../../../admin-developer/models";
import { UsersConstants } from "../../constants";
import { Icon } from "semantic-ui-react";
import { useSelector } from "react-redux";

/**
 * Props for the Guest users page.
 */
interface GuestUsersPageInterface extends TestableComponentInterface {
    guestUsersList: UserInviteInterface[];
    getGuestUsersList: () => void;
    isGuestUsersRequestLoading: boolean;
    onboardedGuestUserList: UserBasicInterface[];
    invitationStatusOption: string;
    handleInvitationStatusOptionChange: (option: string) => void;
    onEmptyListPlaceholderActionClick?: () => void;
    getUsersList: (limit: number, offset: number, filter: string, attribute: string, domain: string) => void;
    isNextPage?: boolean;
    /**
     * Toggle help description visibility
     */
    isDescriptionShown: (value: string) => boolean;
    setDescriptionShown: (value: string) => void;
}

/**
 * Enum for invitation status types.
 *
 * @readonly
 * @enum {string}
 */
export enum InvitationStatuses {
    ACCEPTED = "Accepted",
    PENDING = "Pending",
    EXPIRED = "Expired"
}

/**
 * Guest users info page.
 *
 * @param {GuestUsersPageInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
const GuestUsersPage: FunctionComponent<GuestUsersPageInterface> = (
    props: GuestUsersPageInterface
): ReactElement => {

    const {
        guestUsersList,
        getGuestUsersList,
        isGuestUsersRequestLoading,
        onboardedGuestUserList,
        invitationStatusOption,
        handleInvitationStatusOptionChange,
        onEmptyListPlaceholderActionClick,
        getUsersList,
        isNextPage,
        isDescriptionShown,
        setDescriptionShown,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ paginatedGuestList, setPaginateGuestList ] = useState<UserInviteInterface[]>([]);
    const [ finalGuestList, setFinalGuestList ] = useState<UserInviteInterface[]>([]);
    const [ filterGuestList, setFilterGuestList ] = useState<UserInviteInterface[]>([]);
    const [ sortGuestList, setGuestList ] = useState<UserInviteInterface[]>([]);
    const [ isListUpdated, setListUpdated ] = useState(true);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ showInfo, setShowInfo ] = useState<boolean>(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    /**
     * Show the description message for the first time.
     */
    useEffect(() => {
        if (isDescriptionShown(UsersConstants.QUEST_DESCRIPTION_SHOWN_STATUS_KEY)) {
            setShowInfo(true);
        }
    }, []);

    useEffect(() => {
        if (invitationStatusOption !== InvitationStatuses.ACCEPTED) {
            setListOffset(0);
            if (searchQuery === "email co " || searchQuery === "" || searchQuery === null) {
                setPaginateGuestList(guestUsersList)
                setFilterGuestList([]);
                return;
            } else if (searchQuery) {
                let searchList: UserInviteInterface[] = guestUsersList;
                if (filterGuestList.length > 0) {
                    searchList = filterGuestList;
                }
                if (searchQuery.includes("email sw ")) {
                    const searchValue = searchQuery.split("sw ")[1];
                    searchList = searchList.filter((invite) => {
                        return invite.email.startsWith(searchValue);
                    });
                } else if (searchQuery.includes("email ew ")) {
                    const searchValue = searchQuery.split("ew ")[1];
                    searchList = searchList.filter((invite) => {
                        return invite.email.endsWith(searchValue);
                    });
                } else if (searchQuery.includes("email eq ")) {
                    const searchValue = searchQuery.split("eq ")[1];
                    searchList = searchList.filter((invite) => {
                        return (invite.email === searchValue);
                    });
                } else if (searchQuery.includes("email co ")) {
                    const searchValue = searchQuery.split("co ")[1];
                    searchList = searchList.filter((invite) => {
                        return invite.email.includes(searchValue);
                    });
                }
                setPaginateGuestList(searchList);
                setFilterGuestList(searchList);
            }
        }
    }, [ searchQuery ]);

    /**
     * User effect to handle Pagination for pending/expired Guest.
     */
    useEffect(() => {
        if (invitationStatusOption !== InvitationStatuses.ACCEPTED) {
            let finalInvitations: UserInviteInterface[] = paginatedGuestList?.filter(
                (invitation) => invitation.status === invitationStatusOption.toUpperCase());
            if (finalInvitations.length > listItemLimit) {
                finalInvitations = finalInvitations.slice(listOffset, listOffset + listItemLimit);
                setFinalGuestList(finalInvitations);
                setIsNextPageAvailable(finalInvitations.length === listItemLimit);
            } else {
                setFinalGuestList(finalInvitations);
                setIsNextPageAvailable(false);
            }
        }
    }, [ paginatedGuestList, listOffset, listItemLimit ]);

    useEffect(() => {
        setPaginateGuestList(guestUsersList);
    }, [ guestUsersList ]);

    /**
     * Set default value for offset & item limit.
     */
    useEffect(() => {
        setListOffset(0);
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    }, [ invitationStatusOption ]);

    useEffect(() => {
        if (invitationStatusOption === InvitationStatuses.ACCEPTED) {
            if (searchQuery == undefined || searchQuery == "") {
                getUsersList(listItemLimit, listOffset + 1, null, null, null);
            } else  {
                getUsersList(listItemLimit, listOffset + 1, searchQuery, null, null);
            }
        }
    }, [ listOffset, listItemLimit ]);

    useEffect(() => {
        // Default value of invitationStatusOption is ACCEPTED. This webhook logic needs to be ignored if the
        // invitationStatusOption has been manually set externally.
        if (InvitationStatuses.ACCEPTED.toUpperCase() === invitationStatusOption.toUpperCase()) {
            if (!onboardedGuestUserList || onboardedGuestUserList.length == 0) {
                if (guestUsersList.filter((invitation) =>
                    invitation.status === InvitationStatuses.PENDING.toUpperCase()).length > 0) {
                    handleInvitationStatusOptionChange(InvitationStatuses.PENDING);
                } else if (guestUsersList.filter((invitation) =>
                    invitation.status === InvitationStatuses.EXPIRED.toUpperCase()).length > 0) {
                    handleInvitationStatusOptionChange(InvitationStatuses.EXPIRED);
                }
            }
        }
        // Reset invitationStatusOption to default value when unmounting this component.
        return () => {
            handleInvitationStatusOptionChange(InvitationStatuses.ACCEPTED);
        };
    }, [])

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const invitationStatusOptions = [
        {
            key: 1,
            text: "Accepted",
            value: "Accepted"
        },
        {
            key: 2,
            text: "Pending",
            value: "Pending"
        },
        {
            key: 3,
            text: "Expired",
            value: "Expired"
        }
    ];

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        if (invitationStatusOption === InvitationStatuses.ACCEPTED) {
            getUsersList(listItemLimit, listOffset, null, null, null);
        }
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        setSearchQuery(query);
        if (invitationStatusOption === InvitationStatuses.ACCEPTED) {
            if (query === "userName sw ") {
                getUsersList(listItemLimit, listOffset, null, null, null);
                return;
            }
            getUsersList(listItemLimit, listOffset, query, null, null);
        }
    };

    const handleAccountStatusChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        handleInvitationStatusOptionChange(data.value as string);
    };

    /**
     * Set status of first time help panel is shown
     */
    const handleCloseInfo = () => {
        setShowInfo(false);
        setDescriptionShown(UsersConstants.QUEST_DESCRIPTION_SHOWN_STATUS_KEY);
    }

    /**
     * Show the description message.
     */
    const renderDescription = (): ReactElement => {

        const generateContent = () => {
            return (
                <>
                    <Text className="message-info-text">
                        <p> { t("extensions:manage.users.descriptions.guestUser") }
                            <strong>
                                <a
                                    href="https://docs.asgardeo.io/guides/user-management/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link external no-wrap"
                                > { t("extensions:manage.users.descriptions.learnMore") }
                                    <Icon className="ml-7" name="caret right"/>
                                </a>
                            </strong>
                        </p>
                    </Text>
                </>
            );
        };

        return (
            <div className="mt-3 mb-6">
                {
                    showInfo &&
                    <Message
                        onDismiss={ handleCloseInfo }
                        content={ generateContent() }
                    />
                }
            </div>
        );
    };

    return (
        <>
            { showInfo && renderDescription() }
            <ListLayout
                // TODO add sorting functionality.
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleUserFilter }
                        filterAttributeOptions={ (invitationStatusOption === InvitationStatuses.ACCEPTED) ? [
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
                            }
                        ]:
                        [
                            {
                                key: 0,
                                text: t("console:manage.features.users.advancedSearch.form.dropdown." +
                                    "filterAttributeOptions.email"),
                                value: "email"
                            }
                        ]
                        }
                        filterAttributePlaceholder={
                            t("console:manage.features.users.advancedSearch.form.inputs.filterAttribute.placeholder")
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
                        defaultSearchAttribute={(invitationStatusOption === InvitationStatuses.ACCEPTED) ? "userName": "email"}
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={
                    invitationStatusOption === InvitationStatuses.ACCEPTED ?
                    onboardedGuestUserList?.length : finalGuestList?.length }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-testid="user-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                showTopActionPanel={ true }
                totalPages={ invitationStatusOption === InvitationStatuses.ACCEPTED ?
                    Math.ceil(onboardedGuestUserList?.length / listItemLimit) :
                    Math.ceil(paginatedGuestList?.length / listItemLimit) }
                totalListSize={ invitationStatusOption === InvitationStatuses.ACCEPTED ?
                    onboardedGuestUserList?.length : paginatedGuestList?.length }
                onSearchQueryClear={ handleSearchQueryClear }
                paginationOptions={ {
                    disableNextButton: invitationStatusOption === InvitationStatuses.ACCEPTED ?
                    !isNextPage : !isNextPageAvailable,
                    disablePreviousButton: (listOffset < 1)
                } }
                leftActionPanel={
                    (
                        <Dropdown
                            data-testid="user-mgt-user-list-userstore-dropdown"
                            selection
                            options={ invitationStatusOptions && invitationStatusOptions }
                            onChange={ handleAccountStatusChange }
                            text={ `Filter by: ${ invitationStatusOption }` }
                        />
                    )
                }
            >
                {
                    (invitationStatusOption === InvitationStatuses.ACCEPTED) &&
                        <OnboardedGuestUsersList
                            advancedSearch={ (
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
                                    triggerClearQuery={ triggerClearQuery }
                                />
                            ) }
                            onboardedGuestUsersList={ onboardedGuestUserList }
                            userMetaListContent={ null }
                            isLoading={ isGuestUsersRequestLoading }
                            realmConfigs={ null }
                            onEmptyListPlaceholderActionClick={ onEmptyListPlaceholderActionClick }
                            onSearchQueryClear={ handleSearchQueryClear }
                            searchQuery={ searchQuery }
                            data-testid="user-mgt-user-list"
                            readOnlyUserStores={ null }
                            featureConfig={ featureConfig }
                            onUserDelete={ () =>
                                getUsersList(listItemLimit, listOffset, null, null, null)
                            }
                        />
                }
                {
                    (invitationStatusOption === InvitationStatuses.PENDING) &&
                    <GuestUsersList
                        invitationStatusOption={ invitationStatusOption }
                        onEmptyListPlaceholderActionClick={ onEmptyListPlaceholderActionClick }
                        onboardedGuestUserList={ onboardedGuestUserList }
                        onSearchQueryClear={ handleSearchQueryClear }
                        guestUsersList={ finalGuestList }
                        getGuestUsersList={ () => getGuestUsersList() }
                        isGuestUsersRequestLoading={ isGuestUsersRequestLoading }
                        searchQuery={ searchQuery }
                    />
                }
                {
                    (invitationStatusOption === InvitationStatuses.EXPIRED) &&
                    <GuestUsersList
                        invitationStatusOption={ invitationStatusOption }
                        onEmptyListPlaceholderActionClick={ onEmptyListPlaceholderActionClick }
                        onboardedGuestUserList={ onboardedGuestUserList }
                        onSearchQueryClear={ handleSearchQueryClear }
                        guestUsersList={ finalGuestList?.filter(
                            (invitation) => invitation.status === InvitationStatuses.EXPIRED.toUpperCase()) }
                        getGuestUsersList={ () => getGuestUsersList() }
                        isGuestUsersRequestLoading={ isGuestUsersRequestLoading }
                        searchQuery={ searchQuery }
                    />
                }

            </ListLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
GuestUsersPage.defaultProps = {
    "data-testid": "asgardeo-guest-users"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GuestUsersPage;
