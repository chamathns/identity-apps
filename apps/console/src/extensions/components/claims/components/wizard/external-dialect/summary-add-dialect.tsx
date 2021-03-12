/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { AnimatedAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Image, Message, Table } from "semantic-ui-react";
import { ClaimManagementConstants } from "../../../../../../features/claims/constants";
import { AddExternalClaim } from "../../../../../../features/claims/models";
import { resolveType } from "../../../../../../features/claims/utils";

/**
 * Prop types of the `SummaryAddDialect` component.
 */
interface SummaryAddDialectPropsInterface extends TestableComponentInterface {
    /**
     * The dialectURI added.
     */
    dialectURI: string;
    /**
     * The external claims added.
     */
    claims: AddExternalClaim[];
    /**
     * Specifies the attribute type.
     */
    attributeType?: string;
}

/**
 * This generates the first letter of a claim
 * @param {string} name
 * @return {string} The first letter of a claim
 */
const generateClaimLetter = (name: string): string => {
    const stringArray = name.replace("http://", "").split("/");
    return stringArray[ stringArray.length - 1 ][ 0 ].toLocaleUpperCase();
};

/**
 * Renders teh summary step of the add dialect wizard.
 *
 * @param {SummaryAddDialectPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SummaryAddDialect: FunctionComponent<SummaryAddDialectPropsInterface> = (
    props: SummaryAddDialectPropsInterface
): ReactElement => {

    const {
        dialectURI,
        claims,
        attributeType,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    return (
        <Grid className="wizard-summary" data-testid={ testId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <h3>{ dialectURI }</h3>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    { t("console:manage.features.claims.dialects.wizard.summary.externalAttribute",
                                        { type: resolveType(attributeType, true) } ) }
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    { t("console:manage.features.claims.dialects.wizard.summary.mappedAttribute") }
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { claims.map((claim: AddExternalClaim, index: number) => {
                                return (
                                    <Table.Row key={ index } columns={ 2 }>
                                        <Table.Cell>
                                            <Image
                                                floated="left"
                                                verticalAlign="middle"
                                                rounded
                                                centered
                                                size="mini"
                                            >
                                                <AnimatedAvatar />
                                                <span className="claims-letter">
                                                    { generateClaimLetter(claim.claimURI) }
                                                </span>
                                            </Image>
                                        </Table.Cell>
                                        <Table.Cell>
                                            { claim.claimURI }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { claim.mappedLocalClaimURI }
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }) }
                            {
                                claims.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={ 3 } textAlign="center">
                                            <Message warning>
                                                { t("console:manage.features.claims.dialects.wizard.summary.notFound") }
                                            </Message>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the application creation wizard.
 */
SummaryAddDialect.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "add-dialect-summary"
};
