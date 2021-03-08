/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Code, Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { InboundProtocolListItemInterface, RoleConfigInterface, SubjectConfigInterface }
    from "../../../../features/applications";
import { DropdownOptionsInterface } from "../../../../features/applications/components/settings";

interface AdvanceAttributeSettingsPropsInterface extends TestableComponentInterface {
    dropDownOptions: any;
    setSubmissionValues: any;
    setSelectedValue: any;
    defaultSubjectAttribute: string;
    triggerSubmission: boolean;
    initialSubject: SubjectConfigInterface;
    initialRole: RoleConfigInterface;
    claimMappingOn: boolean;
    technology: InboundProtocolListItemInterface[];
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

export const SubjectAttributeFieldName = "subjectAttribute";

/**
 * Advanced attribute settings component.
 *
 * @param {AdvanceAttributeSettingsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AdvanceAttributeSettings: FunctionComponent<AdvanceAttributeSettingsPropsInterface> = (
    props: AdvanceAttributeSettingsPropsInterface
): ReactElement => {

    const {
        dropDownOptions,
        setSubmissionValues,
        setSelectedValue,
        defaultSubjectAttribute,
        triggerSubmission,
        initialSubject,
        initialRole,
        claimMappingOn,
        readOnly,
        technology,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [selectedSubjectValue, setSelectedSubjectValue] = useState<string>();

    useEffect(() => {
        if(selectedSubjectValue) {
            if(dropDownOptions && dropDownOptions.length > 0 &&
                dropDownOptions.findIndex(option => option?.value === selectedSubjectValue) < 0) {
                setSelectedSubjectValue(defaultSubjectAttribute);
            }
        } else {
            setSelectedSubjectValue(initialSubject?.claim?.uri || dropDownOptions[ 0 ]?.value);
        }
    }, [dropDownOptions]);

    useEffect(() => {
        if(selectedSubjectValue) {
            setSelectedValue(selectedSubjectValue);
        }
    }, [selectedSubjectValue]);

    /**
     * Check whether initial value is exist in dropdown list.
     */
    const getDefaultDropDownValue = ((options, checkValue): string => {
        const dropDownOptions: DropdownOptionsInterface[] = options as DropdownOptionsInterface[];
        let claimURI = "";
        dropDownOptions.map((option) => {
            if (option.value === checkValue) {
                claimURI = checkValue;
            }
        });
        return claimURI;
    });

    const submitValues = (values) => {
        const settingValues = {
            subject: {
                claim: getDefaultDropDownValue(dropDownOptions, values.get("subjectAttribute"))
            }
        };
        setSubmissionValues(settingValues);
    };

    const subjectAttributeChangeListener = (tempForm: Map<string, FormValue>): void => {
        if(tempForm?.has(SubjectAttributeFieldName)) {
            setSelectedSubjectValue(tempForm.get(SubjectAttributeFieldName)?.toString());
        } else {
            setSelectedSubjectValue(null);
        }
    };

    const resolveSubjectAttributeHint = (): ReactElement => {
        if (technology.length === 1) {
            switch (technology[ 0 ].type) {
                case ("oauth2"):
                    return (
                        <Hint>
                            <Trans
                                i18nKey={
                                    "console:develop.features.applications.forms.advancedAttributeSettings.sections" +
                                    ".subject.fields.subjectAttribute.hintOIDC"
                                }
                            >
                                Select which of the shared attributes you want to use as the subject identifier of the
                                user. This represents the <Code withBackground>sub</Code> claim of the
                                <Code withBackground>id_token</Code>.
                            </Trans>
                        </Hint>
                    );
                case ("samlsso"):
                    return (
                        <Hint>
                            <Trans
                                i18nKey={
                                    "console:develop.features.applications.forms.advancedAttributeSettings.sections" +
                                    ".subject.fields.subjectAttribute.hintSAML"
                                }
                            >
                                Select which of the shared attributes you want to use as the subject identifier of the
                                user. This represents the <Code withBackground>subject</Code> element of the SAML
                                assertion.
                            </Trans>
                        </Hint>
                    );
                default:
                    return (
                        <Hint>
                            { t("console:develop.features.applications.forms.advancedAttributeSettings.sections" +
                                ".subject.fields.subjectAttribute.hint") }
                        </Hint>
                    );
            }
        }
        return (
            <Hint>
                { t("console:develop.features.applications.forms.advancedAttributeSettings.sections" +
                    ".subject.fields.subjectAttribute.hint") }
            </Hint>
        );
    };

    return (
        (initialRole && initialSubject)
            ? (
                <Forms
                    onSubmit={ (values) => {
                        submitValues(values);
                    } }
                    submitState={ triggerSubmission }
                >
                    <Grid className="form-container with-max-width">
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Heading as="h4">
                                    { t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                        "sections.subject.heading") }
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    name="subjectAttribute"
                                    label={
                                        t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                            ".sections.subject.fields.subjectAttribute.label")
                                    }
                                    required={ claimMappingOn }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                            "sections.subject.fields.subjectAttribute.validations.empty")
                                    }
                                    type="dropdown"
                                    value={ selectedSubjectValue }
                                    children={ dropDownOptions }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-subject-attribute-dropdown` }
                                    listen={ subjectAttributeChangeListener }
                                    enableReinitialize={ true }
                                />
                                { resolveSubjectAttributeHint() }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            )
            : null
    );
};

/**
 * Default props for the application advanced attribute settings component.
 */
AdvanceAttributeSettings.defaultProps = {
    "data-testid": "application-advanced-attribute-settings-form"
};
