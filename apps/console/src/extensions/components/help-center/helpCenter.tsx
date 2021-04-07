/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

 import React, { ReactElement, useState } from "react";
 import { GenericIcon } from "@wso2is/react-components";
 import { ReactComponent as SupportHeadsetIcon } from "../../assets/images/icons/support-headset-icon.svg";
 import { ReactComponent as helpCenterIcon } from "../../assets/images/icons/help-center-icon.svg";
 import { useSelector } from "react-redux";
 import { AppState } from "../../../features/core";
 
 /**
  * Contact Support Icon to link support portal.
  */
 export default (): ReactElement => {

    const helpCenterURL: string = useSelector((state: AppState) => state.config.deployment.helpCenterURL);
 
    return (
         <>
             {
                 helpCenterURL && helpCenterURL !=="" &&
                 <div
                     className="help-center-component"
                     onClick={ () =>window.open(helpCenterURL, "_blank", "noopener") }
                 >
                     <GenericIcon
                             className={"helpcenter-icon icon"}
                             transparent
                             icon={ helpCenterIcon }
                             size="micro"
                             fill="white"
                             spaced="right"
                         />
                     <div className="helpcenter-title">
                         Contact Support
                     </div>
                 </div>
             }
         </>
     );
 };
