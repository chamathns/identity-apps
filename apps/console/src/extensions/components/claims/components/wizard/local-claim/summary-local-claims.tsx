/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AttributeMapping, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { CopyInputField } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Form, Grid, Label, List, Table } from "semantic-ui-react";

/**
 * Prop types of `SummaryLocalClaims` component
 */
interface SummaryLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The complete Claim data
     */
    data: Claim;
}

/**
 * This component renders the summary view of the wizard.
 *
 * @param {SummaryLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SummaryLocalClaims: FunctionComponent<SummaryLocalClaimsPropsInterface> = (
    props: SummaryLocalClaimsPropsInterface
): ReactElement => {

    const {
        data,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * This component returns a row of summary
     * @param {string} title
     * @param {string | number | ReactElement} description
     * @return {ReactElement} A row of summary
     */
    const generateSummaryLine = (
        title: string,
        description: string | number | ReactElement
    ): ReactElement => {
        return (
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{ title }</div>
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{ description }</div>
                </Grid.Column>
            </Grid.Row>
        );
    };

    /**
     * This components generates labels for boolean types
     * @param {string} name
     * @return {ReactElement}
     */
    const generateLabels = (name: string): ReactElement => {
        return (
            <List.Item>
                <Label basic circular>
                    { name }
                </Label>
            </List.Item>
        );
    };

    /**
     * This returns the Claim URI in a copy field
     * @return {ReactElement} Copy Field
     */
    const showClaimURI = (): ReactElement => {
        return (
            <Form.Field>
                <CopyInputField value={ data ? data?.claimURI : "" } />
            </Form.Field>
        );
    };

    return (
        <Grid className="wizard-summary" data-testid={ testId }>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <h3>{ data.displayName }</h3>
                        <div className="description">{ data.description }</div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column textAlign="center">
                    <List>
                        { data.supportedByDefault
                            && generateLabels(t("console:manage.features.claims.local." +
                                "wizard.summary.supportedByDefault")) }
                        { data.required &&
                            generateLabels(t("console:manage.features.claims.local." +
                                "wizard.summary.required")) }
                        { data.readOnly &&
                            generateLabels(t("console:manage.features.claims.local." +
                                "wizard.summary.readOnly")) }
                    </List>
                </Grid.Column>
            </Grid.Row>
            { data.claimURI ? generateSummaryLine(t("console:manage.features.claims.local." +
                "wizard.summary.attributeURI"), showClaimURI()) : null }
            { data.displayOrder ? generateSummaryLine(t("console:manage.features.claims.local." +
                "wizard.summary.displayOrder"), data.displayOrder) : null }
            { data.regEx ? generateSummaryLine(t("console:manage.features.claims.local." +
                "wizard.summary.regEx"), data.regEx) : null }
            {
                data.attributeMapping?.length > 0 ? generateSummaryLine("Mapped attributes",
                    (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        { t("console:manage.features.claims.local." +
                                            "wizard.summary.userstore") }
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        { t("console:manage.features.claims.local." +
                                            "wizard.summary.attribute") }
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { data.attributeMapping.map((attribute: AttributeMapping, index: number) => {
                                    return (
                                        <Table.Row key={ index } columns={ 2 }>
                                            <Table.Cell>
                                                { attribute.userstore }
                                            </Table.Cell>
                                            <Table.Cell>
                                                { attribute.mappedAttribute }
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                }) }
                            </Table.Body>
                        </Table>
                    )
                ) : null
            }
        </Grid>
    );
};

/**
 * Default props for the application creation wizard.
 */
SummaryLocalClaims.defaultProps = {
    "data-testid": "local-claims-summary"
};
