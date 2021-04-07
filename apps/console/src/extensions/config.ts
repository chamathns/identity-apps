/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { UsersConstants } from "./components/users/constants";
import { ExtensionsConfigInterface } from "./models";
import { AppConstants, getSidePanelIcons } from "../features/core";

export const ExtensionsConfig = (): ExtensionsConfigInterface => ({
    componentExtensions: [
        {
            component: "application",
            panes: [
                {
                    path: "./components/component-extensions/application/quick-start-tab",
                    show: true,
                    title: "console:develop.componentExtensions.component.application.quickStart.title"
                }
            ],
            subComponent: "edit",
            type: "tab"
        }
    ],
    routes: {
        develop: [
            {
                component: "./components/application-logs/app-log-listing",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/paper-icon.svg")
                },
                id: "AppLog",
                name: "Application Logs",
                path: `${AppConstants.getDeveloperViewBasePath()}/application-logs`,
                protected: true,
                showOnSidePanel: false
            },
            {
                category: "console:develop.features.sidePanel.categories.gettingStarted",
                component: "./components/developer-getting-started/getting-started",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/shuttle-icon.svg")
                },
                id: "developer-getting-started",
                name: "Getting Started",
                order: 0,
                path: `${ AppConstants.getDeveloperViewBasePath() }/getting-started`,
                protected: true,
                showOnSidePanel: true
            },
        ],
        fullscreen: [],
        manage: [
            {
                id: "emailTemplates",
                showOnSidePanel: false
            },
            {
                id: "remoteFetchConfig",
                showOnSidePanel: false
            },
            {
                id: "approvals",
                showOnSidePanel: false
            },
            {
                id: "userStores",
                showOnSidePanel: false
            },
            {
                id: "certificates",
                showOnSidePanel: false
            },
            {
                category: "console:develop.features.sidePanel.categories.gettingStarted",
                component: "./components/manage-getting-started/getting-started",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/shuttle-icon.svg")
                },
                id: "manage-getting-started",
                name: "Getting Started",
                order: 0,
                path: `${ AppConstants.getAdminViewBasePath() }/getting-started`,
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "console:manage.features.sidePanel.categories.users",
                children: [
                    {
                        component: "./components/users/pages/consumer-user-edit",
                        exact: true,
                        icon: {
                            icon: import("./assets/images/icons/user-icon.svg")
                        },
                        id: "consumer-user-edit",
                        name: "Consumer Users Edit",
                        path: UsersConstants.getPaths().get("CONSUMER_USER_EDIT_PATH"),
                        protected: true,
                        showOnSidePanel: false
                    },
                    {
                        component: "./components/users/pages/guest-user-edit",
                        exact: true,
                        icon: {
                            icon: import("./assets/images/icons/user-icon.svg")
                        },
                        id: "guest-user-edit",
                        name: "Guest Users Edit",
                        path: UsersConstants.getPaths().get("GUEST_USER_EDIT_PATH"),
                        protected: true,
                        showOnSidePanel: false
                    }

                ],
                component: "./components/users/pages/users",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/user-icon.svg")
                },
                id: "users",
                name: "Users",
                order: 1,
                path: UsersConstants.getPaths().get("USERS_PATH"),
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "console:manage.features.sidePanel.categories.users",
                children: [
                    {
                        component: "./components/groups/pages/groups-edit",
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().childIcon
                        },
                        id: "groupsEdit",
                        name: "console:manage.features.sidePanel.editGroups",
                        path: AppConstants.getPaths().get("GROUP_EDIT"),
                        protected: true,
                        showOnSidePanel: false
                    }
                ],
                component: "./components/groups/pages/groups",
                exact: true,
                icon: {
                    icon: getSidePanelIcons().groups
                },
                id: "groups",
                name: "Groups",
                order: 2,
                path: AppConstants.getPaths().get("GROUPS"),
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "console:manage.features.sidePanel.categories.users",
                children: [
                    {
                        component: "./components/roles/pages/role-edit",
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().childIcon
                        },
                        id: "rolesEdit",
                        name: "console:manage.features.sidePanel.editRoles",
                        path: AppConstants.getPaths().get("ROLE_EDIT"),
                        protected: true,
                        showOnSidePanel: false
                    }
                ],
                component: "./components/roles/pages/role",
                exact: true,
                icon: {
                    icon: getSidePanelIcons().roles
                },
                id: "roles",
                name: "console:manage.features.sidePanel.roles",
                order: 3,
                path: AppConstants.getPaths().get("ROLES"),
                protected: true,
                showOnSidePanel: true
            }
        ]
    },
    sections: {
        components: {
            // TODO: Temporarily disable feedback button.
            // "feedback-button": "./components/feedback/feedback.tsx"
             // TODO: Temporarily use help center in the place of feedback.
            "app-switch-button": "./components/app-switch/app-switch.tsx",
            "feedback-button": "./components/help-center/helpCenter.tsx"
        }
    },
    templateExtensions: {
        applications: {
            categories: [],
            groups: [],
            templates: [
                {
                    content: {
                        quickStart: "./application-templates/templates/single-page-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7",
                    resource: "./application-templates/templates/single-page-application/single-page-application.json"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/oidc-web-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "b9c5e11e-fc78-484b-9bec-015d247561b8",
                    resource: "./application-templates/templates/oidc-web-application/oidc-web-application.json"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/saml-web-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "776a73da-fd8e-490b-84ff-93009f8ede85",
                    resource: "./application-templates/templates/saml-web-application/saml-web-application.json"
                },
                {
                    enabled: false,
                    id: "df929521-6768-44f5-8586-624126ec3f8b"
                },
                {
                    enabled: false,
                    id: "44a2d9d9-bc0c-4b54-85df-1cf08f4002ec"
                },
                {
                    enabled: false,
                    id: "custom-application"
                }
            ]
        },
        identityProviders: {
            categories: [],
            templates: [
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/google/quick-start.tsx"
                    },
                    enabled: true,
                    id: "8ea23303-49c0-4253-b81f-82c0fe6fb4a0"
                }
            ]
        }
    }
});
