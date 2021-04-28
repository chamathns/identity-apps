/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, useWizardAlert, ContentLoader } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import { addNewTenant, checkDuplicateTenants } from "../../api";
import { AddTenantWizardForm } from "../forms";
import delay from "lodash-es/delay";
import { handleTenantSwitch } from "../../utils";

/**
 * Interface for add tenant wizard props.
 */
interface AddTenantWizardPropsInterface extends TestableComponentInterface {
    openModal: boolean;
    onCloseHandler: () => void;
}

/**
 * Wizard component to add a new tenant.
 *
 * @param {AddTenantWizardPropsInterface} props - props required for the wizard component.
 * @return {React.ReactElement}
 */
export const AddTenantWizard: FunctionComponent<AddTenantWizardPropsInterface> = (
    props: AddTenantWizardPropsInterface
): ReactElement => {

    const {
        openModal,
        onCloseHandler,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(0);
    const [ isTenantDuplicate, setIsTenantDuplicate ] = useState<boolean>(false);
    const [ isNewTenantLoading, setIsNewTenantLoading ] = useState<boolean>(false);
    const [ tenantLoaderText, setTenantLoaderText ] = useState<string>();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const handleFormSubmit = (values: any): void => {
        setIsNewTenantLoading(true);
        setTenantLoaderText(t("extensions:manage.features.tenant.wizards.addTenant.forms.loaderMessages.duplicateCheck"));
        checkDuplicateTenants(values.tenantName)
            .then((response: AxiosResponse) => {
                setIsNewTenantLoading(false);
                if (response.status == 200) {
                    setIsTenantDuplicate(true);
                    setAlert({
                        description: t("extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.validations.duplicate",
                            { tenantName: values.tenantName}),
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.genericError.message")
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    // Proceed to tenant creation if tenant does not exist.
                    addTenant(values.tenantName);
                } else {
                    setIsNewTenantLoading(false);
                    setAlert({
                        description: t("extensions:manage.features.tenant.notifications.addTenant.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.genericError.message")
                    });
                }
            });
    };

    const WIZARD_STEPS = [ {
        content: (
            <AddTenantWizardForm
                onSubmit={ (values) => handleFormSubmit(values) }
                triggerSubmit={ finishSubmit }
                data-testid={ `${ testId }-form` }
                tenantDuplicate={ isTenantDuplicate }
                setTenantDuplicate={ setIsTenantDuplicate }
            />
        ),
        icon: '', // TODO: Add icon
        title: t("extensions:manage.features.tenant.wizards.addTenant.heading")
    } ];

    const addTenant = (tenantName: string): void => {
        setIsNewTenantLoading(true);
        setTenantLoaderText(t("extensions:manage.features.tenant.wizards.addTenant.forms.loaderMessages.tenantCreate"))
        addNewTenant(tenantName)
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:manage.features.tenant.notifications.addTenant.success.description",
                            tenantName),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.success.message")
                    }));

                    setTenantLoaderText(t("extensions:manage.features.tenant.wizards.addTenant.forms.loaderMessages.tenantSwitch"));

                    // Delay 5s to give the user ample time to read the redirection message.
                    delay(() => {
                        setIsNewTenantLoading(false);
                        onCloseHandler();
                        handleTenantSwitch(tenantName);
                    }, 5000);
                }
            })
            .catch(error => {
                setIsNewTenantLoading(false);
                if (error.response.data?.code &&
                    ["TM-10011", "TM-10004", "TM-10008", "TM-10005"].includes(error.response.data.code)) {

                    setAlert({
                        description: "Some personal information required for this operation is missing.",
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.genericError.message")
                    });
                } else {
                    setAlert({
                        description: t("extensions:manage.features.tenant.notifications.addTenant.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:manage.features.tenant.notifications.addTenant.genericError.message")
                    });
                }
            });
    };

    return (
        <Modal
            open={ openModal }
            className="wizard add-tenant-wizard"
            dimmer="blurring"
            size="tiny"
            onClose={ onCloseHandler }
            closeOnDimmerClick={ false }
            closeOnEscape={ false }
            data-testid={ testId }
        >
            <Modal.Header className="wizard-header add-tenant-wizard-header">
                { t("extensions:manage.features.tenant.wizards.addTenant.heading") }
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { WIZARD_STEPS[ currentStep ].content }
                {
                    isNewTenantLoading && (
                    <ContentLoader text={ tenantLoaderText }/>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => {
                                    onCloseHandler();
                                } }
                                disabled={ isNewTenantLoading }
                                data-testid={ `${ testId }-cancel-button` }
                            >
                                { t("cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                onClick={ setFinishSubmit }
                                data-testid={ `${ testId }-create-button` }
                                disabled={ isNewTenantLoading }
                            >
                                { t("common:create") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
AddTenantWizard.defaultProps = {
    "data-testid": "tenant-add-wizard"
};
