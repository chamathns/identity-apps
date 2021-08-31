/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Accordion, AccordionTitleProps, Divider, Icon, Label, Message } from "semantic-ui-react";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants
} from "../../../../features/server-configurations";
import toInteger from "lodash-es/toInteger";

/**
 * Interface for Login Attempt Security Configuration Form props.
 */
interface LoginAttemptSecurityConfigurationFormPropsInterface extends TestableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param {any} values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
}

/**
 * Form initial values interface.
 */
interface LoginAttemptSecurityFormInitialValuesInterface {
    /**
     * Max failed login attempts.
     */
    maxFailedAttempts: string;
    /**
     * Account lock duration.
     */
    accountLockTime: string;
    /**
     * Lock duration increment ratio.
     */
    accountLockIncrementFactor: string;
}

/**
 * Proptypes for the Login Attempts Security Form error messages.
 */
export interface LoginAttemptSecurityFormErrorValidationsInterface {
    /**
     * Max failed login attempts field.
     */
    maxFailedAttempts: string;
    /**
     * Account lock duration field.
     */
    accountLockTime: string;
    /**
     * Lock duration increment ratio field.
     */
    accountLockIncrementFactor: string;
}

const allowedConnectorFields: string[] = [
    ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE,
    ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK,
    ServerConfigurationsConstants.ACCOUNT_LOCK_TIME,
    ServerConfigurationsConstants.ACCOUNT_LOCK_TIME_INCREMENT_FACTOR,
    ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT,
    ServerConfigurationsConstants.NOTIFY_USER_ON_ACCOUNT_LOCK_INCREMENT
];

