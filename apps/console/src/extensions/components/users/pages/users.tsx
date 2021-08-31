/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Show, AccessControlConstants } from "@wso2is/access-control";
import { CommonHelpers, hasRequiredScopes, resolveUserstore } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import {
    GridLayout,
    PageLayout,
    PrimaryButton,
    ResourceTab
} from "@wso2is/react-components";
import inRange from "lodash-es/inRange";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Card, Divider, Dropdown, Grid, Icon, Menu, Radio } from "semantic-ui-react";
import AllUsersPage from "./all-users";
import {
    AppState,
    AppUtils,
    history,
    UIConstants,
    UserBasicInterface,
    store,
    FeatureConfigInterface
} from "../../../../features/core";
import { RealmConfigInterface, getServerConfigs } from "../../../../features/server-configurations";
import { UserListInterface, UserManagementConstants, getUsersList } from "../../../../features/users";
import { CONSUMER_USERSTORE } from "../../../../features/userstores";
import { getInvitedUserList } from "../api";
import ConsumerUsersPage from "../components/consumers/consumer-users";
import GuestUsersPage, { InvitationStatuses } from "../components/guests/guest-users";
import { UsersConstants } from "../constants";
import { UserInviteInterface } from "../models";
import { AddUserWizard, WizardStepsFormTypes } from "../wizard";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import { StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import { EventPublisher } from "../../../../features/core/utils";
import { URLFragmentTypes } from "../../../../features/applications";

/**
 * Props for the Users page.
 */
type UsersPageInterface = TestableComponentInterface;

/**
 * Enum for user account types.
 *
 * @readonly
 * @enum {string}
 */
export enum UserAccountTypes {
    ALL = "All",
    CUSTOMER = "Customer",
    COLLABORATOR = "Collaborator",
    WORK = "Work",
}

/**
 * Enum for user account sources.
 *
 * @readonly
 * @enum {string}
 */
export enum UserAccountSources {
    ASGARDEO = "Asgardeo",
    LOCAL_CONSUMER = "Local/Customer"
}

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 * @type {number}
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;

/**
 * Users listing page.
 *
 * @param {UsersPageInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
const UsersPage: FunctionComponent<UsersPageInterface> = (
    props: UsersPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ selectedUserList, setSelectedUserList ] = useState<UserAccountTypes>(UserAccountTypes.ALL);
    const [ selectedAddUserType, setSelectedAddUserType] = useState<UserAccountTypes>(UserAccountTypes.ALL);
    const [ clearUserType, setClearUserType] = useState<string>("");

    const [ isConsumerUsersNextPageAvailable, setIsConsumerUsersNextPageAvailable ] = useState<boolean>(undefined);
    const [ isGuestUsersNextPageAvailable, setIsGuestUsersNextPageAvailable ] = useState<boolean>(undefined);
    const [ isAllUsersNextPageAvailable, setIsAllUsersNextPageAvailable ] = useState<boolean>(undefined);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ userStoreError, setUserStoreError ] = useState(false);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ rolesList ] = useState([]);

    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ isListUpdated, setListUpdated ] = useState(false);

    const [ allUsersList, setAllUsersList ] = useState<UserListInterface>({});
    const [ consumersList, setConsumersList ] = useState<UserListInterface>({});
    const [ guestsList, setGuestsList ] = useState<UserInviteInterface[]>([]);
    const [ onboardedGuestUserList, setOnboardedGuestUserList ] = useState<UserBasicInterface[]>([]);

    const [ invitationStatusOption, setInvitationStatusOption ] = useState<string>("Accepted");

    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);
    const [ isConsumersListRequestLoading, setConsumersListRequestLoading ] = useState<boolean>(false);
    const [ isGuestUsersListRequestLoading, setGuestUsersListRequestLoading ] = useState<boolean>(false);
    const [ isLoading, setLoading ] = useState<boolean>(true);

    const [ realmConfigs, setRealmConfigs ] = useState<RealmConfigInterface>(undefined);

    const username = useSelector((state: AppState) => state.auth.username);
    const tenantName = store.getState().config.deployment.tenant;
    const tenantSettings = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenantName));

    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(undefined);
    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number>(undefined);
    const [ totalTabs, setTotalTabs ] = useState<number>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if(CommonHelpers.lookupKey(tenantSettings, username) !== null) {
            const userSettings = CommonHelpers.lookupKey(tenantSettings, username);
            const userPreferences = userSettings[1];
            const tempColumns = new Map<string, string> ();

            if (userPreferences.identityAppsSettings.userPreferences.userListColumns.length < 1) {
                const metaColumns = UserManagementConstants.DEFAULT_USER_LIST_ATTRIBUTES;
                setUserMetaColumns(metaColumns);
                metaColumns.map((column) => {
                    if (column === "id") {
                        // tempColumns.set(column, "");
                    } else {
                        tempColumns.set(column, column);
                    }
                });
                setUserListMetaContent(tempColumns);
            }
            userPreferences.identityAppsSettings.userPreferences.userListColumns.map((column) => {
                tempColumns.set(column, column);
            });
            setUserListMetaContent(tempColumns);
        }
    }, []);

    /**
     * Set users list.
     */
    useEffect(() => {
        if (!allUsersList) {
            return;
        }

        if (hasRequiredScopes(featureConfig?.guestUser,
                featureConfig?.guestUser?.scopes?.read, allowedScopes) ) {
            getAdminUser();
        }
    }, [ allUsersList ]);

    /**
     * Called when the URL fragment updates.
     */
    useEffect(() => {
        if (totalTabs === undefined || window.location.hash.includes(URLFragmentTypes.VIEW) ||
            isEmpty(window.location.hash)) {
            return;
        }

        const urlFragment: string[] = window.location.hash.split("#" + URLFragmentTypes.TAB_INDEX);
        if (urlFragment.length === 2 && isEmpty(urlFragment[0]) && /^\d+$/.test(urlFragment[1])) {
            const tabIndex: number = parseInt(urlFragment[1], 10);

            if (inRange(tabIndex, 0, totalTabs)) {
                if (tabIndex === activeTabIndex) {
                    return;
                }
                handleActiveTabIndexChange(tabIndex);
            } else {
                // Change the tab index to defaultActiveIndex for invalid URL fragments.
                handleActiveTabIndexChange(defaultActiveIndex);
            }
        } else {
            // Change the tab index to defaultActiveIndex for invalid URL fragments.
            handleActiveTabIndexChange(defaultActiveIndex);
        }

    }, [window.location.hash, totalTabs]);

    /**
     * Handles the activeTabIndex change.
     *
     * @param {number} tabIndex - Active tab index.
     */
    const handleActiveTabIndexChange = (tabIndex: number): void => {

        history.push({
            hash: `#${ URLFragmentTypes.TAB_INDEX }${ tabIndex }`,
            pathname: window.location.pathname
        });

        setActiveTabIndex(tabIndex);
    };

    /**
     * Handles the tab change.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {number} activeIndex - Active tab index.
     */
    const handleTabChange = (e: SyntheticEvent, { activeIndex }: {activeIndex: number}): void => {

        handleActiveTabIndexChange(activeIndex);
    };

    /**
     * Resolves the tab panes based on the application config.
     *
     * @return {any[]} Resolved tab panes.
     */
    const resolveTabPanes = (): any[] => {
        const panes: any[] = [];
        panes.push({
            menuItem: "All Users",
            render: AllUserAccountsPane
        });
        panes.push({
            menuItem: "Customer Accounts",
            render: CustomerAccountsPane
        });
        if (hasRequiredScopes(featureConfig?.guestUser,
            featureConfig?.guestUser?.scopes?.read, allowedScopes)) {
            panes.push({
                menuItem: "Collaborator Accounts",
                render: CollaboratorAccountsPane
            });
        }
        panes.push({
            menuItem: (
                <Menu.Item disabled key="messages" className="upcoming-item">
                    Worker Account <span className="coming-soon-label">(Coming Soon)</span>
                </Menu.Item>
            ),
            render: null
        });

        return panes;
    }

    const AllUserAccountsPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AllUsersPage
                realmConfigs={ realmConfigs }
                handleAddWizardModalShow={ () => setShowWizard(true) }
                userMetaListContent={ userListMetaContent }
                allUsersList={ allUsersList }
                getAllUsersList={ (limit, offset, filter, attribute, domain) => {
                    getUserList(limit, offset, filter, attribute, domain)
                } }
                isUserListRequestLoading={ isUserListRequestLoading }
                isNextPage={ isAllUsersNextPageAvailable }
                isDescriptionShown={ isDescriptionShown }
                setDescriptionShown={ setDescriptionShown }
            />
        </ResourceTab.Pane>
    );

    const CustomerAccountsPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <ConsumerUsersPage
                getUsersList={ (limit, offset, filter, attribute, domain) => {
                    getUserList(limit, offset, filter, attribute, domain)
                } }
                onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                isConsumersListRequestLoading={ isConsumersListRequestLoading }
                consumersUsersList={ consumersList }
                isNextPage = { isConsumerUsersNextPageAvailable }
                isDescriptionShown={ isDescriptionShown }
                setDescriptionShown={ setDescriptionShown }
            />
        </ResourceTab.Pane>
    );

    const CollaboratorAccountsPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <GuestUsersPage
                onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                invitationStatusOption={ invitationStatusOption }
                handleInvitationStatusOptionChange={ (option) => setInvitationStatusOption(option) }
                onboardedGuestUserList={ onboardedGuestUserList?.filter(
                    (user) => user?.userName !== realmConfigs?.adminUser
                ) }
                guestUsersList={ guestsList?.filter(
                    (guest) => guest?.email !== realmConfigs?.adminUser)
                }
                getGuestUsersList={ () => getGuestUsersList() }
                getUsersList={ (limit, offset, filter, attribute, domain) => {
                    getUserList(limit, offset, filter, attribute, domain)
                } }
                isGuestUsersRequestLoading={ isGuestUsersListRequestLoading }
                isNextPage = { isGuestUsersNextPageAvailable }
                isDescriptionShown={ isDescriptionShown }
                setDescriptionShown={ setDescriptionShown }
            />
        </ResourceTab.Pane>
    );

    /**
     * Get whether to show the description
     * Help panel only shows for the first time
     */
    const isDescriptionShown = (key: string): boolean => {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        return !isEmpty(userPreferences) &&
            !userPreferences.identityAppsSettings?.devPortal?.[key];
    };

    /**
     * Set status of first time description is shown
     */
    const setDescriptionShown = (key: string): void => {
        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences) || !userPreferences?.identityAppsSettings?.devPortal) {
            return;
        }

        const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);
        newPref.identityAppsSettings.devPortal[key] = true;
        AppUtils.setUserPreferences(newPref);
    };

    /**
     * The following method set the user preferred columns to the local storage.
     *
     * @param metaColumns - string[]
     */
    const setUserMetaColumns = (metaColumns: string[]) => {
        if(CommonHelpers.lookupKey(tenantSettings, username) !== null) {
            const userSettings = CommonHelpers.lookupKey(tenantSettings, username);
            const userPreferences = userSettings[1];

            const newUserSettings = {
                ...tenantSettings,
                [ username ]: {
                    ...userPreferences,
                    identityAppsSettings: {
                        ...userPreferences.identityAppsSettings,
                        userPreferences: {
                            ...userPreferences.identityAppsSettings.userPreferences,
                            userListColumns: metaColumns
                        }
                    }
                }
            };

            LocalStorageUtils.setValueInLocalStorage(tenantName, JSON.stringify(newUserSettings));
        }
    };

    /**
     * Util method to get super admin
     */
    const getAdminUser = () => {
        getServerConfigs()
            .then((response) => {
                setRealmConfigs(response?.realmConfig);
            });
    };

    /**
     * The following method set the list of columns selected by the user to
     * the state.
     *
     * @param metaColumns - string[]
     */
    const handleMetaColumnChange = (metaColumns: string[]) => {
        metaColumns.push("profileUrl");
        const tempColumns = new Map<string, string>();
        setUserMetaColumns(metaColumns);

        metaColumns.map((column) => {
            tempColumns.set(column, column);
        });
        setUserListMetaContent(tempColumns);
        setListUpdated(true);
    };

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @return string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {

        if (attributeMap) {
            const attArray = [];
            const iterator1 = attributeMap[Symbol.iterator]();

            for (const attribute of iterator1) {
                if (attribute !== "") {
                    attArray.push(attribute);
                }
            }
            if (!attArray.includes(UserManagementConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME"))) {
                attArray.push(UserManagementConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME"));
            }
            return attArray.toString();
        }
    };

    useEffect(() => {
        getAllUsersList();
        getConsumerUsersList();
        if (hasRequiredScopes(featureConfig?.guestUser,
            featureConfig?.guestUser?.scopes?.read, allowedScopes)) {
                getGuestUsersList();
        } else {
            setSelectedUserList(UserAccountTypes.CUSTOMER);
        }
    }, []);

    useEffect(() => {
        getAllUsersList();
        getConsumerUsersList();
        if (hasRequiredScopes(featureConfig?.guestUser,
            featureConfig?.guestUser?.scopes?.read, allowedScopes)) {
                getGuestUsersList();
        } else {
            setSelectedUserList(UserAccountTypes.CUSTOMER);
        }
    }, [ listOffset, listItemLimit ]);

    useEffect(() => {
        if (!isListUpdated) {
            return;
        }

        getAllUsersList();
        getConsumerUsersList();
        if (hasRequiredScopes(featureConfig?.guestUser,
            featureConfig?.guestUser?.scopes?.read, allowedScopes)) {
                getGuestUsersList();
        } else {
            setSelectedUserList(UserAccountTypes.CUSTOMER);
        }
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        if (!allUsersList) {
            return;
        }

        setOnboardedGuestUserList(allUsersList?.Resources?.filter((user) =>
            resolveUserstore(user.userName) !== CONSUMER_USERSTORE));
    }, [ allUsersList ]);

    const getAllUsersList = () => {
        getUserList(listItemLimit, listOffset, null, null, null);
    };

    const getConsumerUsersList = () => {
        getUserList(listItemLimit, listOffset, null, null, CONSUMER_USERSTORE);
    };

    /**
     * Fetch the guest users list.
     */
    const getGuestUsersList = () => {
        setGuestUsersListRequestLoading(true);

        getInvitedUserList()
            .then((response) => {
                const data = [ ...response.data ];
                const invitations = data as UserInviteInterface[];
                const finalInvitations: UserInviteInterface[] = [];

                invitations.map((ele) => {
                    const invite: UserInviteInterface = {
                        id: ele.id,
                        email: ele.email,
                        roles: ele.roles,
                        status: ele.status
                    };
                    finalInvitations.push(invite);
                });

                setGuestsList(finalInvitations);
            }).catch((error) => {
            if (error?.response?.data?.description) {
                dispatch(addAlert({
                    description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.message")
                }));

                return;
            }

            dispatch(addAlert({
                description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                    "description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
            }));

        })
            .finally(() => {
                setGuestUsersListRequestLoading(false);
            });
    };

    const getUserList = (limit: number, offset: number, filter: string, attribute: string, domain: string) => {

        if (domain === CONSUMER_USERSTORE) {
            setConsumersListRequestLoading(true);
        } else {
            setUserListRequestLoading(true);
        }

        const modifiedLimit = limit + TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET;

        getUsersList(modifiedLimit, offset, filter, attribute, domain)
            .then((response) => {
                const data = { ...response };

                data.Resources = data?.Resources?.map((resource) => {

                    let email: string = null;

                    if (resource?.emails instanceof Array) {
                        const emailElement = resource?.emails[0];
                        if (typeof emailElement === "string") {
                            email = emailElement;
                        } else {
                            email = emailElement?.value;
                        }
                    }

                    resource.emails = [ email ];

                    return resource;
                });

                setUserStoreError(false);

                if (domain === CONSUMER_USERSTORE) {
                    setSelectedUserList(UserAccountTypes.CUSTOMER);
                    setConsumersList(moderateUsersList(data, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET));
                    return;
                }

                setSelectedUserList(UserAccountTypes.ALL);
                setAllUsersList(moderateUsersList(data, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET));
            }).catch((error) => {
            if (error?.response?.data?.description) {
                dispatch(addAlert({
                    description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.message")
                }));

                return;
            }

            dispatch(addAlert({
                description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                    "description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
            }));

            setUserStoreError(true);
            setAllUsersList({
                Resources: [],
                itemsPerPage: 10,
                links: [],
                startIndex: 1,
                totalResults: 0
            });

            return;
        })
            .finally(() => {
                if (domain === CONSUMER_USERSTORE) {
                    setConsumersListRequestLoading(false);
                } else {
                    setUserListRequestLoading(false);
                }
                setLoading(false);
            });
    };

    /**
     * Returns a moderated users list.
     *
     * @remarks There is no proper way to count the total entries in the userstore with LDAP. So as a workaround, when
     * fetching users, we request an extra entry to figure out if there is a next page.
     * TODO: Remove this function and other related variables once there is a proper fix for LDAP pagination.
     * @see {@link https://github.com/wso2/product-is/issues/7320}
     *
     * @param {UserListInterface} list - Users list retrieved from the API.
     * @param {number} requestedLimit - Requested item limit.
     * @param {number} popCount - Tempt count used which will be removed after figuring out if next page is available.
     * @return {UserListInterface}
     */
    const moderateUsersList = (list: UserListInterface, requestedLimit: number,
                               popCount: number = 1): UserListInterface => {

        const moderated: UserListInterface = list;

        if (moderated.itemsPerPage === requestedLimit) {
            moderated.Resources.splice(-1, popCount);
            if (selectedUserList === UserAccountTypes.ALL) {
                setIsAllUsersNextPageAvailable(true);
            } else if (selectedUserList === UserAccountTypes.CUSTOMER) {
                setIsConsumerUsersNextPageAvailable(true);
            } else if (selectedUserList === UserAccountTypes.COLLABORATOR) {
                setIsGuestUsersNextPageAvailable(true);
            }
        } else {
            if (selectedUserList === UserAccountTypes.ALL) {
                setIsAllUsersNextPageAvailable(false);
            } else if (selectedUserList === UserAccountTypes.CUSTOMER) {
                setIsConsumerUsersNextPageAvailable(false);
            } else if (selectedUserList === UserAccountTypes.COLLABORATOR) {
                setIsGuestUsersNextPageAvailable(false);
            }
        }

        return moderated;
    };

    const handleAddNewUserWizardClick = () => {
        setShowWizard(true);
    };

    const addUserDropdown = (
        <PrimaryButton
            data-testid={ `${ testId }-add-user-button` }
        >
            <Icon name="add"/>
            { t("console:manage.features.users.buttons.addNewUserBtn") }
            <Icon name="dropdown" className="ml-2 mr-0"/>
        </PrimaryButton>
    );

    const addUserOptions = [
        { key: 1, text: "Customer", value: "Customer", "data-testid": "users-add-user-dropdown-consumer" },
    ];

    if (hasRequiredScopes(featureConfig?.guestUser, featureConfig?.guestUser?.scopes?.create, allowedScopes)) {
        addUserOptions.push(
            { key: 2, text: "Collaborator", value: "Collaborator", "data-testid": "users-add-user-dropdown-guest" }
        );
    }

    const handleDropdownItemChange = (value: string): void => {
        if (value === "Customer") {
            eventPublisher.publish("manage-users-click-create-new", {
                "type": "customer"
            });

            setSelectedAddUserType(UserAccountTypes.CUSTOMER);
            handleAddNewUserWizardClick()
        } else if (value === "Collaborator") {
            eventPublisher.publish("manage-users-click-create-new", {
                "type": "collaborator"
            });

            setSelectedAddUserType(UserAccountTypes.COLLABORATOR);
            handleAddNewUserWizardClick()
        }
    };

    return (
        <PageLayout
            action={
                    !isLoading
                    && (
                        <Show when={ AccessControlConstants.USER_WRITE }>
                            <Dropdown
                                data-testid={ `${ testId }-add-user-dropdown` }
                                floating
                                fluid
                                icon={ null }
                                className={ "user-dropdown" }
                                trigger={ addUserDropdown }
                                value={ clearUserType }
                            >
                                <Dropdown.Menu  className={ "user-dropdown-menu" } >
                                    {addUserOptions.map((option) => (
                                    <Dropdown.Item
                                            key={ option.value }
                                            className={ "user-dropdown-menu-item" }
                                            onClick={ ()=> handleDropdownItemChange(option.value) }
                                            { ...option }
                                        />
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Show>
                )
            }
            title={ t("console:manage.pages.users.title") }
            description={ t("console:manage.pages.users.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <GridLayout
                isLoading={ isLoading }
                showTopActionPanel={ false }
            >
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 14 } computer={ 16 }>
                        <ResourceTab
                            activeIndex= { activeTabIndex }
                            data-testid= { `${testId}-resource-tabs` }
                            defaultActiveIndex={ defaultActiveIndex }
                            onTabChange={ handleTabChange }
                            panes= { resolveTabPanes() }
                            onInitialize={ ({ panesLength }) => {
                                setTotalTabs(panesLength);
                            } }
                        />
                    </Grid.Column>
                    {
                        showWizard && (
                            <AddUserWizard
                                data-testid="user-mgt-add-user-wizard-modal"
                                closeWizard={ () => {
                                    setShowWizard(false);
                                } }
                                updateList={ () => setListUpdated(true) }
                                rolesList={ rolesList }
                                emailVerificationEnabled={ true }
                                onSuccessfulUserAddition={ (id: string) => {
                                    eventPublisher.publish("manage-users-finish-creating-customer-user");

                                    setListUpdated(true);
                                    setSelectedUserList(UserAccountTypes.CUSTOMER);
                                    history.push(UsersConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH")
                                        .replace(":id", id));
                                } }
                                onInvitationSendSuccessful={ () => {
                                    eventPublisher.publish("manage-users-finish-creating-collaborator-user");

                                    setListUpdated(true);
                                    setInvitationStatusOption(InvitationStatuses.PENDING);
                                    setSelectedUserList(UserAccountTypes.COLLABORATOR);
                                    handleActiveTabIndexChange(2);
                                } }
                                defaultUserTypeSelection={ selectedAddUserType }
                            />
                        )
                    }
                </Grid.Row>
            </GridLayout>
        </PageLayout>
    );

};

/**
 * Default props for the component.
 */
UsersPage.defaultProps = {
    "data-testid": "asgardeo-users"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UsersPage;
