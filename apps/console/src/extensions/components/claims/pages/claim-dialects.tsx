/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getDialects } from "@wso2is/core/api";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ClaimDialect, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar, EmphasizedSegment, GenericIcon, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Header, Icon, Image, List, Placeholder, Popup } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    getSidePanelIcons,
    getTechnologyLogos,
    history
} from "../../../../features/core";
import { AddDialect } from "../components";
import { ClaimManagementConstants } from "../../../../features/claims/constants";

/**
 * Props for the Claim Dialects page.
 */
type ClaimDialectsPageInterface = TestableComponentInterface;

/**
 * This displays a list fo claim dialects.
 *
 * @param {ClaimDialectsPageInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
const ClaimDialectsPage: FunctionComponent<ClaimDialectsPageInterface> = (
    props: ClaimDialectsPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ addEditClaim, setAddEditClaim ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ oidcAttributeMappings, setOidcAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ scimAttributeMappings, setScimAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ otherAttributeMappings, setOtherAttributeMappings ] = useState<ClaimDialect[]>([]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);
    const dispatch = useDispatch();

    const listAllAttributeDialects: boolean = useSelector(
        (state: AppState) => state.config.ui.listAllAttributeDialects
    );

    /**
     * Fetches all the dialects.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     */
    const getDialect = (limit?: number, offset?: number, sort?: string, filter?: string): void => {
        setIsLoading(true);
        getDialects({
            filter,
            limit,
            offset,
            sort
        })
            .then((response: ClaimDialect[]) => {
                const filteredDialect: ClaimDialect[] = response.filter((claim: ClaimDialect) => {
                    if (!listAllAttributeDialects) {
                        return (
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("LOCAL") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("AXSCHEMA") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_LEGAL") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_NATURAL") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OPENID_NET") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("XML_SOAP")
                        );
                    }

                    return claim.id !== "local";
                });

                const oidc: ClaimDialect[] = [];
                const scim: ClaimDialect[] = [];
                const others: ClaimDialect[] = [];

                filteredDialect.forEach((attributeMapping: ClaimDialect) => {
                    if (ClaimManagementConstants.OIDC_MAPPING.includes(attributeMapping.dialectURI)) {
                        oidc.push(attributeMapping);
                    } else if (ClaimManagementConstants.SCIM_MAPPING.includes(attributeMapping.dialectURI)) {
                        scim.push(attributeMapping);
                    } else {
                        others.push(attributeMapping);
                    }
                });

                setOidcAttributeMappings(oidc);
                setScimAttributeMappings(scim);
                setOtherAttributeMappings(others);
            })
            .catch((error) => {
                dispatch(
                    addAlert({
                        description:
                            error?.response?.data?.description ||
                            t(
                                "console:manage.features.claims.dialects.notifications.fetchDialects" +
                                ".genericError.description"
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error?.response?.data?.message ||
                            t(
                                "console:manage.features.claims.dialects.notifications.fetchDialects" +
                                ".genericError.message"
                            )
                    })
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        getDialect();
    }, []);

    return (
        <>
            { /* addEditClaim && (
                <AddDialect
                    open={ addEditClaim }
                    onClose={ () => {
                        setAddEditClaim(false);
                    } }
                    update={ getDialect }
                    data-testid={ `${ testId }-add-dialect-wizard` }
                />
            )  */}
            <PageLayout
                /* action={
                    <PrimaryButton
                        onClick={ () => {
                            setAddEditClaim(true);
                        } }
                        data-testid={ `${ testId }-list-layout-add-button` }
                    >
                        <Icon name="add" />
                        { t("console:manage.features.claims.dialects.pageLayout.list.primaryAction") }
                    </PrimaryButton>
                } */
                isLoading={ isLoading }
                title={ t("console:manage.features.claims.dialects.pageLayout.list.title") }
                description={ t("console:manage.features.claims.dialects.pageLayout.list.description") }
                data-testid={ `${ testId }-page-layout` }
            >
                { hasRequiredScopes(
                    featureConfig?.attributeDialects,
                    featureConfig?.attributeDialects?.scopes?.read,
                    allowedScopes
                ) && (
                        <>
                            <Header as="h4">
                                { t("console:manage.features.claims.dialects.sections.manageAttributes.heading") }
                            </Header>
                            <Divider hidden />
                            <EmphasizedSegment
                                onClick={ () => {
                                    history.push(AppConstants.getPaths().get("LOCAL_CLAIMS"));
                                } }
                                className="clickable"
                                data-testid={ `${ testId }-local-dialect-container` }
                            >
                                <List>
                                    <List.Item>
                                        <Grid>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 12 }>
                                                    <GenericIcon
                                                        verticalAlign="middle"
                                                        fill="primary"
                                                        transparent
                                                        rounded
                                                        icon={ getSidePanelIcons().claims }
                                                        spaced="right"
                                                        size="mini"
                                                        floated="left"
                                                    />

                                                    <List.Header>
                                                        { t(
                                                            "console:manage.features.claims.dialects.sections." +
                                                            "manageAttributes.attributes.heading"
                                                        ) }
                                                    </List.Header>
                                                    <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                        Each attribute contains a piece of stored user data.
                                                    </List.Description>
                                                </Grid.Column>
                                                <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                                    <Popup
                                                        content={ t("common:edit") }
                                                        trigger={
                                                            <Icon color="grey" name="pencil" />
                                                        }
                                                        inverted
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Item>
                                </List>
                            </EmphasizedSegment>
                        </>
                    ) }
                <Divider hidden />
                <Divider hidden />
                <Divider />
                <Divider hidden />
                <Header as="h4">
                    { t("console:manage.features.claims.dialects.sections.manageAttributeMappings.heading") }
                </Header>
                <Divider hidden />
                { !isLoading ? (
                    oidcAttributeMappings.length > 0 && (
                        <EmphasizedSegment className="clickable" data-testid={ `${ testId }-oidc-dialect-container` }>
                            <List>
                                <List.Item
                                    onClick={ () => {
                                        history.push(
                                            AppConstants.getPaths()
                                                .get("ATTRIBUTE_MAPPINGS")
                                                .replace(":type", ClaimManagementConstants.OIDC)
                                        );
                                    } }
                                >
                                    <Grid>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 12 }>
                                                <GenericIcon
                                                    transparent
                                                    verticalAlign="middle"
                                                    rounded
                                                    icon={ getTechnologyLogos().oidc }
                                                    spaced="right"
                                                    size="mini"
                                                    floated="left"
                                                />
                                                <List.Header>
                                                    { t(
                                                        "console:manage.features.claims.dialects.sections." +
                                                        "manageAttributeMappings.oidc.heading"
                                                    ) }
                                                </List.Header>
                                                <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                    { t(
                                                        "console:manage.features.claims.attributeMappings." +
                                                        "oidc.description"
                                                    ) }
                                                </List.Description>
                                            </Grid.Column>
                                            <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                                <Popup
                                                    content={ t("common:edit") }
                                                    trigger={
                                                        <Icon color="grey" name="pencil" />
                                                    }
                                                    inverted
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Item>
                            </List>
                        </EmphasizedSegment>
                    )
                ) : (
                        <Placeholder fluid>
                            <Placeholder.Header image>
                                <Placeholder.Line length="full" />
                                <Placeholder.Line length="medium" />
                            </Placeholder.Header>
                        </Placeholder>
                    ) }
                { !isLoading ? (
                    scimAttributeMappings.length > 0 && (
                        <EmphasizedSegment
                            onClick={ () => {
                                history.push(
                                    AppConstants.getPaths()
                                        .get("ATTRIBUTE_MAPPINGS")
                                        .replace(":type", ClaimManagementConstants.SCIM)
                                );
                            } }
                            className="clickable"
                            data-testid={ `${ testId }-scim-dialect-container` }
                        >
                            <List>
                                <List.Item>
                                    <Grid>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 12 }>
                                                <GenericIcon
                                                    verticalAlign="middle"
                                                    rounded
                                                    icon={ getTechnologyLogos().scim }
                                                    spaced="right"
                                                    size="mini"
                                                    floated="left"
                                                />
                                                <List.Header>
                                                    { t(
                                                        "console:manage.features.claims.dialects.sections." +
                                                        "manageAttributeMappings.scim.heading"
                                                    ) }
                                                </List.Header>
                                                <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                    { t(
                                                        "console:manage.features.claims.attributeMappings" +
                                                        ".scim.description"
                                                    ) }
                                                </List.Description>
                                            </Grid.Column>
                                            <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                                <Popup
                                                    content={ t("common:view") }
                                                    trigger={
                                                        <Icon color="grey" name="eye" />
                                                    }
                                                    inverted
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Item>
                            </List>
                        </EmphasizedSegment>
                    )
                ) : (
                        <Placeholder fluid>
                            <Placeholder.Header image>
                                <Placeholder.Line length="full" />
                                <Placeholder.Line length="medium" />
                            </Placeholder.Header>
                        </Placeholder>
                    ) }
                { !isLoading ? (
                    otherAttributeMappings.length > 0 && (
                        <EmphasizedSegment
                            onClick={ () => {
                                history.push(
                                    AppConstants.getPaths()
                                        .get("ATTRIBUTE_MAPPINGS")
                                        .replace(":type", ClaimManagementConstants.OTHERS)
                                );
                            } }
                            className="clickable"
                            data-testid={ `${ testId }-other-dialect-container` }
                        >
                            <List>
                                <List.Item>
                                    <Grid>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 12 }>
                                                <Image
                                                    floated="left"
                                                    verticalAlign="middle"
                                                    rounded
                                                    centered
                                                    size="mini"
                                                >
                                                    <AnimatedAvatar />
                                                    <span className="claims-letter">C</span>
                                                </Image>
                                                <List.Header>
                                                    { t(
                                                        "console:manage.features.claims.dialects.sections." +
                                                        "manageAttributeMappings.custom.heading"
                                                    ) }
                                                </List.Header>
                                                <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                    { t(
                                                        "console:manage.features.claims.attributeMappings." +
                                                        "custom.description"
                                                    ) }
                                                </List.Description>
                                            </Grid.Column>
                                            <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                                <Popup
                                                    content={ t("common:edit") }
                                                    trigger={
                                                        <Icon color="grey" name="pencil" />
                                                    }
                                                    inverted
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Item>
                            </List>
                        </EmphasizedSegment>
                    )
                ) : (
                        <Placeholder fluid>
                            <Placeholder.Header image>
                                <Placeholder.Line length="full" />
                                <Placeholder.Line length="medium" />
                            </Placeholder.Header>
                        </Placeholder>
                    ) }
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
ClaimDialectsPage.defaultProps = {
    "data-testid": "attribute-dialects"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ClaimDialectsPage;
