/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getUserStoreList } from "@wso2is/core/api";
import { Claim, ClaimDialect, ExternalClaim } from "@wso2is/core/models";
import { I18n } from "@wso2is/i18n";
import { SemanticICONS } from "semantic-ui-react";
import { AttributeConfig } from "./models";
import { ClaimManagementConstants, deleteADialect } from "../../features/claims";
import { UserStoreListItem } from "../../features/userstores";
import { getClaimsForDialect, getDialects } from "../components/claims/api";

/**
 * Check whether claims is  identity claims or not.
 *
 * @param claim claim
 */
const isIdentityClaims = (claim: ExternalClaim): boolean => {
    const identityRegex = new RegExp("wso2.org/claims/identity");
    return identityRegex.test(claim.mappedLocalClaimURI);
};

export const attributeConfig: AttributeConfig = {
    addAttributeMapping: false,
    attributeMappings: {
        deleteAction: false,
        editAttributeMappingDetails: false,
        getExternalAttributes: (attributeType: string, response: ExternalClaim[]): ExternalClaim[] => {
            const claims: ExternalClaim[] = [];

            if (attributeType == ClaimManagementConstants.SCIM) {
                response.forEach((claim: ExternalClaim) => {
                    if (!claim.mappedLocalClaimURI.match(/\/identity\//)) {
                        claims.push(claim);
                    }
                });
            } else {
                claims.push(...response);
            }

            return claims;
        },
        showDangerZone: false,
        showSCIMCore1: false
    },
    attributes: {
        addAttribute: true,
        deleteAction: false,
        description: "extensions:manage.attributes.attributes.description",
        excludeIdentityClaims: true,
        showEditTabs: false,
        showUserstoreMappingWarningIcon: false
    },
    attributesPlaceholderAddButton: (attributeType: string): boolean => {
        return attributeType !== ClaimManagementConstants.SCIM;
    },
    editAttributeMappings: {
        showAddExternalAttributeButton: (dialectID: string): boolean => {
            return true;
        }
    },
    editAttributes: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getDisplayOrder: (existingDisplayOrder: number, newDisplayOrder: string): number => {
            const DEFAULT_ATTRIBUTE_DISPLAY_ORDER = 20;
            return existingDisplayOrder > 0 ? existingDisplayOrder : DEFAULT_ATTRIBUTE_DISPLAY_ORDER;
        },
        showDangerZone: true,
        showDisplayOrderInput: false,
        showRequiredCheckBox: true
    },
    externalAttributes: {
        deleteCustomExternalDialect: async (): Promise<boolean> => {
            let dialectID = "";
            let noCustomClaims = false;

            await getDialects().then(response => {
                response.map(dialect => {
                    if (dialect.dialectURI === "urn:scim:wso2:schema") {
                        dialectID = dialect.id;
                    }
                });
            });

            await getClaimsForDialect(dialectID).then(response => {
                if (response.length === 0) {
                    noCustomClaims = true;
                }
            });

            if (noCustomClaims) {
                deleteADialect(dialectID);
            }

            return Promise.resolve(true);
        },
        editAttribute: (claim: ExternalClaim, editClaimID: string, callback: (claimID: string) => void): void => {
            if (!isIdentityClaims(claim)) {
                callback(editClaimID ? "" : claim?.id);
            }
        },
        getEditIcon: (claim: ExternalClaim, editClaimID: string): SemanticICONS => {
            if (isIdentityClaims(claim)) {
                return "eye";
            }
            if (editClaimID === claim?.id) {
                return "times";
            }
            return "pencil alternate";
        },
        getEditPopupText: (claim: ExternalClaim, editClaimID: string): string => {
            if (isIdentityClaims(claim)) {
                return I18n.instance.t("common:view");
            }
            if (editClaimID === claim?.id) {
                return I18n.instance.t("common:cancel");
            }
            return I18n.instance.t("common:edit");
        },
        hideDeleteIcon: (claim: ExternalClaim): boolean => {
            return claim?.claimURI === "sub" || isIdentityClaims(claim);
        },
        isAttributeEditable: false,
        isEditActionClickable: (claim: ExternalClaim): boolean => {
            if (isIdentityClaims(claim)) {
                return false;
            }

            return true;
        },
        isRowClickable: (dialectID: string, item: any): boolean => {
            return (
                dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC") &&
                !isIdentityClaims(item) &&
                item?.claimURI !== "sub"
            );
        },
        showActions: (dialectID: string): boolean => {
            return dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC");
        },
        showDeleteIcon: (dialectID: string, claimsList: ExternalClaim[]): boolean => {
            if (dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC")) {
                return true;
            } else if (claimsList.length > 0) {
                return claimsList[0].claimURI.includes("urn:scim:wso2:schema");
            }
        }
    },
    isRowSelectable: (claim: Claim | ExternalClaim | ClaimDialect): boolean => {
        if (isIdentityClaims(claim as ExternalClaim)) {
            return false;
        }

        return true;
    },
    isSCIMEditable: false,
    localAttributes: {
        checkAttributeNameAvailability: async (
            attributeName: string, protocol: string
        ): Promise<Map<string, boolean>> => {
            let dialectID = "";
            const availability = new Map()
                .set("SCIM", true)
                .set("OIDC", true);

            if (protocol === "OIDC" || protocol === "BOTH" ) {
                await getClaimsForDialect(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC")).then(response => {
                    response.map(attrib => {
                        if (attrib.claimURI === attributeName) {
                            availability.set("OIDC", false);
                        }
                    });
                });
            }

            if (protocol === "SCIM" || protocol === "BOTH" ) {
                await getDialects().then(response => {
                    response.map(dialect => {
                        if (dialect.dialectURI === "urn:scim:wso2:schema") {
                            dialectID = dialect.id;
                        }
                    });
                });

                if (dialectID !== "") {
                    await getClaimsForDialect(dialectID).then(response => {
                        response.map(attrib => {
                            if (attrib.claimURI === "urn:scim:wso2:schema:" + attributeName) {
                                availability.set("SCIM", false);
                            }
                        });
                    });
                }
            }

            return availability;
        },
        createCustomDialect: true,
        createWizard: {
            checkOIDCAvailability: true,
            checkSCIMAvailability: true,
            customWIzard: true,
            identifyAsCustomAttrib: true,
            showDisplayOrder: false,
            showOnlyMandatory: true,
            showPrimaryUserStore: false,
            showReadOnlyAttribute: false,
            showRegularExpression: false,
            showSummary: false
        },
        customDialectURI: "urn:scim:wso2:schema",
        getDialect: async (dialectURI: string): Promise<any> => {
            let dialectObject;
            await getDialects().then(response => {
                response.map(dialect => {
                    if (dialect.dialectURI === dialectURI) {
                        dialectObject = dialect;
                    }
                });

            });
            return Promise.resolve(dialectObject);
        },
        isSCIMCustomDialectAvailable: async (): Promise<string> => {
            let dialectID = "";

            await getDialects().then(response => {
                response.map(dialect => {
                    if (dialect.dialectURI === "urn:scim:wso2:schema") {
                        dialectID = dialect.id;
                    }
                });
            });

            return Promise.resolve(dialectID);
        },
        isUserStoresHidden: async (hiddenUserStores: string[]): Promise<UserStoreListItem[]> => {
            const userStores: UserStoreListItem[] = [];
            await getUserStoreList().then(response => {

                response.data.map((store: UserStoreListItem) => {
                    if (!hiddenUserStores.includes(store.name)) {
                        userStores.push(store);
                    }
                });

            });
            return Promise.resolve(userStores);
        },
        mapClaimToCustomDialect: true
    },
    showCustomDialectInSCIM: true
};
