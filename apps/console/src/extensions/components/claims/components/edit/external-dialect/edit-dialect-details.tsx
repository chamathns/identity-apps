/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, ClaimDialect, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AppConstants, AppState, ConfigReducerStateInterface, history } from "../../../../../../features/core";
import { updateADialect } from "../../../../../../features/claims/api";
import { ClaimManagementConstants } from "../../../../../../features/claims/constants";
import { resolveType } from "../../../../../../features/claims/utils";

/**
 * Prop types for the `EditDialectDetails` component
 */
interface EditDialectDetailsPropsInterface extends TestableComponentInterface {
    dialect: ClaimDialect;
    /**
     * Attribute type.
     */
    attributeType?: string;
}

/**
 * This renders the dialect details tab pane of the edit external dialect page.
 *
 * @param {EditDialectDetailsPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const EditDialectDetails: FunctionComponent<EditDialectDetailsPropsInterface> = (
    props: EditDialectDetailsPropsInterface
): ReactElement => {

    const {
        dialect,
        attributeType,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 6 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const dialectURI = values.get("dialectURI").toString();
                            updateADialect(dialect.id, dialectURI)
                                .then(() => {
                                    dispatch(addAlert({
                                        description: t("console:manage.features.claims.dialects.notifications" +
                                            ".updateDialect.success.description"),
                                        level: AlertLevels.SUCCESS,
                                        message: t("console:manage.features.claims.dialects.notifications" +
                                            ".updateDialect.success.message")
                                    }));
                                    history.push(
                                        AppConstants.getPaths().get("EXTERNAL_DIALECT_EDIT")
                                            .replace(":id", window.btoa(dialectURI).replace(/=/g, ""))
                                    );
                                })
                                .catch((error) => {
                                    dispatch(addAlert({
                                        description: error?.description
                                            || t("console:manage.features.claims.dialects.notifications" +
                                                ".updateDialect.genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: error?.message
                                            || t("console:manage.features.claims.dialects.notifications" +
                                                ".updateDialect.genericError.message")
                                    }));
                                });
                        } }
                    >
                        <Field
                            type="text"
                            placeholder={ t("console:manage.features.claims.dialects.forms.dialectURI.placeholder",
                                { type: resolveType(attributeType, true) }) }
                            value={ dialect?.dialectURI }
                            required={ true }
                            readOnly={
                                config.ui?.isDefaultDialectEditingEnabled === false
                                    ? ClaimManagementConstants.DEFAULT_DIALECTS.includes(dialect?.id)
                                    : false
                            }
                            requiredErrorMessage={ t("console:manage.features.claims.dialects." +
                                "forms.dialectURI.requiredErrorMessage") }
                            label={ t("console:manage.features.claims.dialects.forms.dialectURI.label") }
                            name="dialectURI"
                            data-testid={ `${ testId }-form-dialect-uri-input` }
                        />
                        {
                            config.ui?.isDefaultDialectEditingEnabled === false
                                && ClaimManagementConstants.DEFAULT_DIALECTS.includes(dialect?.id)
                                ? null
                                :(
                                    <>
                                        <Divider hidden />
                                        <PrimaryButton type="submit" data-testid={ `${ testId }-form-submit-button` }>
                                            { t("console:manage.features.claims.dialects.forms.submit") }
                                        </PrimaryButton>
                                    </>
                                )
                        }

                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
EditDialectDetails.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "edit-dialect-details"
};
