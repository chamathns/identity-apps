/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Notification } from "@wso2is/i18n";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Extensions {
    manage: {
        attributes: {
            attributes: {
                description: string;
            };
        };
        features: {
            tenant: {
                header: {
                    tenantSwitchHeader: string;
                    tenantAddHeader: string;
                    tenantDefaultButton: string;
                    tenantMakeDefaultButton: string;
                };
                wizards: {
                    addTenant: {
                        heading: string;
                        forms: {
                            fields: {
                                tenantName: {
                                    label: string;
                                    placeholder: string;
                                    validations: {
                                        empty: string;
                                        duplicate: string;
                                        invalid: string;
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: string;
                                tenantCreate: string;
                                tenantSwitch: string;
                            }
                        },
                        tooltips: {
                            message: string;
                        }
                    }
                };
                notifications: {
                    addTenant: Notification;
                    defaultTenant: Notification;
                }
            };
        }
    };
}
