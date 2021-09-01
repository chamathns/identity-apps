/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

const { execSync } = require("child_process");

const log = console.log;

log("Node pre install script started.....");

execSync("npm install @microsoft/applicationinsights-web");

log("Microsoft application insights web installation finished.....");

execSync("npm install @microsoft/applicationinsights-react-js");

log("Microsoft application insights react-js plugin installation finished.....");

log("\nFinishing up node pre install script.....");
