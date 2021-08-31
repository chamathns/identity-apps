/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import * as i18next from "i18next";
import React, { lazy } from "react";
import { IdentityProviderConfig } from "./models";
import { AuthenticatorTypes, IdentityProviderManagementConstants } from "../../features/identity-providers";
import ApplicationSelectionModal from "../components/developer-getting-started/application-selection-modal";

export const identityProviderConfig: IdentityProviderConfig = {
    authenticatorResponseExtension: [
        {
            displayName: "SMS OTP",
            id: "U01TT1RQ",
            isEnabled: true,
            name: "sms-otp",
            self: "/t/carbon.super/api/server/v1/configs/authenticators/U01TT1RQ",
            tags: [
                "MFA"
            ],
            type: AuthenticatorTypes.LOCAL
        }
    ],
    authenticators: {
        [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: {
            isComingSoon: true,
            isEnabled: true
        },
        [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: {
            isComingSoon: true,
            isEnabled: true
        },
        [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/email-otp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true
        },
        [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: {
            editFlowOverrides: {
                editActionLabel: "Connect",
                getEditView: (showModal: boolean, onClose: () => void, t: i18next.TFunction, testId: string) => (
                    showModal && (
                        <ApplicationSelectionModal
                            data-testid={ `${ testId }-application-selection-modal` }
                            open={ showModal }
                            onClose={ onClose }
                            heading={
                                t("extensions:develop.identityProviders.totp.quickStart.addLoginModal.heading")
                            }
                            subHeading={
                                t("extensions:develop.identityProviders.totp.quickStart.addLoginModal.subHeading")
                            }
                            data-componentid="connections"
                        />
                    )
                )
            },
            isComingSoon: false,
            isEnabled: true
        }
    },
    editIdentityProvider: {
        showAdvancedSettings: false,
        showJitProvisioning: false,
        showOutboundProvisioning: false,
        attributesSettings: true
    },
    generalDetailsForm: {
        showCertificate: true
    },
    templates: {
        enterprise: true,
        facebook: true,
        github: true,
        google: true,
        saml: true,
        oidc: true
    },
    // Handles backward compatibility with the legacy IDP view & new connections view.
    // TODO: Remove this usage once https://github.com/wso2/product-is/issues/12052 is addressed.
    useNewConnectionsView: true,
    utils: {
        isAuthenticatorAllowed: (name: string): boolean => {
            return [
                IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.OAUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.X509_AUTHENTICATOR,
                IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR
            ].includes(name);
        },
        isProvisioningAttributesEnabled(authenticatorId: string): boolean {
            const excludedAuthenticators = new Set([
                IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID
            ]);
            /**
             * If the {@param authenticatorId} is not in the excluded set we
             * can say the provisioning attributes is enabled for authenticator.
             */
            return !excludedAuthenticators.has(authenticatorId);
        },
        hideIdentityClaimAttributes(authenticatorId: string): boolean {
            const identityClaimsHiddenAuthenticators = new Set([
                IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID
            ]);
            return identityClaimsHiddenAuthenticators.has(authenticatorId);
        },
        /**
         * Enable or disable role mappings form elements from the UI.
         * @param authenticatorId {string}
         * @return enabled or not {boolean}
         */
        isRoleMappingsEnabled(authenticatorId: string): boolean {
            return IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID !== authenticatorId;
        },
        /**
         * This method will either show or hide logo edit field. Provide {@code true}
         * to render the form input field for it.
         *
         * @see IdentityProviderConfig
         * - @param {string} <ignored> authenticatorId {string}
         */
        hideLogoInputFieldInIdPGeneralSettingsForm(): boolean {
            return true;
        },
    }
};
