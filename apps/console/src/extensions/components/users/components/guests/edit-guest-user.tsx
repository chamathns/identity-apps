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
import { Hint, ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppConstants } from "../../../../../features/core/constants";
import { FeatureConfigInterface } from "../../../../../features/core/models";
import { AppState } from "../../../../../features/core/store";
import { ConnectorPropertyInterface, RealmConfigInterface } from "../../../../../features/server-configurations/models";
import { UserProfile, UserSessions } from "../../../../../features/users";
import { UserManagementConstants } from "../../../../../features/users/constants";
import { hiddenPermissions } from "../../../roles/meta";
import { UserRolesList } from "./user-roles-edit";
import { Divider, Grid, Message } from "semantic-ui-react";
import { SCIMConfigs } from "../../../../configs/scim";

interface EditGuestUserPropsInterface extends SBACInterface<FeatureConfigInterface> {
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
     * Is read only user stores loading.
     */
    isReadOnlyUserStoresLoading?: boolean;
    /**
     * Tenant details
     */
    realmConfigs: RealmConfigInterface;
}

/**
 * Guest user edit component.
 *
 * @return {JSX.Element}
 */
export const EditGuestUser: FunctionComponent<EditGuestUserPropsInterface> = (
    props: EditGuestUserPropsInterface
): JSX.Element => {

    const {
        user,
        realmConfigs,
        handleUserUpdate,
        featureConfig,
        readOnlyUserStores,
        connectorProperties,
        isReadOnlyUserStoresLoading
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);
    const isGroupAndRoleSeparationEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isGroupAndRoleSeparationEnabled);

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ allowDeleteOnly, setAllowDeleteOnly] = useState<boolean>(false);

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

        if (isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE")) &&
            !(user.userName == realmConfigs?.adminUser) &&
            hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.delete, allowedScopes)) {
            setAllowDeleteOnly(true);
        }

    }, [ user, readOnlyUserStores ]);

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };

    const panes = () => ([
        {
            menuItem: t("console:manage.features.users.editUser.tab.menuItems.0"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserProfile
                        tenantAdmin={ realmConfigs?.adminUser }
                        editUserDisclaimerMessage={ (
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                                        <Message color="teal">
                                            <Hint>
                                                { t("extensions:manage.users.editUserProfile.disclaimerMessage") }
                                            </Hint>
                                        </Message>
                                        <Divider hidden/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        ) }
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        allowDeleteOnly={ allowDeleteOnly }
                        isReadOnly={ isReadOnly }
                        connectorProperties={ connectorProperties }
                        isReadOnlyUserStoresLoading={ isReadOnlyUserStoresLoading }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("console:manage.features.users.editUser.tab.menuItems.2"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserRolesList
                        showDomain={ false }
                        hideApplicationRoles={ true }
                        isGroupAndRoleSeparationEnabled={ isGroupAndRoleSeparationEnabled }
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        isReadOnly={ false }
                        permissionsToHide={
                            (AppConstants.getTenant() !== AppConstants.getSuperTenant())
                                ? hiddenPermissions
                                : []
                        }
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

    return (
        <ResourceTab
            panes={ panes() }
        />
    );
};
