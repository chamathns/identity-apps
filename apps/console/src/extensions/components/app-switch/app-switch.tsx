/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, { ReactElement, SyntheticEvent } from "react";
import { AppSwitchCard, GenericIcon, Tooltip } from "@wso2is/react-components";
import ConsoleIcon from "../../../themes/default/assets/images/icons/console-icon.svg";
import MyAccountIcon from "../../../themes/default/assets/images/icons/myaccount-icon.svg";
import AppSwitchIcon from "../../../themes/default/assets/images/icons/app-switch-icon.svg";
import { Card, Dropdown, Grid } from "semantic-ui-react";
import { AppConstants } from "../../../features/core";
import { useSelector } from "react-redux";
import { AppState } from "../../../features/core";
import { Menu } from "semantic-ui-react";

/**
 * App switch buttons to switch betwwen apps.
 */
export default (): ReactElement => {

    /**
     * Stops the dropdown from closing on click.
     *
     * @param { React.SyntheticEvent<HTMLElement> } e - Click event.
     */
    const handleDropdownClick = (e: SyntheticEvent<HTMLElement>) => {
        e.stopPropagation();
    };

    const showAppSwitchButton: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.showAppSwitchButton);

    return (
        <>
            {
                showAppSwitchButton && (
                    <Menu.Item className="app-switch-button-wrapper" key="app-switch-button">
                        <Tooltip
                            compact
                            trigger={ (
                                <Dropdown
                                    item
                                    floating
                                    icon={ <GenericIcon
                                        inline
                                        transparent
                                        className="display-flex"
                                        icon={ AppSwitchIcon }
                                        fill="white"
                                    /> }
                                    className="app-switch-dropdown"
                                    data-testid={ `app-switch-dropdown` }
                                >
                                    {
                                        <Dropdown.Menu className="app-switch-dropdown-menu"
                                                       onClick={ handleDropdownClick }>
                                            <Grid className="mt-3 mb-3" centered>
                                                <Grid.Row>
                                                    <Card.Group centered>
                                                        <AppSwitchCard
                                                            background="transparent"
                                                            label={ "Console" }
                                                            imageSize="x50"
                                                            image={ ConsoleIcon }
                                                            bottomMargin={ true }
                                                            onClick={ () => {
                                                                window.open(AppConstants.getAppHomePath(), "_self")
                                                            } }
                                                            data-testid={ `app-switch-console` }
                                                        />
                                                        <AppSwitchCard
                                                            background="transparent"
                                                            label={ "My Account" }
                                                            imageSize="x50"
                                                            image={ MyAccountIcon }
                                                            bottomMargin={ true }
                                                            onClick={ () => {
                                                                window.open(
                                                                    window[ "AppUtils" ].getConfig().accountApp.path,
                                                                    "_blank",
                                                                    "noopener")
                                                            } }
                                                            data-testid={ `app-switch-myaccount` }
                                                        />
                                                    </Card.Group>
                                                </Grid.Row>
                                            </Grid>
                                        </Dropdown.Menu>
                                    }
                                </Dropdown>
                            ) }
                            content="Apps"
                            size="mini"
                        />
                    </Menu.Item>
                )
            }
        </>
    );
};
