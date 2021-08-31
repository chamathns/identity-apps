/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { UserstoreConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertInterface, ProfileInfoInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ConsumerUserGroupsList } from "./consumer-user-groupslist";
import { ConsumerUserProfile } from "./consumer-user-profile";
import { AppState, FeatureConfigInterface } from "../../../../../features/core";
import { GroupsInterface, getGroupList } from "../../../../../features/groups";
import { ConnectorPropertyInterface } from "../../../../../features/server-configurations";
import { UserManagementConstants, UserSessions } from "../../../../../features/users";
import { CONSUMER_USERSTORE } from "../../../../../features/userstores";
import { SCIMConfigs } from "../../../../configs/scim";

interface EditConsumerUserPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * Password reset connector properties
     */
    connectorProperties: ConnectorPropertyInterface[];
    /**
     * Flag for request loading status.
     */
    isUserProfileLoading?: boolean;
}

/**
 * Consumer user edit component.
 *
 * @return {JSX.Element}
 */
export const EditConsumerUser: FunctionComponent<EditConsumerUserPropsInterface> = (
    props: EditConsumerUserPropsInterface
): JSX.Element => {

    const {
        user,
        handleUserUpdate,
        featureConfig,
        isUserProfileLoading,
        readOnlyUserStores,
        connectorProperties
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>(undefined);

    useEffect(() => {
        if(!user) {
            return;
        }

        const userStore = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]
            : UserstoreConstants.PRIMARY_USER_STORE;

        if (!isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
            || readOnlyUserStores?.includes(userStore?.toString())
            || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
            || user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId
        ) {
            setReadOnly(true);
        }
    }, [ user, readOnlyUserStores ]);

    useEffect(() => {
        getGroupListForDomain(CONSUMER_USERSTORE);
    }, []);

    const getGroupListForDomain = (domain: string) => {
        getGroupList(domain)
            .then((response) => {
                if (response.data.totalResults == 0) {
                    setGroupsList([]);
                } else {
                    setGroupsList(response.data.Resources);
                }
            });
    };

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };

    const resolvePanes = () => {
        if (groupList?.length > 0) {
            return ([
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.0"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <ConsumerUserProfile
                                isUserProfileLoading={ isUserProfileLoading }
                                onAlertFired={ handleAlerts }
                                user={ user }
                                handleUserUpdate={ handleUserUpdate }
                                isReadOnly={ isReadOnly }
                                connectorProperties={ connectorProperties }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.1"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <ConsumerUserGroupsList
                                onAlertFired={ handleAlerts }
                                user={ user }
                                handleUserUpdate={ handleUserUpdate }
                                isReadOnly={ isReadOnly }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.3"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <UserSessions user={ user } />
                        </ResourceTab.Pane>
                    )
                }
            ]);
        } else {
            return ([
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.0"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <ConsumerUserProfile
                                isUserProfileLoading={ isUserProfileLoading }
                                onAlertFired={ handleAlerts }
                                user={ user }
                                handleUserUpdate={ handleUserUpdate }
                                isReadOnly={ isReadOnly }
                                connectorProperties={ connectorProperties }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: t("console:manage.features.users.editUser.tab.menuItems.3"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <UserSessions user={ user } />
                        </ResourceTab.Pane>
                    )
                }
            ]);
        }
    };

    return (
        <ResourceTab
            panes={ resolvePanes() }
        />
    );
};
