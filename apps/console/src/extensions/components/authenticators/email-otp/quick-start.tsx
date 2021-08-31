/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, LinkButton, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import AddConnectionIllustration from "./assets/add-email-otp-illustration.png";
import ApplicationSelectionModal from "../../../components/developer-getting-started/application-selection-modal";

/**
 * Prop types of the component.
 */
type EmailOTPQuickStartPropsInterface = TestableComponentInterface;

/**
 * Quick start content for the Email OTP authenticator.
 *
 * @param {EmailOTPQuickStartPropsInterface} props - Props injected into the component.
 *
 * @return {React.ReactElement}
 */
const EmailOTPQuickStart: FunctionComponent<EmailOTPQuickStartPropsInterface> = (
    props: EmailOTPQuickStartPropsInterface
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
                        i18nKey={
                            "extensions:develop.identityProviders.emailOTP.quickStart.connectApp.description"
                        }
                    >
                        Add <strong>Email OTP</strong> to <strong>Step 2</strong> on the <strong>
                        Sign-in Method</strong> section of your
                        <LinkButton
                            onClick={ () => setShowApplicationModal(true) }
                            className="p-0"
                        >
                            application.
                        </LinkButton>
                    </Trans>
                </Text>
                <GenericIcon
                    className="authenticator-quickstart-illustration"
                    icon={ AddConnectionIllustration }
                    size="auto"
                    transparent
                />
                <Divider hidden />
                {
                    showApplicationModal && (
                        <ApplicationSelectionModal
                            data-testid={ `${ testId }-application-selection-modal` }
                            open={ showApplicationModal }
                            onClose={ () => setShowApplicationModal(false) }
                            heading={
                                t("extensions:develop.identityProviders.emailOTP.quickStart.addLoginModal.heading")
                            }
                            subHeading={
                                t("extensions:develop.identityProviders.emailOTP.quickStart.addLoginModal.subHeading")
                            }
                            data-componentid="connections"
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
                        title={ t("extensions:develop.identityProviders.emailOTP.quickStart.heading") }
                        imageSpaced={ false }
                        bottomMargin={ false }
                    />
                    <Heading subHeading as="h6">
                        { t("extensions:develop.identityProviders.emailOTP.quickStart.subHeading") }
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
EmailOTPQuickStart.defaultProps = {
    "data-testid": "email-otp-authenticator-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EmailOTPQuickStart;
