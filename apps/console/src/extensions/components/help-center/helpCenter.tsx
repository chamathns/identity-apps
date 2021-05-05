/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, { ReactElement } from "react";
import { GenericIcon, Tooltip } from "@wso2is/react-components";
import { useSelector } from "react-redux";
import { AppState } from "../../../features/core";
import { Icon, Menu } from "semantic-ui-react";

/**
 * Contact Support Icon to link support portal.
 */
export default (): ReactElement => {

    const helpCenterURL: string = useSelector((state: AppState) => state.config.deployment.helpCenterURL);

    return (
        <>
            {
                (helpCenterURL && helpCenterURL !== "") && (
                    <Menu.Item className="help-center-button-wrapper" key="feedback-button">
                        <Tooltip
                            compact
                            trigger={ (
                                <Menu.Item
                                    className="help-center-button"
                                    onClick={ () => window.open(helpCenterURL, "_blank", "noopener") }
                                >
                                    <GenericIcon
                                        inverted
                                        transparent
                                        hoverable
                                        hoverType="circular"
                                        icon={ (
                                            <Icon
                                                className="help-center-button-icon"
                                                size="large"
                                                name="question circle outline"
                                            />
                                        ) }
                                        size="auto"
                                    />
                                </Menu.Item>
                            ) }
                            content="Contact Support"
                            size="mini"
                        />
                    </Menu.Item>
                )
            }
        </>
    );
};
