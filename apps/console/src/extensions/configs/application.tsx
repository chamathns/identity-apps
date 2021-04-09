/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Heading } from "@wso2is/react-components";
import React from "react";
import {Divider, Icon} from "semantic-ui-react";
import { ApplicationConfig } from "./models";
import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "../../features/applications/components/settings";
import { ClaimManagementConstants } from "../../features/claims";
import { AddUserStepContent } from "../application-templates/shared/components";
import {AppConstants} from "../../features/core/constants";
import {UsersConstants} from "../components/users/constants";

function isClaimInterface(
    claim: ExtendedClaimInterface | ExtendedExternalClaimInterface
): claim is ExtendedClaimInterface {
    if ((claim as ExtendedExternalClaimInterface).mappedLocalClaimURI == undefined) {
        return true;
    }
    return false;
}

/**
 * Check whether claims is  identity claims or not.
 *
 * @param claim claim
 */
const isIdentityClaim = (claim: ExtendedClaimInterface | ExtendedExternalClaimInterface): boolean => {
    const identityRegex = new RegExp("wso2.org/claims/identity");
    if (isClaimInterface(claim)) {
        return identityRegex.test(claim.claimURI);
    }
    return identityRegex.test(claim.mappedLocalClaimURI);
};

export const applicationConfig: ApplicationConfig = {
    advancedConfigurations: {
        showEnableAuthorization: false,
        showSaaS: false
    },
    attributeSettings: {
        advancedAttributeSettings: {
            showIncludeTenantDomain: false,
            showIncludeUserstoreDomainRole: false,
            showIncludeUserstoreDomainSubject: false,
            showRoleAttribute: false,
            showRoleMapping: false,
            showUseMappedLocalSubject: false
        },
        attributeSelection: {
            getClaims: (claims: ExtendedClaimInterface[]): ExtendedClaimInterface[] => {
                return claims.filter(claim => isIdentityClaim(claim) == false);
            },
            getExternalClaims: (claims: ExtendedExternalClaimInterface[]): ExtendedExternalClaimInterface[] => {
                return claims.filter(claim => isIdentityClaim(claim) == false);
            },
            showAttributePlaceholderTitle: false,
            showShareAttributesHint: (selectedDialect: SelectedDialectInterface): boolean => {
                return selectedDialect.id === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC");
            }
        },
        makeSubjectMandatory: false,
        roleMapping: false
    },
    editApplication: {
        extendTabs: true,
        renderHelpPanelItems: () => {
            return (
                <>
                    <Divider hidden />
                    <Heading ellipsis as="h5">
                        <strong>
                            Add User
                        </strong>
                    </Heading>
                    <div>
                        <p>
                            You will need a consumer user account to log in to the applications.
                        </p>
                        <p>
                            { " " }
                            Do not have a consumer user account?{ " " }<a
                            onClick={ () => {
                                window.open(AppConstants.getClientOrigin()
                                    + UsersConstants.getPaths().get("USERS_PATH"),
                                    "",
                                    "noopener");
                            } }
                            className="external-link link pointing primary"
                        >Create Account <Icon name="external"/></a>
                        </p>
                    </div>
                </>
            );
        },
        showProvisioningSettings: false
    },
    inboundOIDCForm: {
        shouldValidateCertificate: true,
        showClientSecretMessage: false,
        showFrontChannelLogout: false,
        showNativeClientSecretMessage: false,
        showScopeValidators: false
    },
    templates:{
        android: false,
        custom: false,
        oidc: true,
        saml: false,
        spa: true,
        windows: false
    }
};