/**
 * Login Attempt Security Configuration Form.
 *
 * @param {LoginAttemptSecurityConfigurationFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LoginAttemptSecurityConfigurationFrom: FunctionComponent<LoginAttemptSecurityConfigurationFormPropsInterface> = (
    props: LoginAttemptSecurityConfigurationFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<LoginAttemptSecurityFormInitialValuesInterface>(undefined);
    const [ maxAttempts, setMaxAttempts ] = useState<string>(undefined);
    const [ lockDuration, setLockDuration ] = useState<string>(undefined);
    const [ lockIncrementRatio, setLockIncrementRatio ] = useState<string>(undefined);
    const [ accordionActiveIndex, setAccordionActiveIndex ] = useState<string | number>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: LoginAttemptSecurityFormInitialValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (allowedConnectorFields.includes(property.name)) {
                if (property.name === ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        maxFailedAttempts: property.value
                    };
                    setMaxAttempts(property.value);
                } else if (property.name === ServerConfigurationsConstants.ACCOUNT_LOCK_TIME) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        accountLockTime: property.value
                    };
                    setLockDuration(property.value);
                } else if (property.name === ServerConfigurationsConstants.ACCOUNT_LOCK_TIME_INCREMENT_FACTOR) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        accountLockIncrementFactor: property.value
                    };
                    setLockIncrementRatio(property.value);
                }
            }
        });
        setInitialConnectorValues(resolvedInitialValues);
    }, [ initialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     *
     * @return Sanitized form values.
     */
    const getUpdatedConfigurations = (values) => {
        const data: any = {
            "account.lock.handler.On.Failure.Max.Attempts": values.maxFailedAttempts !== undefined
                ? values.maxFailedAttempts
                : initialConnectorValues?.maxFailedAttempts,
            "account.lock.handler.Time": values.accountLockTime !== undefined
                ? values.accountLockTime
                : initialConnectorValues?.accountLockTime,
            "account.lock.handler.login.fail.timeout.ratio": values.accountLockIncrementFactor !== undefined
                ? values.accountLockIncrementFactor
                : initialConnectorValues?.accountLockIncrementFactor,
            "account.lock.handler.notification.manageInternally": true,
            "account.lock.handler.notification.notifyOnLockIncrement": true
        };

        return data;
    };

    /**
     * Validate input data.
     *
     * @param values
     */
    const validateForm = (values: any):
        LoginAttemptSecurityFormErrorValidationsInterface => {

        const errors: LoginAttemptSecurityFormErrorValidationsInterface = {
            accountLockIncrementFactor: undefined,
            accountLockTime: undefined,
            maxFailedAttempts: undefined
        };

        if (!values.maxFailedAttempts) {
            // Check for required error.
            errors.maxFailedAttempts = t("extensions:manage.serverConfigurations.accountSecurity." +
                "loginAttemptSecurity.form.fields.maxFailedAttempts.validations.required");
            const x =  t("extensions:manage.serverConfigurations.accountSecurity." +
                "loginAttemptSecurity.form.fields.maxFailedAttempts.validations.required");
        } else if (!FormValidation.isInteger(values.maxFailedAttempts as unknown as number) ||
            parseInt(values.maxFailedAttempts, 10) === 0) {
            // Check for invalid input.
            errors.maxFailedAttempts =  t("extensions:manage.serverConfigurations.accountSecurity." +
                "loginAttemptSecurity.form.fields.maxFailedAttempts.validations.invalid");
        }

        if (!values.accountLockTime) {
            // Check for required error.
            errors.accountLockTime = t("extensions:manage.serverConfigurations.accountSecurity." +
                "loginAttemptSecurity.form.fields.accountLockTime.validations.required");
        } else if (!FormValidation.isInteger(values.accountLockTime as unknown as number) ||
            parseInt(values.accountLockTime, 10) === 0) {
            // Check for invalid input.
            errors.accountLockTime =  t("extensions:manage.serverConfigurations.accountSecurity." +
                "loginAttemptSecurity.form.fields.accountLockTime.validations.invalid");
        }

        if (values.accountLockIncrementFactor &&
            (!FormValidation.isInteger(values.accountLockIncrementFactor as unknown as number) ||
            parseInt(values.accountLockIncrementFactor, 10) === 0)) {
            // Check for invalid input.
            errors.accountLockIncrementFactor =  t("extensions:manage.serverConfigurations.accountSecurity." +
                "loginAttemptSecurity.form.fields.accountLockIncrementFactor.validations.invalid");
        }

        return errors;
    };

    /**
     * Handles accordion title click.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {AccordionTitleProps} accordionTitleProps - Clicked title.
     */
    const handleAccordionOnClick = (e: MouseEvent<HTMLDivElement>,
                                    accordionTitleProps: AccordionTitleProps): void => {
        if (!accordionTitleProps) {
            return;
        }
        const newIndex = accordionActiveIndex === accordionTitleProps.index
            ? -1
            : accordionTitleProps.index;
        setAccordionActiveIndex(newIndex);
    };

    /**
     * Renders sample info section with example configuration details.
     */
    const sampleInfoSection = () => {

        return (
            <Message info className={ "mb-5" }>
                <Icon name="info circle" />
                How it works
                <p>
                    <strong>Note : </strong> The following example is based on the above configurations.<br />
                    <br />
                    User tries to login with an incorrect password { toInteger(maxAttempts) === 1
                    ? " once" : " in " + maxAttempts + " consecutive attempts" }. User account will be locked
                    for { lockDuration } { toInteger(lockDuration) === 1 ? " minute." : " minutes." }
                    { sampleInfoAccordion() }
                </p>
            </Message>
        );
    };

    /**
     * Renders accordion with example configuration information.
     */
    const sampleInfoAccordion = () => {

        return (
            <Accordion
                data-testid={ testId }
            >
                <Accordion.Title
                    index={ 0 }
                    active={ accordionActiveIndex === 0 }
                    onClick={ handleAccordionOnClick }
                    content={ toInteger(lockDuration) === 1
                        ? "After 1 minute"
                        : "After " + lockDuration + " minutes"  }
                />
                <Accordion.Content
                    active={ accordionActiveIndex === 0 }
                >
                    {
                        <ul className="mt-0">
                            <li>If the user enters the correct password, the user can successfully
                                log in.</li>
                            <li>If the user tries an incorrect password for another { maxAttempts } consecutive
                                { toInteger(maxAttempts) === 1 ? " attempt, " : " attempts, "  } the account
                                lock duration will be incremented by { lockIncrementRatio } times the previous
                                lock duration (The account will be locked for { lockIncrementRatio } x { lockDuration }
                                = { toInteger(lockIncrementRatio)*toInteger(lockDuration) }
                                { toInteger(lockIncrementRatio)*toInteger(lockDuration) === 1
                                    ? " minute." : " minutes."  }).</li>
                        </ul>
                    }
                </Accordion.Content>
            </Accordion>
        );
    };

    return (
        <div className={ "connector-form" }>
            {
                initialConnectorValues ?
                    <Form
                        initialValues={ initialConnectorValues }
                        onSubmit={ (values) => onSubmit(getUpdatedConfigurations(values)) }
                        validate={ validateForm }
                        uncontrolledForm={ false }
                    >
                        <Field.Input
                            ariaLabel="maxFailedAttempts"
                            inputType="number"
                            name="maxFailedAttempts"
                            min="1"
                            label={ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "loginAttemptSecurity.form.fields.maxFailedAttempts.label") }
                            required={ true }
                            placeholder={ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "loginAttemptSecurity.form.fields.maxFailedAttempts.placeholder") }
                            listen={ (value) => value
                                ? setMaxAttempts(value)
                                : setMaxAttempts(initialConnectorValues.maxFailedAttempts) }
                            maxLength={ 20 }
                            minLength={ 1 }
                            width={ 10 }
                            disabled={ !isConnectorEnabled }
                            data-testid={ `${testId}-max-failed-attempts` }
                        />
                        <Hint className={ "mb-5" }>
                            {
                                t("extensions:manage.serverConfigurations.accountSecurity." +
                                    "loginAttemptSecurity.form.fields.maxFailedAttempts.hint")
                            }
                        </Hint>
                        <Field.Input
                            ariaLabel="accountLockTime"
                            inputType="number"
                            name="accountLockTime"
                            min="1"
                            label={ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "loginAttemptSecurity.form.fields.accountLockTime.label") }
                            required={ true }
                            placeholder={ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "loginAttemptSecurity.form.fields.accountLockTime.placeholder") }
                            listen={ (value) => value
                                ? setLockDuration(value)
                                : setLockDuration(initialConnectorValues.accountLockTime) }
                            maxLength={ 20 }
                            minLength={ 1 }
                            width={ 10 }
                            disabled={ !isConnectorEnabled }
                            labelPosition="right"
                            data-testid={ `${testId}-account-lock-time` }
                        >
                            <input/>
                            <Label
                                content={ "mins" }
                            />
                        </Field.Input>
                        <Hint className={ "mb-5" }>
                            {
                                t("extensions:manage.serverConfigurations.accountSecurity." +
                                    "loginAttemptSecurity.form.fields.accountLockTime.hint")
                            }
                        </Hint>
                        <Field.Input
                            ariaLabel="accountLockIncrementFactor"
                            inputType="number"
                            name="accountLockIncrementFactor"
                            min="1"
                            label={ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "loginAttemptSecurity.form.fields.accountLockIncrementFactor.label") }
                            required={ false }
                            placeholder={ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "loginAttemptSecurity.form.fields.accountLockIncrementFactor.placeholder") }
                            listen={ (value) => value
                                ? setLockIncrementRatio(value)
                                : setLockIncrementRatio(initialConnectorValues.accountLockIncrementFactor) }
                            maxLength={ 5 }
                            minLength={ 1 }
                            width={ 10 }
                            disabled={ !isConnectorEnabled }
                            data-testid={ `${testId}-account-lock-increment` }
                        />
                        <Hint className={ "mb-5" }>
                            {
                                t("extensions:manage.serverConfigurations.accountSecurity." +
                                    "loginAttemptSecurity.form.fields.accountLockIncrementFactor.hint")
                            }
                        </Hint>
                        {
                            sampleInfoSection()
                        }
                        <Divider hidden/>
                        <Field.Button
                            size="small"
                            buttonType="primary_btn"
                            ariaLabel="Login attempt security update button"
                            name="update-button"
                            data-testid={ `${testId}-submit-button` }
                            disabled={ !isConnectorEnabled }
                            label={ t("common:update") }
                            hidden={ !isConnectorEnabled || readOnly }
                        />
                    </Form>
                    : null
            }
        </div>
    );
};

/**
 * Default props for the component.
 */
LoginAttemptSecurityConfigurationFrom.defaultProps = {
    "data-testid": "login-attempts-security-edit-form"
};
