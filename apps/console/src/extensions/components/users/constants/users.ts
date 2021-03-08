/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AppConstants } from "../../../../features/core";

/**
 * Class containing users constants.
 */
export class UsersConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // Name of the Consumer userstore.
    public static readonly CONSUMER_USERSTORE: string = "CONSUMER";

    // Name of the Asgardeo userstore.
    public static readonly ASGARDEO_USERSTORE: string = "ASGARDEO_USER";

    /**
     * Get the consumer users paths as a map.
     *
     * @return {Map<string, string>}
     */
    public static getPaths(): Map<string, string> {

        return new Map<string, string>()
            .set("USERS_PATH", `${ AppConstants.getAdminViewBasePath() }/users`)
            .set("USERS_EDIT_PATH", `${ AppConstants.getAdminViewBasePath() }/:user-type/:id`)
            .set("CONSUMER_USERS_PATH", `${ AppConstants.getAdminViewBasePath() }/consumers`)
            .set("CONSUMER_USER_EDIT_PATH", `${ AppConstants.getAdminViewBasePath() }/consumers/:id`)
            .set("GUEST_USERS_PATH", `${ AppConstants.getAdminViewBasePath() }/guests`)
            .set("GUEST_USER_EDIT_PATH", `${ AppConstants.getAdminViewBasePath() }/guests/:id`);
    }

    /**
     * Consumer user store property values
     */
    public static readonly PASSWORD_JS_REGEX: string = "^[\\S]{5,30}$";
    public static readonly ROLENAME_JS_REGEX: string =  "^[\\S]{3,30}$";
    public static readonly USERNAME_JS_REGEX: string =  "^[\\S]{3,30}$";

}
