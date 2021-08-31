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
import { GenericIcon, Heading, LinkButton, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import RegisterApplicationIllustration from "./assets/add-social-login-illustration.png";
import { IdentityProviderInterface, IdentityProviderTemplateInterface } from "../../../../features/identity-providers";
import ApplicationSelectionModal from "../../../components/developer-getting-started/application-selection-modal";

/**
 * Prop types of the component.
 */
interface FacebookAuthenticatorQuickStartPropsInterface extends TestableComponentInterface {
    /**
     * Identity provider object.
     */
    identityProvider: IdentityProviderInterface;
    /**
     * Identity provider template object.
     */
    template: IdentityProviderTemplateInterface;
}

/**
 * Quick start content for the Facebook IDP template.
 *
 * @param {FacebookAuthenticatorQuickStartPropsInterface} props - Props injected into the component.
 *
 * @return {React.ReactElement}
 */
const FacebookAuthenticatorQuickStart: FunctionComponent<FacebookAuthenticatorQuickStartPropsInterface> = (
    props: FacebookAuthenticatorQuickStartPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    const generateConfigureStep = (): ReactNode => {
        return (
            <>
                <Text>
                    <Trans
                        i18nKey={ "extensions:develop.identityProviders.facebook.quickStart.connectApp.description" }
                    >
                        Add <strong>Facebook</strong> authenticator to <strong>Step 1</strong> on
                        the <strong>Sign-in Method</strong> section of your <LinkButton
                            onClick={ () => setShowApplicationModal(true) }
                            className="p-0"
                        >
                            application.
                        </LinkButton>
                    </Trans>
                </Text>
                <GenericIcon
                    className="authenticator-quickstart-illustration"
                    icon={ RegisterApplicationIllustration }
                    size="auto"
                    transparent
                />
                {
                    showApplicationModal && (
                        <ApplicationSelectionModal
                            data-testid={ `${ testId }-application-selection-modal` }
                            open={ showApplicationModal }
                            onClose={ () => setShowApplicationModal(false) }
                            heading={
                                t("extensions:develop.identityProviders.facebook.quickStart.addLoginModal.heading")
                            }
                            subHeading={
                                t("extensions:develop.identityProviders.facebook.quickStart.addLoginModal.subHeading")
                            }
                        />
                    )
                }
            </>
        );
    };

    return (
        <Grid data-testid={ testId } className="authenticator-quickstart-content">
            <Grid.Row textAlign="left">
                <Grid.Column width={ 16 }>
                    <PageHeader
                        className="mb-2"
                        title={ t("extensions:develop.identityProviders.facebook.quickStart.heading") }
                        imageSpaced={ false }
                        bottomMargin={ false }
                    />
                    <Heading subHeading as="h6">
                        { t("extensions:develop.identityProviders.facebook.quickStart.subHeading") }
                    </Heading>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign="left">
                <Grid.Column width={ 16 }>
                    { generateConfigureStep() }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component
 */
FacebookAuthenticatorQuickStart.defaultProps = {
    "data-testid": "facebook-authenticator-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default FacebookAuthenticatorQuickStart;
