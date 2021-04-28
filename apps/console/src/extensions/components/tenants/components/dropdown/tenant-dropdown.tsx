/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, {FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState} from "react";
import {
    HeaderPropsInterface as ReusableHeaderPropsInterface,
    GenericIcon,
    useWizardAlert
} from "@wso2is/react-components";
import {
    AlertInterface,
    AlertLevels,
    TenantAssociationsInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { Button, Dropdown, Grid, Icon, Item, Menu, Placeholder, SemanticICONS } from "semantic-ui-react";
import { SessionStorageUtils } from "@wso2is/core/utils";
import { getMiscellaneousIcons } from "../../../../../features/core/configs";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../../../features/core/store";
import { AddTenantWizard } from "../add-modal";
import { makeTenantDefault } from "../../api";
import { addAlert } from "@wso2is/core/store";
import { AxiosResponse } from "axios";
import { handleTenantSwitch } from "../../utils";

/**
 * Dashboard layout Prop types.
 */
interface TenantDropdownLinkInterface extends Omit<ReusableHeaderPropsInterface, "basicProfileInfo" | "profileInfo"> {
    /**
     * Content of dropdown item.
     */
    content?: string;
    /**
     * Name of dropdown item.
     */
    name: string;
    /**
     * Icon of dropdown item.
     */
    icon: SemanticICONS;
    /**
     * Function called when dropdown item is clicked.
     */
    onClick: () => void;
}

/**
 * Interface for tenant dropdown.
 */
type TenantDropdownInterface = TestableComponentInterface;

const TenantDropdown: FunctionComponent<TenantDropdownInterface> = (
    props: TenantDropdownInterface
): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const username: string = useSelector((state: AppState) => state.auth.username);
    const email: string = useSelector((state: AppState) => state.auth.email);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const defaultTenant: string = useSelector((state: AppState) => state.auth.defaultTenant);
    const associatedTenants: string | string[] = useSelector((state: AppState) => state.auth.associatedTenants);

    const [ tenantAssociations, setTenantAssociations ] = useState<TenantAssociationsInterface>(undefined);
    const [ showTenantAddModal, setShowTenantAddModal ] = useState<boolean>(false);
    const [ isSwitchTenantsSelected, setIsSwitchTenantsSelected ] = useState<boolean>(false);

    useEffect(() => {

        const association: TenantAssociationsInterface = {
            associatedTenants: associatedTenants,
            currentTenant: tenantDomain,
            defaultTenant: defaultTenant,
            username: email ? email : username
        };

        setTenantAssociations(association);
    }, [ associatedTenants && defaultTenant ]);

    const triggerTenant = (
        <span className="tenant-dropdown-trigger" data-testid="tenant-dropdown-trigger">
            <GenericIcon
                transparent
                inline
                className="tenant-dropdown-trigger-icon"
                data-testid="tenant-dropdown-trigger-icon"
                icon={ getMiscellaneousIcons().tenantIcon }
                size="micro"
                fill="white"
                spaced="right"
            />
            <div className="tenant-dropdown-trigger-display-name ellipsis" data-testid="tenant-dropdown-display-name">
                {
                    !tenantAssociations
                        ? (
                            <Placeholder data-testid="tenant-loading-placeholder">
                                <Placeholder.Line/>
                            </Placeholder>
                        )
                        : tenantAssociations.currentTenant
                }
            </div>
        </span>
    );

    /**
     * Stops the dropdown from closing on click.
     *
     * @param { React.SyntheticEvent<HTMLElement> } e - Click event.
     */
    const handleDropdownClick = (e: SyntheticEvent<HTMLElement>): void => {
        e.stopPropagation();
    };

    const resolveAssociatedTenants = (): ReactElement => {
        if (Array.isArray(tenantAssociations.associatedTenants)) {
            return (
                <Item.Group
                    className="tenants-list"
                    unstackable
                    data-testid={ `associated-tenants-container` }
                >
                    {
                        tenantAssociations.associatedTenants.map((association, index) => (
                            <Item
                                className="tenant-account"
                                key={ index }
                                onClick={ () => handleTenantSwitch(association) }
                            >
                                <GenericIcon
                                    icon={ getMiscellaneousIcons().tenantIcon }
                                    inline
                                    size="micro"
                                    relaxed="very"
                                    rounded
                                    spaced="right"
                                    fill="white"
                                    background={
                                        association === tenantAssociations.currentTenant
                                            ? "primary"
                                            : "grey"
                                    }
                                    className="mt-3"
                                />
                                <Item.Content verticalAlign="middle">
                                    <Item.Description>
                                        <div
                                            className="name"
                                            data-testid={ `tenant-la-name` }
                                        >
                                            { association }
                                        </div>
                                        <div
                                            className="email"
                                            data-testid={ `$tenant-la-email` }
                                        >
                                            { tenantAssociations.username }
                                        </div>
                                    </Item.Description>
                                </Item.Content>
                            </Item>
                        ))
                    }
                </Item.Group>
            );
        }
    };

    const tenantDropdownLinks: TenantDropdownLinkInterface[] = [
        {
            icon: "plus",
            name: t("extensions:manage.features.tenant.header.tenantAddHeader"),
            onClick: () => { setShowTenantAddModal(true) }
        }
    ];

    const setDefaultTenant = (userId: string, tenantId: string): void => {
        makeTenantDefault(userId, tenantId)
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:manage.features.tenant.notifications.defaultTenant.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:manage.features.tenant.notifications.defaultTenant.success.message")
                    }));
                }
            })
            .catch(error => {
                setAlert({
                    description: t("extensions:manage.features.tenant.notifications.defaultTenant.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.features.tenant.notifications.defaultTenant.genericError.message")
                });
            });
    };

    const tenantDropdownMenu = (
        <Menu.Item className="tenant-dropdown-wrapper" key="tenant-dropdown">
            <Dropdown
                onBlur={ () => setIsSwitchTenantsSelected(false) }
                item
                trigger={ triggerTenant }
                floating
                className="tenant-dropdown"
                data-testid={ `tenant-dropdown` }
            >
                {
                    !isSwitchTenantsSelected ? (
                        <Dropdown.Menu onClick={ handleDropdownClick }>
                            <Item.Group className="current-tenant" unstackable>
                                <Item
                                    className="header"
                                    key={ `current-tenant` }
                                >
                                    {
                                        <GenericIcon
                                            transparent
                                            inline
                                            className="associated-tenant-icon"
                                            data-testid="associated-tenant-icon"
                                            icon={ getMiscellaneousIcons().tenantIcon }
                                            size="mini"
                                        />
                                    }
                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <div
                                                className="name ellipsis"
                                                data-testid={
                                                    `tenant-dropdown-display-name`
                                                }
                                            >
                                                {
                                                    tenantAssociations
                                                        ? tenantAssociations.currentTenant
                                                        : <Placeholder>
                                                            <Placeholder.Line/>
                                                        </Placeholder>
                                                }
                                            </div>
                                            {
                                                tenantAssociations ? (
                                                    tenantAssociations.currentTenant ===
                                                    tenantAssociations.defaultTenant ? (
                                                            <Button
                                                                primary
                                                                size="tiny"
                                                                className="default-button disabled"
                                                                data-testid={ `default-button` }
                                                            >
                                                                { t("extensions:manage.features.tenant.header.tenantDefaultButton") }
                                                            </Button>
                                                        )
                                                        : (
                                                            null

                                                            // TODO: This button should be enabled when it is made
                                                            //  possible to use the setDefaultTenant method. It needs the
                                                            //  ID of the tenant for the relevant API call. Currently,
                                                            //  the tenant ID is not being stored in the front end.
                                                            // <Button
                                                            //     primary
                                                            //     size="tiny"
                                                            //     Temporarily hidden
                                                            //     style={{display:'none'}}
                                                            //     className="default-button"
                                                            //     onClick={ () => setDefaultTenant() }
                                                            //     data-testid={ `default-button` }
                                                            // >
                                                            //     { t("extensions:manage.features.tenant.header.tenantMakeDefaultButton") }
                                                            // </Button>
                                                        )
                                                ) : null
                                            }
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                            {
                                tenantAssociations &&
                                tenantAssociations.associatedTenants &&
                                Array.isArray(tenantAssociations.associatedTenants)
                                    ? (
                                        <Dropdown.Item
                                            className="action-panel"
                                            onClick={ () => setIsSwitchTenantsSelected(true) }
                                            data-testid={ `tenant-switch-menu` }
                                        >
                                            <Icon
                                                className="link-icon"
                                                name="exchange"
                                            />
                                            { t("extensions:manage.features.tenant.header.tenantSwitchHeader") }
                                        </Dropdown.Item>
                                    )
                                    : null
                            }
                            {
                                (tenantDropdownLinks
                                    && tenantDropdownLinks.length
                                    && tenantDropdownLinks.length > 0)
                                    ? tenantDropdownLinks.map((link, index) => {
                                        const {
                                            content,
                                            icon,
                                            name,
                                            onClick
                                        } = link;

                                        return (
                                            <Dropdown.Item
                                                key={ index }
                                                className="action-panel"
                                                onClick={ onClick }
                                                // Temporarily hiding dropdown item until
                                                // modal is implemented.
                                                // style={{display:'none'}}
                                                data-testid={ `tenant-dropdown-link-${ name.replace(" ", "-") }` }
                                            >
                                                {
                                                    icon &&
                                                    <Icon
                                                        className="link-icon"
                                                        name={ icon }
                                                    />
                                                }
                                                { name }
                                                { content }
                                            </Dropdown.Item>
                                        );
                                    })
                                    : null
                            }
                        </Dropdown.Menu>
                    ) : (
                        <Dropdown.Menu onClick={ handleDropdownClick }>
                            <Item.Group className="current-tenant" unstackable>
                                <Item
                                    className="header"
                                    key={ `current-tenant` }
                                >
                                    <Grid>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 2 } floated="left">
                                                <Icon
                                                    onClick={
                                                        () => setIsSwitchTenantsSelected(false)
                                                    }
                                                    className="link-icon spaced-right"
                                                    name="arrow left"
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={ 12 }>
                                                { t("extensions:manage.features.tenant.header.tenantSwitchHeader") }
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Item>
                            </Item.Group>
                            {
                                tenantAssociations
                                    ? resolveAssociatedTenants()
                                    : null
                            }
                        </Dropdown.Menu>
                    )
                }
            </Dropdown>
        </Menu.Item>
    );

    return (
        <>
            {
                showTenantAddModal
                    ? (
                        <AddTenantWizard
                            openModal={ showTenantAddModal }
                            onCloseHandler={ () => setShowTenantAddModal(false) }/>
                    )
                    : null
            }
            { tenantDropdownMenu }
        </>
    );
};

export default TenantDropdown;
