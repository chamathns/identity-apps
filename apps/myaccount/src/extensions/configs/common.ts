/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { CommonConfig } from "./models";
import { UserstoreConstants } from "../userstores/userstore-constants";

export const commonConfig: CommonConfig = {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: false
    },
    header: {
        renderAppSwitcherAsDropdown: false
    },
    userProfilePage: {
        showEmail: false
    },
    nonLocalCredentialUser: {
        enableNonLocalCredentialUserView: true
    },
    overviewPage: {
        enableAlternateWidgetLayout: true
    },
    accountSecurityPage: {
        accountRecovery: {
            emailRecovery: {
                enableEditEmail: false
            }
        }
    },
    personalInfoPage: {
        externalLogins: {
            disableExternalLoginsOnEmpty: true
        }
    },
    utils: {
        isManageConsentAllowedForUser(userstore: string): boolean {
            if (userstore === UserstoreConstants.ASGARDEO_USERSTORE) {
                return false;
            }
            return true;
        },
        isShowAdditionalWidgetAllowed(userstore:string) : boolean {
            if (userstore === UserstoreConstants.CUSTOMER_USERSTORE) {
                return true;
            }
            return false;
    }

}
};
