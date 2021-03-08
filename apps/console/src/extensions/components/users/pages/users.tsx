/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { CommonHelpers, resolveUserstore } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Card, Divider, Grid, Icon, Radio } from "semantic-ui-react";
import AllUsersPage from "./all-users";
import { AppState, UIConstants, UserBasicInterface, history, store } from "../../../../features/core";
import { RealmConfigInterface, getServerConfigs } from "../../../../features/server-configurations";
import { UserListInterface, UserManagementConstants, getUsersList } from "../../../../features/users";
import { CONSUMER_USERSTORE } from "../../../../features/userstores";
import { ConsumerUsersConstants } from "../../consumer-users/consumer-users-constants";
import { getInvitedUserList } from "../api";
import ConsumerUsersPage from "../components/consumers/consumer-users";
import GuestUsersPage, { InvitationStatuses } from "../components/guests/guest-users";
import { UsersConstants } from "../constants";
import { UserInviteInterface } from "../models";
import {AddUserWizard, WizardStepsFormTypes} from "../wizard";


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
    CONSUMER = "Consumer",
    GUEST = "Guest",
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
    LOCAL_CONSUMER = "Local/Consumer"
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

    const [ selectedUserList, setSelectedUserList ] = useState<UserAccountTypes>(UserAccountTypes.ALL);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

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

    const [ realmConfigs, setRealmConfigs ] = useState<RealmConfigInterface>(undefined);

    const username = useSelector((state: AppState) => state.auth.username);
    const tenantName = store.getState().config.deployment.tenant;
    const tenantSettings = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenantName));

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

        getAdminUser();
    }, [ allUsersList ]);

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
        getGuestUsersList();
    }, []);

    useEffect(() => {
        getAllUsersList();
        getConsumerUsersList();
        getGuestUsersList();
    }, [ listOffset, listItemLimit ]);

    useEffect(() => {
        if (!isListUpdated) {
            return;
        }

        getAllUsersList();
        getConsumerUsersList();
        getGuestUsersList();
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
        getUserList(listItemLimit, listOffset, null, null, ConsumerUsersConstants.CONSUMER_USERSTORE);
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

        if (domain === ConsumerUsersConstants.CONSUMER_USERSTORE) {
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

                 if (domain === ConsumerUsersConstants.CONSUMER_USERSTORE) {
                     setConsumersList(moderateUsersList(data, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET));
                     return;
                 }

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
                if (domain === ConsumerUsersConstants.CONSUMER_USERSTORE) {
                    setConsumersListRequestLoading(false);
                } else {
                    setUserListRequestLoading(false);
                }
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
            } else if (selectedUserList === UserAccountTypes.CONSUMER) {
                setIsConsumerUsersNextPageAvailable(true);
            } else if (selectedUserList === UserAccountTypes.GUEST) {
                setIsGuestUsersNextPageAvailable(true);
            }
        } else {
            if (selectedUserList === UserAccountTypes.ALL) {
                setIsAllUsersNextPageAvailable(false);
            } else if (selectedUserList === UserAccountTypes.CONSUMER) {
                setIsConsumerUsersNextPageAvailable(false);
            } else if (selectedUserList === UserAccountTypes.GUEST) {
                setIsGuestUsersNextPageAvailable(false);
            }
        }

        return moderated;
    };

    const handleAddNewUserWizardClick = () => {
        setShowWizard(true);
    };

    return (
        <PageLayout
            action={
                (isUserListRequestLoading || !(!searchQuery && allUsersList?.totalResults <= 0))
                && (
                    <PrimaryButton
                        data-testid={ `${ testId }-add-user-button` }
                        onClick={ () => handleAddNewUserWizardClick()  }
                    >
                        <Icon name="add"/>
                        { t("console:manage.features.users.buttons.addNewUserBtn") }
                    </PrimaryButton>
                )
            }
            title={ t("console:manage.pages.users.title") }
            description={ t("console:manage.pages.users.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 14 } computer={ 16 }>
                        <Card.Group>
                            <Card
                                link={ false }
                                as={ "div" }
                                className={
                                    `user-type-switch-card radio-selection-card ${
                                        selectedUserList === UserAccountTypes.ALL
                                            ? "card-selected"
                                            : ""
                                    }`
                                }
                                onClick={ () => {
                                    setSelectedUserList(UserAccountTypes.ALL);
                                    getAllUsersList();
                                } }
                            >
                                <Card.Content className="selection-card-content">
                                    <div className="user-type-radio">
                                        <Radio
                                            checked={ selectedUserList === UserAccountTypes.ALL }
                                        />
                                    </div>
                                    <div className="card-content">
                                        <Card.Header>
                                            All
                                        </Card.Header>
                                        <Card.Meta>
                                            <span>
                                                Complete user list
                                            </span>
                                        </Card.Meta>
                                    </div>
                                </Card.Content>
                            </Card>
                            <Card
                                link={ false }
                                as={ "div" }
                                className={
                                    `user-type-switch-card radio-selection-card ${
                                        selectedUserList === UserAccountTypes.CONSUMER
                                            ? "card-selected"
                                            : ""
                                    }`
                                }
                                onClick={ () => {
                                    setSelectedUserList(UserAccountTypes.CONSUMER);
                                    getConsumerUsersList();
                                } }
                            >
                                <Card.Content className="selection-card-content">
                                    <div className="user-type-radio">
                                        <Radio
                                            checked={ selectedUserList === UserAccountTypes.CONSUMER }
                                        />
                                    </div>
                                    <div className="card-content">
                                        <Card.Header>
                                            Consumer Accounts
                                        </Card.Header>
                                        <Card.Meta>
                                            <span>
                                                Users that only consume applications
                                            </span>
                                        </Card.Meta>
                                    </div>
                                </Card.Content>
                            </Card>
                            <Card
                                link={ false }
                                as={ "div" }
                                className={
                                    `user-type-switch-card radio-selection-card ${
                                        selectedUserList === UserAccountTypes.GUEST
                                            ? "card-selected"
                                            : ""
                                    }`
                                }
                                onClick={ () => {
                                    setSelectedUserList(UserAccountTypes.GUEST);
                                    getAllUsersList();
                                    getGuestUsersList();
                                } }
                            >
                                <Card.Content className="selection-card-content">
                                    <div className="user-type-radio">
                                        <Radio
                                            checked={ selectedUserList === UserAccountTypes.GUEST }
                                        />
                                    </div>
                                    <div className="card-content">
                                        <Card.Header>
                                            Guest Accounts
                                        </Card.Header>
                                        <Card.Meta>
                                            <span>
                                                Collaborators of your organization
                                            </span>
                                        </Card.Meta>
                                    </div>
                                </Card.Content>
                            </Card>
                            {/* TODO: Renable the section once the feature is available. */}
                            {/*<Card*/}
                            {/*    link={ false }*/}
                            {/*    as={ "div" }*/}
                            {/*    className="user-type-switch-card radio-selection-card disabled"*/}
                            {/*    onClick={ () => setSelectedUserList(UserAccountTypes.WORK) }*/}
                            {/*>*/}
                            {/*    <Card.Content className="selection-card-content">*/}
                            {/*        <div className="user-type-radio">*/}
                            {/*            <Radio*/}
                            {/*                checked={ selectedUserList === UserAccountTypes.WORK }*/}
                            {/*            />*/}
                            {/*        </div>*/}
                            {/*        <div className="card-content">*/}
                            {/*            <Card.Header>*/}
                            {/*                Work Accounts*/}
                            {/*            </Card.Header>*/}
                            {/*            <Card.Meta>*/}
                            {/*                <span>*/}
                            {/*                    Employees of your organisation*/}
                            {/*                </span>*/}
                            {/*            </Card.Meta>*/}
                            {/*        </div>*/}
                            {/*    </Card.Content>*/}
                            {/*</Card>*/}
                        </Card.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider hidden/>
            {
                (selectedUserList === UserAccountTypes.ALL) &&
                <AllUsersPage
                    realmConfigs={ realmConfigs }
                    handleAddWizardModalShow={ () => setShowWizard(true) }
                    userMetaListContent={ userListMetaContent }
                    allUsersList={ allUsersList }
                    getAllUsersList={ (
                        limit, offset, filter, attribute, domain
                        ) => getUserList(limit, offset, filter, attribute, domain)
                    }
                    isUserListRequestLoading={ isUserListRequestLoading }
                    isNextPage={ isAllUsersNextPageAvailable }
                />
            }
            {
                (selectedUserList === UserAccountTypes.CONSUMER) &&
                <ConsumerUsersPage
                    getUsersList={ (
                            limit, offset, filter, attribute, domain
                        ) => getUserList(limit, offset, filter, attribute, domain)
                    }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    isConsumersListRequestLoading={ isConsumersListRequestLoading }
                    consumersUsersList={ consumersList }
                    isNextPage = { isConsumerUsersNextPageAvailable }
                />
            }
            {
                (selectedUserList === UserAccountTypes.GUEST) &&
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
                    getUsersList={
                        (
                            limit, offset, filter, attribute, domain
                        ) => getUserList(limit, offset, filter, attribute, domain)
                    }
                    isGuestUsersRequestLoading={ isGuestUsersListRequestLoading }
                    isNextPage = { isGuestUsersNextPageAvailable }
                />
            }
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
                            setListUpdated(true);
                            setSelectedUserList(UserAccountTypes.CONSUMER);
                            history.push(UsersConstants.getPaths().get("CONSUMER_USER_EDIT_PATH")
                                .replace(":id", id));
                        } }
                        onInvitationSendSuccessful={ () => {
                            setListUpdated(true);
                            setSelectedUserList(UserAccountTypes.GUEST);
                            setInvitationStatusOption(InvitationStatuses.PENDING);
                        } }
                        defaultUserTypeSelection={ selectedUserList }
                    />
                )
            }
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
