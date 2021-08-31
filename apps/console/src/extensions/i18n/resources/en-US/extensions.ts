/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Extensions } from "../../models";
export const extensions: Extensions = {
    common: {
        help: {
            docSiteLink: "Go to Documentation",
            helpCenterLink: "Contact Support"
        },
    },
    console: {
        application: {
            quickStart: {
                technologySelectionWrapper: {
                    subHeading: "You can find the server endpoint details in the <1>Info section</1> to configure "
                        + "your application."
                },
                addUserOption:{
                    description: "You need a <1>customer user</1> account to login to the application.",
                    hint: "If you do not have a customer user account, click the button below to add one. " +
                        "Alternatively, you can manually add a customer user by navigating to " +
                        "<1>user management</1>.",
                    message: "If you do not already have a customer user account, contact your organization " +
                        "administrator."
                }
            }
        }
    },
    develop: {
        applications: {
            edit: {
                sections: {
                    signInMethod: {
                        sections: {
                            authenticationFlow: {
                                sections: {
                                    stepBased: {
                                        secondFactorDisabled: "Second factor authenticators can only be used if " +
                                            "<1>Username & Password</1> or a <3>Social Login</3> is present in a " +
                                            "previous step."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        identityProviders: {
            emailOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Email OTP",
                        subHeading: "Select an application to set up Email OTP login."
                    },
                    connectApp: {
                        description: "Add <1>Email OTP</1> to <3>Step 2</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add Email OTP",
                    subHeading: "Email OTP is now ready to be used as a login option for your " +
                        "applications."
                }
            },
            facebook: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Facebook Login",
                        subHeading: "Select an application to set up Facebook login."
                    },
                    connectApp: {
                        description: "Add <1>Facebook</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add Facebook Login",
                    subHeading: "Facebook identity provider is now ready to be used as a login option for your " +
                        "applications."
                }
            },
            github: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add GitHub Login",
                        subHeading: "Select an application to set up GitHub login."
                    },
                    connectApp: {
                        description: "Add <1>GitHub</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add GitHub Login",
                    subHeading: "GitHub identity provider is now ready to be used as a login option for your " +
                        "applications."
                }
            },
            google: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Google Login",
                        subHeading: "Select an application to set up Google login."
                    },
                    connectApp: {
                        description: "Add <1>Google</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add Google Login",
                    subHeading: "Google identity provider is now ready to be used as a login option for your " +
                        "applications."
                }
            },
            totp: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add TOTP",
                        subHeading: "Select an application to set up TOTP login."
                    }
                }
            },
        }
    },
    manage: {
        attributes: {
            attributes: {
                description: "View and manage attributes"
            },
            displayNameHint: "The display name will be used in the user profile to recognize the attribute, "
            +"hence be mindful on selecting it.",
            generatedAttributeMapping: {
                title: "Protocol Mappings",
                OIDCProtocol: "OpenID Connect",
                SCIMProtocol: "SCIM 2.0",
                description: "We are simplifying the process for you and adding the required mappings for "
                    +"the following protocols.",
            }
        },
        features: {
            tenant: {
                header: {
                    tenantSwitchHeader: "Switch Organization",
                    tenantAddHeader: "New Organization",
                    tenantDefaultButton: "Default",
                    tenantMakeDefaultButton: "Make default",
                    backButton: "Go back",
                    tenantSearch: {
                        placeholder: "Search organization",
                        emptyResultMessage: "No organizations found"
                    }
                },
                wizards: {
                    addTenant: {
                        heading: "Add New Organization",
                        forms: {
                            fields: {
                                tenantName: {
                                    label: "Organization Name",
                                    placeholder: "Organization name (E.g., myorg)",
                                    validations: {
                                        empty: "This is a required field.",
                                        duplicate: "An organization with the name {{ tenantName }} already exists." +
                                            " Please try a different name.",
                                        invalid: "The name you entered contains disallowed characters. It can" +
                                            " contain up to {{ characterLimit }} characters, can only consist of" +
                                            " lowercase alphanumerics and it must always begin with an alphabet" +
                                            " character.",
                                        invalidLength: "The name you entered is less than {{ characterLowerLimit }}" +
                                            " characters. It can contain up to {{ characterLimit }} characters," +
                                            " can only consist of lowercase alphanumerics and it must always begin" +
                                            " with an alphabet character."
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: "Validating new organization name...",
                                tenantCreate: "Creating the new organization...",
                                tenantSwitch: "Please wait while we redirect you to the new organization..."
                            },
                            messages: {
                                info: "Think of a good, unique organization name for your new Asgardeo workspace" +
                                    " because you won’t be able to change it later!"
                            }
                        },
                        tooltips: {
                            message: "You will use this URL to access the new organization."
                        }
                    }
                },
                notifications: {
                    addTenant: {
                        error: {
                            description: "{{ description }}",
                            message: "Error Creating Organization"
                        },
                        genericError: {
                            description: "An error occurred while creating the organization.",
                            message: "Error Creating Organization"
                        },
                        limitReachError: {
                            description: "Maximum number of allowed organizations have been reached.",
                            message: "Error Creating Organization"
                        },
                        success: {
                            description: "Successfully created organization {{ tenantName }}.",
                            message: "Organization Created"
                        }
                    },
                    defaultTenant: {
                        genericError: {
                            description: "An error occurred while updating your default organization.",
                            message: "Error Updating Organization"
                        },
                        success: {
                            description: "Successfully set {{ tenantName }} as your default organization.",
                            message: "Updated Default Organization"
                        }
                    },
                    missingClaims: {
                        message: "Some personal info is missing",
                        description: "Please visit the MyAccount application and make sure that your first name," +
                            " last name and primary email have been set in the Personal Info section."
                    },
                    getTenants: {
                        message: "Unable to fetch your organizations",
                        description: "An error occurred while fetching your organizations."
                    }
                }
            }
        },
        groups: {
            edit: {
                users: {
                    heading: "Users in the Group",
                    description: "Add or remove users belonging to this group."
                }
            }
        },
        serverConfigurations: {
            accountManagement: {
                accountRecovery: {
                    heading: "Password Recovery",
                    subHeading: "Configure settings for self-service password recovery to let users " +
                        "reset their password using an email.",
                    toggleName: "Enable password recovery"
                }
            },
            accountRecovery: {
                backButton: "Go back to Account Recovery",
                heading: "Account Recovery",
                passwordRecovery: {
                    form: {
                        fields: {
                            enable: {
                                hint: "Enabling this will let the business users reset their password using an email.",
                                label: "Enable"
                            },
                            expiryTime: {
                                hint: "Password recovery link expiry time in minutes.",
                                label: "Recovery link expiry time",
                                placeholder: "Enter expiry time",
                                validations: {
                                    invalid: "Recovery link expiry time cannot be 0.",
                                    required: "Recovery link expiry time is a required field.",
                                    empty: "Recovery link expiry time cannot be null."
                                }
                            },
                            notifySuccess: {
                                hint: "This specifies whether to notify the user via an email when password " +
                                    "recovery is successful.",
                                label: "Notify on successful recovery"
                            }
                        }
                    },
                    connectorDescription: "Enable self-service password recovery option for the business users " +
                        "on the login page.",
                    heading: "Password Recovery",
                    notification: {
                        error: {
                            description: "Error updating the password recovery configuration.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the password recovery configuration.",
                            message: "Update successful"
                        }
                    },
                    subHeading: "Enable self-service password recovery option for the business users " +
                        "on the login page.\nThe user will receive a password reset link via email upon request."
                },
                subHeading: "Account recovery related settings."
            },
            accountSecurity: {
                backButton: "Go back to Account Security",
                heading: "Account Security",
                botDetection: {
                    form: {
                        fields: {
                            enable: {
                                hint: "Enabling this will enforce reCaptcha for both login and recovery.",
                                label: "Enable"
                            }
                        }
                    },
                    info: {
                        heading: "This will enforce reCAPTCHA validation in respective UIs of the following flows.",
                        subSection1: "Login to business applications",
                        subSection2: "Recover the password of a customer user",
                        subSection3: "Self registration for customer users"
                    },
                    connectorDescription: "Enable reCAPTCHA for the organization.",
                    heading: "Bot Detection",
                    notification: {
                        error: {
                            description: "Error updating the bot detection configuration.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the bot detection configuration.",
                            message: "Update successful"
                        }
                    },
                    subHeading: "Enable reCAPTCHA for the organization."
                },
                loginAttemptSecurity: {
                    form: {
                        fields: {
                            accountLockIncrementFactor: {
                                hint: "This specifies the factor by which the account lock duration should " +
                                    "be incremented on further failed login attempts after the account is locked.",
                                label: "Account lock duration increment factor",
                                placeholder: "Enter lock duration increment factor",
                                validations: {
                                    invalid: "Account lock duration increment factor cannot be 0."
                                }
                            },
                            accountLockTime: {
                                hint: "This specifies the initial duration that the account will be locked for. " +
                                    "The account will be automatically unlocked after this time period.",
                                label: "Account lock duration",
                                placeholder: "Enter lock duration",
                                validations: {
                                    invalid: "Account lock duration cannot be 0.",
                                    required: "Account lock duration is a required field."
                                }
                            },
                            enable: {
                                hint: "Account locking will result in sending a mail to the user indicating " +
                                    "that the account has been locked.",
                                label: "Enable"
                            },
                            maxFailedAttempts: {
                                hint: "This specifies the number of consecutive failed login attempts allowed " +
                                    "before the account is locked.",
                                label: "Number of consecutive failed login attempts",
                                placeholder: "Enter max failed attempts",
                                validations: {
                                    invalid: "Max failed attempts cannot be 0.",
                                    required: "Max failed attempts is a required field."
                                }
                            }
                        }
                    },
                    info: "Once the account is locked, the account owner will be informed via email. The account " +
                        "will be automatically activated after the account lock duration.",
                    connectorDescription: "Protect accounts from password brute-force attacks by locking the " +
                        "account on consecutive failed login attempts.",
                    heading: "Login Attempts Security",
                    notification: {
                        error: {
                            description: "Error updating the login attempts security configuration.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the login attempts security configuration.",
                            message: "Update successful"
                        }
                    },
                    subHeading: "Protect accounts from password brute-force attacks by locking the account on " +
                        "consecutive failed login attempts. "
                },
                subHeading: "Account security related settings."
            },
            additionalSettings: "Additional Settings",
            generalBackButton: "Go back",
            generalDisabledLabel: "Disabled",
            generalEnabledLabel: "Enabled",
            userOnboarding: {
                backButton: "Go back to User Onboarding",
                heading: "User Onboarding",
                selfRegistration: {
                    form: {
                        fields: {
                            enable: {
                                hint: "Allow consumer users to self sign-up for this organization. " +
                                    "When enabled, users will see a link to create an account at the login screen.",
                                label: "Enable"
                            },
                            expiryTime: {
                                hint: "The expiry time for the account verification link.",
                                label: "Account verification link expiry time",
                                placeholder: "Enter expiry time",
                                validations: {
                                    invalid: "Expiry time cannot be 0.",
                                    empty: "Expiry time cannot be null."
                                }
                            },
                            signUpConfirmation: {
                                recommendationMsg:"It is recommended to enable account verification for " +
                                    "self registration.",
                                botMsg: " If not at least enable bot detection.",
                                accountLockMsg: "Account Verification enables email verification at the " +
                                    "self registration. The new account is activated only after the user verifies " +
                                    "the email",
                                hint: "This will disable email verification at the self-registration.",
                                label: "Account Verification"
                            }
                        }
                    },
                    connectorDescription: "Enable self registration for the customer users of the organization.",
                    heading: "Self Registration",
                    notification: {
                        error: {
                            description: "Error updating the self registration configuration.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the self registration configuration.",
                            message: "Update successful"
                        }
                    },
                    subHeading: "When self registration is enabled, users can register via the " +
                        "<1>Create an account</1> link on the application’s login page. This creates a new " +
                        "<3>customer</3> account in the organization."
                },
                subHeading: "User onboarding related settings"
            }
        },
        users: {
            editUserProfile: {
                userId: "User ID",
                disclaimerMessage: "This user profile belongs to a collaborator or an organization owner. Only the" +
                    " account owner can manage the profile via the My Account app.",
                accountLock: {
                    title: "Deactivate User",
                    description: "Once you deactivate the account, the user can no longer log in to the system. " +
                        "Please be certain."
                }
            },
            list: {
                columns: {
                    user: "User",
                    accountType: "Account Type",
                    idpType: "Managed By",
                    userStore: "User Store"
                },
                popups: {
                    content: {
                        AccountTypeContent: "User's relation to this organization.",
                        sourceContent: "Where user is managed."
                    }
                }
            },
            descriptions: {
                learnMore: "Learn More",
                allUser: "These are all the users in your organization.",
                consumerUser: "These users (customers) can access applications in the organization. Admins can onboard " +
                    "customers to the organization or the customers can sign up if self registration is enabled.",
                guestUser: "These users (collaborators) have access to your organization's administrative operations " +
                    "(E.g., Application On-boarding, User Management). Admins can invite users as " +
                    "collaborators to the organization and assign them permissions.",
                consumerAppInfo: "Share this link with your customers to allow access to My Account and manage their accounts."
            },
            notifications: {
                addUser: {
                    customerUser: {
                        limitReachError: {
                            description: "Maximum number of allowed customer users have been reached.",
                            message: "Error adding the new user"
                        }
                    }
                }
            }
        },
        invite: {
            notifications: {
                sendInvite: {
                    limitReachError: {
                        description: "Maximum number of allowed collaborator users have been reached.",
                        message: "Error while sending the invitation"
                    }
                }
            }
        },
        guest: {
            deleteUser: {
                confirmationModal: {
                    content: "However, the user's account is not permanently deleted from Asgardeo and " +
                        "they will still be able to access other organizations they are associated with.",
                    message: "This action is irreversible and will remove the user's association with " +
                        "this organization."
                }
            }
        },
        sidePanel: {
            categories: {
                attributeManagement: "Attribute Management",
                AccountManagement: "Account Management",
                userManagement: "User Management"
            }
        }
    }
};
