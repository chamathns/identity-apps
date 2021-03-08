/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { DynamicField, EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { updateAClaim } from "../../../../../../features/claims/api";

/**
 * Prop types for `EditAdditionalPropertiesLocalClaims` component
 */
interface EditAdditionalPropertiesLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The Local claim to be edited
     */
    claim: Claim;
    /**
     * The function to be called to initiate an update
     */
    update: () => void;
}

/**
 * This component renders the additional properties pane.
 *
 * @param {EditAdditionalPropertiesLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditAdditionalPropertiesLocalClaims: FunctionComponent<
    EditAdditionalPropertiesLocalClaimsPropsInterface
    > = (props: EditAdditionalPropertiesLocalClaimsPropsInterface): ReactElement => {

    const {
        claim,
        update,
        [ "data-testid" ]: testId
    } = props;

    const [ submit, setSubmit ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    return (
        <EmphasizedSegment>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                        <p>{ t("console:manage.features.claims.local.additionalProperties.hint") }</p>
                        <DynamicField
                            data={ claim.properties }
                            keyType="text"
                            keyName={ t("console:manage.features.claims.local.additionalProperties.key") }
                            valueName={ t("console:manage.features.claims.local.additionalProperties.value") }
                            submit={ submit }
                            keyRequiredMessage={ t("console:manage.features.claims.local.additionalProperties." +
                                "keyRequiredErrorMessage") }
                            valueRequiredErrorMessage={ t("console:manage.features.claims.local.additionalProperties." +
                                "valueRequiredErrorMessage") }
                            requiredField={ true }
                            update={ (data) => {
                                const claimData = { ...claim };
                                delete claimData.id;
                                delete claimData.dialectURI;
                                const submitData = {
                                    ...claimData,
                                    properties: [ ...data ]
                                };

                                updateAClaim(claim.id, submitData).then(() => {
                                    dispatch(addAlert(
                                        {
                                            description: t("console:manage.features.claims.local.notifications." +
                                                "updateClaim.success.description"),
                                            level: AlertLevels.SUCCESS,
                                            message: t("console:manage.features.claims.local.notifications." +
                                                "updateClaim.success.message")
                                        }
                                    ));
                                    update();
                                }).catch(error => {
                                    dispatch(addAlert(
                                        {
                                            description: error?.description
                                                || t("console:manage.features.claims.local.notifications." +
                                                    "updateClaim.genericError.description"),
                                            level: AlertLevels.ERROR,
                                            message: error?.message
                                                || t("console:manage.features.claims.local.notifications." +
                                                    "updateClaim.genericError.message")
                                        }
                                    ));
                                });
                            } }
                            data-testid={ `${ testId }-form-properties-dynamic-field` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 6 }>
                        <PrimaryButton
                            onClick={ () => {
                                setSubmit();
                            } }
                            data-testid={ `${ testId }-submit-button` }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
EditAdditionalPropertiesLocalClaims.defaultProps = {
    "data-testid": "edit-local-claims-additional-properties"
};
