/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { ListLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import { GuestUsersList } from "./guest-users-list";
import { OnboardedGuestUsersList } from "./onboarded-guest-user-list";
import { AdvancedSearchWithBasicFilters, UIConstants, UserBasicInterface } from "../../../../../features/core";
import { UserInviteInterface } from "../../../admin-developer/models";

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
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

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
        getUsersList(listItemLimit, listOffset, null, null, null);
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === "userName sw ") {
            getUsersList(listItemLimit, listOffset, null, null, null);
            return;
        }

        setSearchQuery(query);
        getUsersList(listItemLimit, listOffset, query, null, null);
    };

    const handleAccountStatusChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        handleInvitationStatusOptionChange(data.value as string);
    };

    return (
        <ListLayout
            // TODO add sorting functionality.
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
                    defaultSearchAttribute="userName"
                    defaultSearchOperator="co"
                    triggerClearQuery={ triggerClearQuery }
                />
            ) }
            currentListSize={ guestUsersList.length }
            listItemLimit={ null }
            onItemsPerPageDropdownChange={ null }
            data-testid="user-mgt-user-list-layout"
            onPageChange={ null }
            showPagination={ true }
            showTopActionPanel={ true }
            totalPages={ Math.ceil(guestUsersList?.length / 10) }
            totalListSize={ guestUsersList.length }
            onSearchQueryClear={ handleSearchQueryClear }
            paginationOptions={ {
                // disableNextButton: !isNextPageAvailable
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
                        data-testid="user-mgt-user-list"
                        readOnlyUserStores={ null }
                        featureConfig={ null }
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
                    guestUsersList={ guestUsersList?.filter(
                        (invitation) => invitation.status === InvitationStatuses.PENDING.toUpperCase()) }
                    getGuestUsersList={ () => getGuestUsersList() }
                    isGuestUsersRequestLoading={ isGuestUsersRequestLoading }
                />
            }
            {
                (invitationStatusOption === InvitationStatuses.EXPIRED) &&
                <GuestUsersList
                    invitationStatusOption={ invitationStatusOption }
                    onEmptyListPlaceholderActionClick={ onEmptyListPlaceholderActionClick }
                    onboardedGuestUserList={ onboardedGuestUserList }
                    guestUsersList={ guestUsersList?.filter(
                        (invitation) => invitation.status === InvitationStatuses.EXPIRED.toUpperCase()) }
                    getGuestUsersList={ () => getGuestUsersList() }
                    isGuestUsersRequestLoading={ isGuestUsersRequestLoading }
                />
            }

        </ListLayout>
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
