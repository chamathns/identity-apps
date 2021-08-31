/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { HeaderLinkCategoryInterface, HeaderExtension } from "@wso2is/react-components";

export interface CommonConfig {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: boolean;
    };
    checkForUIResourceScopes: boolean;
    header: {
        /**
         * Get the extensions for the header.
         * @return {HeaderExtension[]}
         */
        getHeaderExtensions: () => HeaderExtension[];
        /**
         * Get the user dropdown link extensions.
         * @return {HeaderLinkCategoryInterface[]}
         */
        getUserDropdownLinkExtensions: () => HeaderLinkCategoryInterface[];
        /**
         * Should the app switcher be shown as nine dots dropdown.
         */
        renderAppSwitcherAsDropdown: boolean;
    };
    leftNavigation: {
        /**
         * Should the side panel be categorized for different views.
         */
        isLeftNavigationCategorized: {
            develop: boolean;
            manage: boolean;
        };
    };
    userEditSection: {
        isGuestUser: boolean;
        showEmail: boolean;
    };
}
