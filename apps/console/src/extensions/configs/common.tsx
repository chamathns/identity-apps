/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { CommonConfig } from "./models";
import { HeaderExtension, HeaderLinkCategoryInterface } from "@wso2is/react-components";
import { Menu } from "semantic-ui-react";
import { ComponentPlaceholder } from "../extension";
import { I18n } from "@wso2is/i18n";
import React from "react";

export const commonConfig: CommonConfig = {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: true
    },
    checkForUIResourceScopes: false,
    header: {
        getHeaderExtensions: (): HeaderExtension[] => [
            {
                component: <ComponentPlaceholder section="tenant-dropdown" type="component"/>,
                floated: "left"
            }
        ],
        getUserDropdownLinkExtensions: (): HeaderLinkCategoryInterface[] => [
            {
                category: "HELP",
                categoryLabel: null,
                links: [
                    {
                        "data-testid": "help-center-doc-site-nav-link",
                        name:  I18n.instance.t("extensions:common.help.docSiteLink"),
                        onClick: () => {
                            window.open(window[ "AppUtils" ].getConfig().docSiteUrl,
                                "_blank", "noopener")
                        }
                    },
                    {
                        "data-testid": "help-center-support-portal-nav-link",
                        name: I18n.instance.t("extensions:common.help.helpCenterLink"),
                        onClick: () => {
                            window.open(window[ "AppUtils" ].getConfig().helpCenterUrl,
                                "_blank", "noopener")
                        }
                    }
                ]
            }
        ],
        renderAppSwitcherAsDropdown: false
    },
    leftNavigation: {
        isLeftNavigationCategorized: {
            develop: false,
            manage: true
        }
    },
    userEditSection: {
        isGuestUser: false,
        showEmail: true
    }
};
