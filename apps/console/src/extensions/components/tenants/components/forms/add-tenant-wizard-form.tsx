/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms, FormValue, Validation } from "@wso2is/forms";
import React, {Dispatch, FunctionComponent, ReactElement, SetStateAction, useState} from "react";
import { Trans, useTranslation } from "react-i18next";
import {Grid, GridColumn, GridRow, Icon, Message} from "semantic-ui-react";
import isEmpty from "lodash-es/isEmpty";
import { TenantManagementConstants } from "../../constants";
import { Hint } from "@wso2is/react-components";

/**
 * Interface to capture add tenant wizard form props.
 */
interface AddTenantWizardFormPropsInterface extends TestableComponentInterface {
    onSubmit: (values: any) => void;
    triggerSubmit: boolean;
    tenantDuplicate: boolean;
    setTenantDuplicate: Dispatch<SetStateAction<boolean>>;
}

/**
 * Form component to capture new tenant data.
 *
 * @param {AddTenantWizardFormPropsInterface} props - props required for new tenant form component
 * @return {React.ReactElement}
 */
export const AddTenantWizardForm: FunctionComponent<AddTenantWizardFormPropsInterface> = (
    props: AddTenantWizardFormPropsInterface
): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        tenantDuplicate,
        setTenantDuplicate,
        [ "data-testid" ]: testId
    } = props;

    const [newTenantName, setNewTenantName] = useState<string>(TenantManagementConstants.TENANT_URI_PLACEHOLDER);
    const [isTenantValid, setIsTenantValid] = useState<boolean>(false);

    const { t } = useTranslation();

    /**
     * Util method to collect form data for processing.
     *
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): any => {
        return {
            tenantName: values.get("tenantName").toString()
        };
    };

    const checkTenantValidity = (tenantName: string): boolean => {
        return tenantName && !!tenantName.match(TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_PATTERN);
    };

    const updateTenantUrl = (values: Map<string, FormValue>): void => {
        setTenantDuplicate(false);
        const tenantName = values.get("tenantName").toString()

        if (isEmpty(tenantName)) {
            setNewTenantName(TenantManagementConstants.TENANT_URI_PLACEHOLDER);
            setIsTenantValid(false);
        } else {
            setNewTenantName(tenantName);
            setIsTenantValid(checkTenantValidity(tenantName));
        }
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Field
                            type="text"
                            name="tenantName"
                            label={
                                t("extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.label")
                            }
                            placeholder={
                                t("extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.placeholder")
                            }
                            required={ true }
                            requiredErrorMessage={
                                t("extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.validations.empty")
                            }
                            listen={ updateTenantUrl }
                            validation={ (value: string, validation: Validation) => {
                                if (!checkTenantValidity(value.toString())) {
                                    validation.isValid = false;
                                    if (value.length < TenantManagementConstants.FORM_FIELD_CONSTRAINTS
                                        .TENANT_NAME_MIN_LENGTH) {
                                        validation.errorMessages.push(
                                            t("extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                                                "tenantName.validations.invalidLength",
                                                { characterLimit: TenantManagementConstants
                                                        .FORM_FIELD_CONSTRAINTS.TENANT_NAME_MAX_LENGTH,
                                                    characterLowerLimit: TenantManagementConstants
                                                        .FORM_FIELD_CONSTRAINTS.TENANT_NAME_MIN_LENGTH }
                                            )
                                        );
                                    }
                                    else {
                                        validation.errorMessages.push(
                                            t("extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                                                "tenantName.validations.invalid",
                                                { characterLimit: TenantManagementConstants
                                                        .FORM_FIELD_CONSTRAINTS.TENANT_NAME_MAX_LENGTH }
                                            )
                                        );
                                    }
                                    setIsTenantValid(false);
                                    return;
                                }
                            }}
                            displayErrorOn="blur"
                            maxLength={ TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_MAX_LENGTH }
                            data-testid={ `${ testId }-type-input` }
                        />
                        <span>
                            https://console.asgardeo.io/t/
                            <span className={ `${
                                newTenantName !== TenantManagementConstants.TENANT_URI_PLACEHOLDER
                                    ? isTenantValid && !tenantDuplicate
                                        ? "valid-tenant placeholder-uri-bold"
                                        : "invalid-tenant placeholder-uri-bold"
                                    : newTenantName == TenantManagementConstants.TENANT_URI_PLACEHOLDER 
                                        ? isTenantValid && !tenantDuplicate
                                            ? "valid-tenant placeholder-uri-bold"
                                                : "placeholder-uri"
                                    : void 0
                            }`  }>
                                { newTenantName }
                            </span>
                            <Hint icon="info circle" popup>
                                { t("extensions:manage.features.tenant.wizards.addTenant.tooltips.message") }
                            </Hint>
                        </span>

                        <Message className="with-inline-icon" icon visible info>
                            <Icon name="info" size="mini" />
                            <Message.Content>
                                <Trans
                                    i18nKey={"extensions:manage.features.tenant.wizards.addTenant.forms.messages.info"}
                                >
                                    Think of a good, unique organization name for your new Asgardeo workspace because
                                    you&nbsp;won’t be able to change it later!
                                </Trans>
                            </Message.Content>
                        </Message>
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the component.
 */
AddTenantWizardForm.defaultProps = {
    "data-testid": "add-tenant-wizard-form"
};
