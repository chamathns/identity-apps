/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { URLUtils } from "@wso2is/core/utils";
import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import { ContentLoader, Heading, Hint, LinkButton, URLInput } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import {Trans, useTranslation} from "react-i18next";
import {Divider, Grid, Icon, Label, Message} from "semantic-ui-react";
import {
    CertificateInterface,
    CertificateTypeInterface,
    ApplicationConfigurationModeInterface,
    ApplicationMetadataInterface, MetadataTypeInterface
} from "../../models";
import {ApplicationManagementConstants} from "../../constants";
import {AddIDPCertificateFormComponent} from "../../../identity-providers/components/wizards/steps/add-certificate-steps";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface SAMLProtocolSettingsWizardFormPropsInterface extends TestableComponentInterface {
    /**
     * CORS allowed origin list for the tenant.
     */
    allowedOrigins?: string[];
    metadata?: ApplicationMetadataInterface;
    /**
     * Set of fields to be displayed.
     */
    fields?: ("issuer" | "applicationQualifier" | "assertionConsumerURLs")[];
    /**
     * Flag to hide the hints.
     */
    hideFieldHints?: boolean;
    /**
     * Initial form values.
     */
    initialValues?: any;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Tenant domain
     */
    tenantDomain?: string;
    /**
     * Values from the template.
     */
    templateValues: any;
    /**
     * Trigger to invoke submit.
     */
    triggerSubmit: boolean;
    /**
     * On submit callback.
     * @param values - Form values.
     */
    onSubmit: (values: any) => void;
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {SAMLProtocolSettingsWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SAMLProtocolSettingsWizardForm: FunctionComponent<SAMLProtocolSettingsWizardFormPropsInterface> = (
    props: SAMLProtocolSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        metadata,
        allowedOrigins,
        fields,
        hideFieldHints,
        initialValues,
        readOnly,
        templateValues,
        tenantDomain,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ assertionConsumerUrls, setAssertionConsumerUrls ] = useState<string>("");
    const [ assertionConsumerURLFromTemplate, setAssertionConsumerURLFromTemplate ] = useState("");
    const [ showAssertionConsumerUrlError, setAssertionConsumerUrlError ] = useState<boolean>(false);
    const [ assertionConsumerURLsErrorLabel, setAssertionConsumerURLsErrorLabel ] = useState<ReactElement>(null);
    const [ allowCORSUrls, setAllowCORSUrls ] = useState<string[]>(allowedOrigins ? allowedOrigins: []);
    const [ isMetadataFileSelected, setMetadataFileSelected ] = useState<boolean>(false);
    const [ isManualConfigurationSelected, setManualConfigurationSelected ] = useState<boolean>(true);
    const [ PEMValue, setPEMValue ] = useState<string>(undefined);
    const [ finishSubmit, setFinishSubmit ] = useTrigger();
    const [ triggerUpload, setTriggerUpload ] = useTrigger();

    useEffect(() => {
        if (isEmpty(initialValues?.inboundProtocolConfiguration?.saml)) {
            const tempAssertionConsumerUrls = templateValues?.inboundProtocolConfiguration?.saml?.manualConfiguration
                .assertionConsumerUrls;
            if (!isEmpty(tempAssertionConsumerUrls)) {
                setAssertionConsumerUrls(tempAssertionConsumerUrls.toString());
            } else {
                setAssertionConsumerUrls("");
            }
        } else {
            setAssertionConsumerUrls(
                initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration
                    .assertionConsumerUrls?.toString()
            );
        }
    }, [initialValues]);

    /**
     * Sets the mandatory status of the ACS URL component by reading
     * the template values. If the template has a ACS URL array defined,
     * makes the field optional.
     */
    useEffect(() => {

        if (!templateValues) {
            return;
        }

        const templatedCallbacks: string[] = templateValues?.inboundProtocolConfiguration?.saml?.assertionConsumerURLs;

        if (templatedCallbacks && Array.isArray(templatedCallbacks) && templatedCallbacks.length > 0) {
            setAssertionConsumerURLFromTemplate(templatedCallbacks[ 0 ]);
        }
    }, [ templateValues ]);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @param {string} urls - Callback URLs.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>, urls?: string): any => {
        const config = {
            inboundProtocolConfiguration: {
                saml: {
                    manualConfiguration: { }
                }
            }
        };

        if (!fields || fields.includes("assertionConsumerURLs")) {
            config.inboundProtocolConfiguration.saml.manualConfiguration[ "assertionConsumerUrls" ] =
                urls ? urls.split(",") : assertionConsumerUrls.split(",");
        }

        if (!fields || fields.includes("issuer")) {
            config.inboundProtocolConfiguration.saml.manualConfiguration[ "issuer" ] = values.get("issuer") as string;
        }

        if (!fields || fields.includes("applicationQualifier")) {
            config.inboundProtocolConfiguration.saml.manualConfiguration[ "serviceProviderQualifier" ] =
                values.get("applicationQualifier");
        }

        return config;
    };

    /**
     * The function resolves the newly added origins for the callback URLs.
     * Returns the intersection set of,
     * <ul>
     * <li>The newly added origins of the callback URLs.</li>
     * <li>All the available CORS origins.</li>
     * </ul>
     *
     * @param {string} urls - Callback URLs.
     * @return {string[]} Allowed origin URLs.
     */
    const resolveAllowedOrigins = (urls: string): string[] => {
        let calBackUrls: string[] = [];

        if (urls?.split(",").length > 1) {
            calBackUrls = urls?.split(",");
        } else {
            calBackUrls.push(urls);
        }
        const normalizedOrigins = calBackUrls?.map(
            (url) => URLUtils.urlComponents(url)?.origin
        );
        return [...new Set(normalizedOrigins.filter(value => allowCORSUrls.includes(value)))];
    };

    /**
     * The following function handles removing CORS allowed origin.
     *
     * @param {string} url - Removing origin
     */
    const handleRemoveAllowOrigin = (url: string): void => {
        const allowedURLs = [ ...allowCORSUrls ];
        allowedURLs.splice(allowedURLs.indexOf(url), 1);
        setAllowCORSUrls(allowedURLs);
    };

    /**
     * The following function handles allowing CORS for a new origin.
     *
     * @param {string} url - Allowed origin
     */
    const handleAddAllowOrigin = (url: string): void => {
        const allowedURLs = [ ...allowCORSUrls ];
        allowedURLs.push(url);
        setAllowCORSUrls(allowedURLs);
    };

    /**
     * Handles the final wizard submission.
     */
    const handleWizardFormFinish = (values: any): void => {
        // do something
    };

    const renderManualConfiguration = (): ReactElement => {
        return (
            <Grid>
                { (!fields || fields.includes("issuer")) && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Field
                                name="issuer"
                                label={
                                    t("console:develop.features.applications.forms.inboundSAML" +
                                        ".fields.issuer.label")
                                }
                                required={ true }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundSAML.fields" +
                                        ".issuer.validations.empty")
                                }
                                type="text"
                                placeholder={
                                    t("console:develop.features.applications.forms.inboundSAML.fields" +
                                        ".issuer.placeholder")
                                }
                                value={
                                    initialValues?.inboundProtocolConfiguration?.saml?.[
                                        "manualConfiguration" ]?.issuer
                                }
                                data-testid={ `${ testId }-issuer-input` }
                            />
                            { !hideFieldHints && (
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundSAML.fields" +
                                        ".issuer.hint") }
                                </Hint>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                ) }
                { (!fields || fields.includes("applicationQualifier")) && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Field
                                name="applicationQualifier"
                                label={
                                    t("console:develop.features.applications.forms.inboundSAML" +
                                        ".fields.qualifier.label")
                                }
                                required={ false }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundSAML" +
                                        ".fields.qualifier.validations.empty")
                                }
                                type="text"
                                placeholder={
                                    t("console:develop.features.applications.forms.inboundSAML" +
                                        ".fields.qualifier.placeholder")
                                }
                                value={
                                    initialValues?.inboundProtocolConfiguration
                                        .saml?.manualConfiguration?.serviceProviderQualifier
                                }
                                data-testid={ `${ testId }-application-qualifier-input` }
                            />
                            { !hideFieldHints && (
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundSAML.fields" +
                                        ".qualifier.hint") }
                                </Hint>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                ) }
                { (!fields || fields.includes("assertionConsumerURLs")) && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } className="field">
                            <URLInput
                                labelEnabled={ true }
                                urlState={ assertionConsumerUrls }
                                setURLState={ setAssertionConsumerUrls }
                                handleAddAllowedOrigin={ (url) => handleAddAllowOrigin(url) }
                                handleRemoveAllowedOrigin={ (url) => handleRemoveAllowOrigin(url) }
                                tenantDomain={ tenantDomain }
                                allowedOrigins={ allowCORSUrls }
                                labelName={
                                    t("console:develop.features.applications.forms.inboundSAML" +
                                        ".fields.assertionURLs.label")
                                }
                                placeholder={
                                    t("console:develop.features.applications.forms.inboundSAML" +
                                        ".fields.assertionURLs.placeholder")
                                }
                                validationErrorMsg={
                                    t("console:develop.features.applications.forms." +
                                        "spaProtocolSettingsWizard.fields.callBackUrls.validations.invalid")
                                }
                                emptyErrorMessage={
                                    t("console:develop.features.applications.forms.inboundSAML" +
                                        ".fields.assertionURLs.validations.empty")
                                }
                                validation={ (value: string) => {
                                    if (!(URLUtils.isURLValid(value, true) && (URLUtils.isHttpUrl(value) ||
                                        URLUtils.isHttpsUrl(value)))) {

                                        return false;
                                    }

                                    if (!URLUtils.isMobileDeepLink(value)) {
                                        return false;
                                    }

                                    setAssertionConsumerURLsErrorLabel(null);

                                    return true;
                                } }
                                computerWidth={ 10 }
                                required={ true }
                                showError={ showAssertionConsumerUrlError }
                                setShowError={ setAssertionConsumerUrlError }
                                hint={
                                    !hideFieldHints && t("console:develop.features.applications" +
                                        ".forms.inboundSAML.fields.assertionURLs.hint")
                                }
                                addURLTooltip={ t("common:addURL") }
                                duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                data-testid={ `${ testId }-assertion-consumer-url-input` }
                                getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                                    submitUrl = submitFunction;
                                } }
                                showPredictions={ false }
                                customLabel={ assertionConsumerURLsErrorLabel }
                            />
                            {
                                (assertionConsumerURLFromTemplate) && (
                                    <Message className="with-inline-icon" icon visible info>
                                        <Icon name="info" size="mini" />
                                        <Message.Content> {
                                            <Trans
                                                i18nKey={ "console:develop.features.applications.forms." +
                                                "inboundSAML.fields.assertionURLs.info" }
                                                tOptions={ { assertionURLFromTemplate:
                                                    assertionConsumerURLFromTemplate } }
                                            >
                                                Don’t have an app? Try out a sample app
                                                using <strong>{ assertionConsumerURLFromTemplate }</strong> as
                                                the assertion Response URL. (You can download and run a sample
                                                at a later step.)
                                            </Trans>
                                        }
                                            {
                                                (assertionConsumerUrls === undefined ||
                                                    assertionConsumerUrls === "") && (
                                                    <LinkButton
                                                        className={ "m-1 p-1 with-no-border orange" }
                                                        onClick={ (e) => {
                                                            e.preventDefault();
                                                            const host = new URL(
                                                                assertionConsumerURLFromTemplate);
                                                            handleAddAllowOrigin(host.origin);
                                                            setAssertionConsumerUrls(
                                                                assertionConsumerURLFromTemplate);
                                                        } }
                                                        data-testid={ `${ testId }-add-now-button` }
                                                    >
                                                        <span style={ { fontWeight: "bold" } }>Add Now</span>
                                                    </LinkButton>
                                                )
                                            }
                                        </Message.Content>
                                    </Message>
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                ) }
            </Grid>
        );
    };

    const renderURLConfiguration = (): ReactElement => {
        return (
            <>
                <Field
                    name="metadataURLValue"
                    label={
                        t("console:develop.features.applications.forms.inboundSAML.sections" +
                            ".configuration.fields.metadataURL.label")
                    }
                    required={ false }
                    requiredErrorMessage={
                        t("console:develop.features.applications.forms.inboundSAML.sections" +
                            ".configuration.fields.metadataURL.validations.empty")
                    }
                    placeholder={
                        t("console:develop.features.applications.forms.inboundSAML.sections" +
                            ".configuration.fields.metadataURL.placeholder")
                    }
                    type="text"
                    validation={ (value: string, validation: Validation) => {
                        if (!FormValidation.url(value)) {
                            validation.isValid = false;
                            validation.errorMessages.push(
                                t("console:develop.features.applications.forms.inboundSAML.sections" +
                                    ".configuration.fields.metadataURL.validations.invalid")
                            );
                        }
                    } }
                    value={
                        (MetadataTypeInterface.URL === metadata?.type)
                        && metadata?.value
                    }
                    readOnly={ readOnly }
                    data-testid={ `${ testId }-metadata-url-input` }
                />
            </>
        );
    };
    /**
     * submitURL function.
     */
    let submitUrl: (callback: (url?: string) => void) => void;

    return (
        templateValues
            ? (
                <Forms
                    onSubmit={ (values: Map<string, FormValue>): void => {
                        submitUrl((url: string) => {
                            // check whether assertionConsumer url is empty or not
                            if (isEmpty(assertionConsumerUrls) && isEmpty(url)) {
                                setAssertionConsumerUrlError(true);
                            } else {
                                onSubmit(getFormValues(values, url));
                            }
                        });
                    } }
                    submitState={ triggerSubmit }
                >
                    { /* Configuration Modes */ }
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Divider/>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Heading as="h5">
                                {
                                    t("console:develop.features.applications.forms.inboundSAML.sections" +
                                        ".configuration.heading")
                                }
                            </Heading>
                            <Field
                                name="type"
                                default={ ApplicationConfigurationModeInterface.MANUAL }
                                listen={
                                    (values) => {
                                        setMetadataFileSelected(values.get("type") === "METADATA_FILE");
                                        setManualConfigurationSelected(values.get("type") === "MANUAL");
                                    }
                                }
                                type="radio"
                                value={ metadata?.type }
                                children={ [
                                    {
                                        label: t("console:develop.features.applications.forms.inboundSAML" +
                                            ".sections.configuration.types.manual"),
                                        value: ApplicationConfigurationModeInterface.MANUAL
                                    },
                                    {
                                        label: t("console:develop.features.applications.forms.inboundSAML" +
                                            ".sections.configuration.types.metadataFile"),
                                        value: ApplicationConfigurationModeInterface.METADATA_FILE
                                    },
                                    {
                                        label: t("console:develop.features.applications.forms.inboundSAML" +
                                            ".sections.configuration.types.metadataURL"),
                                        value: ApplicationConfigurationModeInterface.METADATA_URL
                                    }
                                ] }
                                readOnly={ readOnly }
                                data-testid={ `${ testId }-configuration-mode-radio-group` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            {
                                isMetadataFileSelected
                                    ?
                                    (
                                        <>
                                            <AddIDPCertificateFormComponent
                                                triggerCertificateUpload={ triggerUpload }
                                                triggerSubmit={ finishSubmit }
                                                onSubmit={ handleWizardFormFinish }
                                            />
                                        </>
                                    )
                                    : (
                                        isManualConfigurationSelected
                                            ?
                                                renderManualConfiguration()
                                            :
                                                renderURLConfiguration()
                                    )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Forms>
            )
            : <ContentLoader/>
    );
};

/**
 * Default props for the saml protocol settings wizard form component.
 */
SAMLProtocolSettingsWizardForm.defaultProps = {
    "data-testid": "saml-protocol-settings-wizard-form",
    hideFieldHints: false
};
