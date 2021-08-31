/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import {FormAttributes, Notification, NotificationItem} from "@wso2is/i18n";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Extensions {
    common: {
        help: {
            docSiteLink: string;
            helpCenterLink: string;
        };
    };
    console: {
        application: {
            quickStart: {
                technologySelectionWrapper: {
                    subHeading: string;
                };
                addUserOption: {
                    description: string;
                    hint: string;
                    message: string;
                };
            };
        };
    };
    develop: {
        applications: {
            edit: {
                sections: {
                    signInMethod: {
                        sections: {
                            authenticationFlow: {
                                sections: {
                                    stepBased: {
                                        secondFactorDisabled: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        identityProviders: {
            emailOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                };
            };
            facebook: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                };
            };
            github: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                };
            };
            google: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                };
            };
            totp: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                };
            };
        };
    };
    manage: {
        attributes: {
            attributes: {
                description: string;
            };
            generatedAttributeMapping: {
                title: string;
                description: string;
                OIDCProtocol: string;
                SCIMProtocol: string;
            },
            displayNameHint: string;
        };
        features: {
            tenant: {
                header: {
                    tenantSwitchHeader: string;
                    tenantAddHeader: string;
                    tenantDefaultButton: string;
                    tenantMakeDefaultButton: string;
                    backButton: string;
                    tenantSearch: {
                        placeholder: string;
                        emptyResultMessage: string;
                    };
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
                                        invalidLength: string;
                                    };
                                };
                            };
                            loaderMessages: {
                                duplicateCheck: string;
                                tenantCreate: string;
                                tenantSwitch: string;
                            };
                            messages: {
                                info: string;
                            };
                        };
                        tooltips: {
                            message: string;
                        };
                    };
                };
                notifications: {
                    addTenant: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                        limitReachError: NotificationItem;
                        success: NotificationItem;
                    }
                    defaultTenant: Notification;
                    missingClaims: NotificationItem;
                    getTenants: NotificationItem;
                };
            };
        };
        serverConfigurations: {
            accountManagement: {
                accountRecovery: {
                    heading: string;
                    subHeading: string;
                    toggleName: string;
                };
            };
            additionalSettings: string;
            accountRecovery: {
                heading: string;
                subHeading: string;
                backButton: string;
                passwordRecovery: {
                    form: {
                        fields: {
                            enable: FormAttributes;
                            expiryTime: FormAttributes;
                            notifySuccess: FormAttributes;
                        }
                    };
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    }
                    subHeading: string;
                }
            },
            accountSecurity: {
                heading: string;
                subHeading: string;
                backButton: string;
                botDetection: {
                    form: {
                        fields: {
                            enable: FormAttributes;
                        }
                    };
                    info: {
                        heading: string;
                        subSection1: string;
                        subSection2: string;
                        subSection3: string;
                    },
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    }
                    subHeading: string;
                }
                loginAttemptSecurity: {
                    form: {
                        fields: {
                            accountLockIncrementFactor: FormAttributes;
                            accountLockTime: FormAttributes;
                            enable: FormAttributes;
                            maxFailedAttempts: FormAttributes;
                        }
                    };
                    info: string;
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    }
                    subHeading: string;
                }
            },
            generalBackButton: string;
            generalEnabledLabel: string;
            generalDisabledLabel: string;
            userOnboarding: {
                heading: string;
                subHeading: string;
                backButton: string;
                selfRegistration: {
                    form: {
                        fields: {
                            expiryTime: FormAttributes;
                            signUpConfirmation: FormAttributes;
                            enable: FormAttributes;
                        }
                    };
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    }
                    subHeading: string;
                }
            }
        };
        groups: {
            edit: {
                users: {
                    heading: string;
                    description: string;
                };
            };
        };
        users: {
            editUserProfile: {
                userId: string;
                disclaimerMessage: string;
                accountLock: {
                    title: string;
                    description: string;
                }
            };
            list: {
                columns: {
                    user: string;
                    accountType: string;
                    idpType: string;
                    userStore: string;
                };
                popups: {
                    content: {
                        AccountTypeContent: string;
                        sourceContent: string;
                    }
                }
            };
            descriptions: {
                learnMore: string;
                allUser: string;
                consumerUser: string;
                guestUser: string;
                consumerAppInfo: string;
            };
            notifications: {
                addUser: {
                    customerUser: {
                        limitReachError: NotificationItem;
                    }
                };
            };
        };
        invite: {
            notifications: {
                sendInvite: {
                    limitReachError: NotificationItem;
                }
            };
        };
        guest: {
            deleteUser: {
                confirmationModal: {
                    content: string;
                    message: string;
                }
            };
        };
        sidePanel: {
            categories: {
                attributeManagement: string;
                AccountManagement: string;
                userManagement: string;
            };
        };
    };
}
