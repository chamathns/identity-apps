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
    manage: {
        attributes: {
            attributes: {
                description: "View and manage attributes"
            }
        },
        features: {
            tenant: {
                header: {
                    tenantSwitchHeader: "Switch Organization",
                    tenantAddHeader: "New Organization",
                    tenantDefaultButton: "Default",
                    tenantMakeDefaultButton: "Make default"
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
                                            " character."
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: "Validating new organization name...",
                                tenantCreate: "Creating the new organization...",
                                tenantSwitch: "Please wait while we redirect you to the new organization..."
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
                            description: "Successfully set {{ tenantName }} your default organization.",
                            message: "Updated Default Organization"
                        }
                    }
                }
            }
        }
    }
};
