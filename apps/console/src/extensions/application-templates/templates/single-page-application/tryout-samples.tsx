/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { Code, CodeEditor, GenericIcon, Heading, Text } from "@wso2is/react-components";
import isEmpty from "lodash/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Divider, Icon, Message } from "semantic-ui-react";
import AngularConfigCopyingIllustration from "./assets/angular-config-copying-illustration.svg";
import { ReactComponent as AngularLogo } from "./assets/angular-logo.svg";
import { ReactComponent as JavaScriptLogo } from "./assets/javascript-logo.svg";
import ReactConfigCopyingIllustration from "./assets/react-config-copying-illustration.svg";
import { SDKMeta } from "./meta";
import { SupportedSPATechnologyTypes } from "./models";
import {
    ApplicationInterface,
    ApplicationManagementUtils,
    ApplicationTemplateInterface,
    OIDCDataInterface,
    SupportedAuthProtocolTypes,
    updateAuthProtocolConfig
} from "../../../../features/applications";
import { Config } from "../../../../features/core/configs";
import ReactLogoDataURL from "../../../assets/images/icons/react-icon.svg";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";
import { AddUserStepContent } from "../../shared/components";

interface TryoutSamplesPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    template: ApplicationTemplateInterface;
    technology: SupportedSPATechnologyTypes;
    inboundProtocolConfig: any;
    onApplicationUpdate: () => void;
}

/**
 * Tryout Samples of Single Page Applications.
 *
 * @param {TryoutSamplesPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const TryoutSamples: FunctionComponent<TryoutSamplesPropsInterface> = (
    props: TryoutSamplesPropsInterface
): ReactElement => {

    const {
        application,
        inboundProtocolConfig,
        onApplicationUpdate,
        technology,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ authConfig, setAuthConfig ] = useState(undefined);

    const [ callbacksUpdated, setCallbacksUpdated ] = useState<boolean>(false);

    useEffect(() => {
        if (isEmpty(inboundProtocolConfig)) {
            return;
        }

        const configs = {
            clientID: inboundProtocolConfig.oidc?.clientId,
            serverOrigin: Config.getDeploymentConfig().serverHost,
            signInRedirectURL: "https://localhost:5000",
            signOutRedirectURL: "https://localhost:5000"
        };

        setAuthConfig(configs);
    }, [ inboundProtocolConfig ]);

    const checkCallbacks = (urlToCheck: string) => {

        const urlArray = (inboundProtocolConfig?.oidc?.callbackURLs
            && Array.isArray(inboundProtocolConfig.oidc.callbackURLs))
            ? EncodeDecodeUtils.decodeURLRegex(inboundProtocolConfig.oidc.callbackURLs[ 0 ])
            : [];

        if (!urlArray || !Array.isArray(urlArray) || urlArray.length < 1) {

            return false;
        }

        return urlArray.includes(urlToCheck);
    };

    const generateIntegrateCode = (technology: SupportedSPATechnologyTypes) => {

        if (!authConfig) {
            return null;
        }

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return `{
    "clientID": "${ authConfig.clientID }",
    "serverOrigin": "${ authConfig.serverOrigin }",
    "signInRedirectURL": "${ authConfig.signInRedirectURL }",
    "signOutRedirectURL": "${ authConfig.signOutRedirectURL }"
}`;
        }

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return `{
    "clientID": "${ authConfig.clientID }",
    "serverOrigin": "${ authConfig.serverOrigin }",
    "signInRedirectURL": "${ authConfig.signInRedirectURL }",
    "signOutRedirectURL": "${ authConfig.signOutRedirectURL }"
}`;
        }

        return `const authConfig = {
    clientID: "${ authConfig.clientID }",
    signInRedirectURL: "${ authConfig.signInRedirectURL }",
    serverOrigin: "${ authConfig.serverOrigin }",
};`;

    };

    const handleAddCallback = (url: string) => {

        const configuredCallbacks: any = ApplicationManagementUtils.buildCallBackURLWithSeparator(
            inboundProtocolConfig.oidc.callbackURLs[ 0 ]).split(",");

        const shouldUpdateCallbacks: boolean = !configuredCallbacks.includes(url);
        const shouldUpdateAllowedOrigins: boolean = !inboundProtocolConfig.oidc.allowedOrigins.includes(url);

        const body: OIDCDataInterface = {
            ...inboundProtocolConfig.oidc,
            allowedOrigins: shouldUpdateAllowedOrigins
                ? [ ...inboundProtocolConfig.oidc.allowedOrigins, url ]
                : inboundProtocolConfig.oidc.allowedOrigins,
            callbackURLs: shouldUpdateCallbacks
                ? [ ApplicationManagementUtils.buildCallBackUrlWithRegExp([ ...configuredCallbacks, url ].join(",")) ]
                : inboundProtocolConfig.oidc.callbackURLs
        };

        const resolveAlertContent = () => {

            if (shouldUpdateAllowedOrigins && shouldUpdateCallbacks) {
                return {
                    description: "Successfully updated the URLs in the application.",
                    level: AlertLevels.SUCCESS,
                    message: "Updated the URLs"
                };
            } else if (shouldUpdateCallbacks) {
                return {
                    description: "Successfully updated the Allowed Origins.",
                    level: AlertLevels.SUCCESS,
                    message: "Updated the URLs"
                };
            }

            return {
                description: "Successfully updated the Callback URLs in the application.",
                level: AlertLevels.SUCCESS,
                message: "Updated the URLs"
            };
        };

        updateAuthProtocolConfig(application.id, body, SupportedAuthProtocolTypes.OIDC)
            .then(() => {
                setCallbacksUpdated(true);
                dispatch(addAlert<AlertInterface>(resolveAlertContent()));
                onApplicationUpdate();
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: "An error occurred while updating the application.",
                    level: AlertLevels.ERROR,
                    message: "Error occurred"
                }));
            });
    };

    const generateSampleDownloadStep = (technology: SupportedSPATechnologyTypes) => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return (
                <>
                    <p>Click on the button below to download the sample.</p>
                    <Button
                        basic
                        data-testid={ `${ testId }-download-react-sample` }
                        className="sample-action-button download"
                        onClick={ () => window.open(SDKMeta.react.samples.basicUsage.artifact, "") }
                    >
                        <GenericIcon
                            transparent
                            icon={ ReactLogoDataURL }
                            size="mini"
                            spaced="right"
                            floated="left"
                        />
                        Download { technology } sample
                        <Icon name="download" className="ml-2" />
                    </Button>
                    <Button
                        basic
                        className="sample-action-button github"
                        onClick={ () => window.open(SDKMeta.react.samples.basicUsage.repository, "") }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                    <div className="mt-3">
                        <a
                            href={ SDKMeta.react.samples.root }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >
                            Click here <Icon name="external"/>
                        </a> to explore more samples like this.
                    </div>
                </>
            );
        } else if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return (
                <>
                    <p>Click on the button below to download the sample.</p>
                    <Button
                        basic
                        data-testid={ `${ testId }-download-js-sample` }
                        className="sample-action-button download"
                        onClick={ () => window.open(SDKMeta.javascript.samples.javascript.artifact, "") }
                    >
                        <GenericIcon
                            transparent
                            icon={ JavaScriptLogo }
                            size="mini"
                            spaced="right"
                            floated="left"
                        />
                        Download { technology } sample
                        <Icon name="download" className="ml-2" />
                    </Button>
                    <Button
                        basic
                        className="sample-action-button github"
                        onClick={ () => window.open(SDKMeta.javascript.samples.javascript.repository, "") }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                    <div className="mt-3">
                        <a
                            href={ SDKMeta.javascript.samples.root }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >
                            Click here <Icon name="external"/>
                        </a> to explore more samples like this.
                    </div>
                </>
            );
        } else if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return (
                <>
                    <p>Click on the button below to download the sample.</p>
                    <Button
                        basic
                        data-testid={ `${ testId }-download-angular-sample` }
                        className="sample-action-button download"
                        onClick={ () => window.open(SDKMeta.angular.samples.basicUsage.artifact, "") }
                    >
                        <GenericIcon
                            transparent
                            icon={ AngularLogo }
                            size="mini"
                            spaced="right"
                            floated="left"
                        />
                        Download { technology } sample
                        <Icon name="download" className="ml-2" />
                    </Button>
                    <Button
                        basic
                        className="sample-action-button github"
                        onClick={ () => window.open(SDKMeta.angular.samples.basicUsage.repository, "") }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                    <div className="mt-3">
                        <a
                            href={ SDKMeta.angular.samples.root }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >
                            Click here <Icon name="external"/>
                        </a> to explore more samples like this.
                    </div>
                </>
            );
        }
    };

    const generateConfigureStep = (technology: SupportedSPATechnologyTypes) => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return (
                <>
                    <Text>
                        Copy the following configuration and replace the content of the
                        <code className="inline-code">config.json</code> file found in the
                        <code className="inline-code">asgardeo-react-app/src</code> sample folder.
                    </Text>
                    <div className="code-segment">
                        <CodeEditor
                            oneLiner
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            className="application-sample-config-editor"
                            language="json"
                            sourceCode={ generateIntegrateCode(SupportedSPATechnologyTypes.REACT) }
                            beautify={ true }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                        />
                    </div>
                    <Divider hidden />
                </>
            );
        } else if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return (
                <>
                    <p className="mt-4">
                        Open the <strong>index.html</strong> file located at the root of
                        the project & scroll down to the <strong>{ "<script>" }</strong> tag at the end of the
                        <strong> body</strong> tag and find `authConfig` object.
                    </p>
                    <p>Change the configuration object as follows.</p>
                    <div className="code-segment">
                        <CodeEditor
                            oneLiner
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            className="application-sample-config-editor"
                            language="javascript"
                            sourceCode={ generateIntegrateCode(SupportedSPATechnologyTypes.JAVASCRIPT) }
                            beautify={ true }
                            theme="dark"
                            options={ {
                                lineWrapping: true
                            } }
                        />
                    </div>
                </>
            );
        } else if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return (
                <>
                    <Text>
                        Copy the following configuration and replace the content of the
                        <code className="inline-code">config.json</code> file found in the
                        <code className="inline-code">asgardeo-angular-app/src</code> sample folder.
                    </Text>
                    <div className="code-segment">
                        <CodeEditor
                            oneLiner
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            className="application-sample-config-editor"
                            language="json"
                            sourceCode={ generateIntegrateCode(SupportedSPATechnologyTypes.ANGULAR) }
                            beautify={ true }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                        />
                    </div>
                    <Divider hidden />
                </>
            );
        }

        return null;
    };

    const generateRunStep = (technology: SupportedSPATechnologyTypes): ReactNode => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return (
                <>
                    <p className="mt-2">
                        Run the following command at the root of the project to start up the sample application.
                        The app will be accessible at <a
                        href="https://localhost:5000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clickable-link"
                    >https://localhost:5000</a>.
                    </p>
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="javascript"
                        sourceCode="npm install && npm start"
                    />
                    <div className="mt-3">
                        For more guidance, navigate to our <a
                        href={ SDKMeta.react.repository }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clickable-link"
                    >
                        <Icon name="github"/>Github repository
                    </a>
                    </div>
                </>
            );
        }

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return (
                <>
                    <p className="mt-2">
                        Run the following command at the root of the project to start up the sample application.
                        The app will be accessible at <a
                            href="https://localhost:5000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="clickable-link"
                        >https://localhost:5000</a>.
                    </p>
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="javascript"
                        sourceCode="npm install && npm start"
                    />
                    <div className="mt-3">
                        For more guidance, navigate to our <a
                        href={ SDKMeta.angular.repository }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link external"
                    >
                        <Icon name="github"/>Github repository
                    </a>
                    </div>
                </>
            );
        }

        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return (
                <>
                    <p className="mt-2">
                        Run the following command at the root of the project to start up the sample application.
                        The app will be accessible at <a
                            href="https://localhost:5000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="clickable-link"
                        >https://localhost:5000</a>.
                        If opening the app in your browser results in an invalid-certificate error,
                        just type <code className="inline-code">thisisunsafe</code> on the keyboard to open the app.
                    </p>
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="javascript"
                        sourceCode="npm install && npm start"
                    />
                    <div className="mt-3">
                        For more guidance, navigate to our <a
                        href={ SDKMeta.javascript.repository }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link external"
                    >
                        <Icon name="github"/>Github repository
                    </a>
                    </div>
                </>
            );
        }

        return null;
    };

    const sampleFlowSteps: VerticalStepperStepInterface[] = [
        {
            stepContent: generateSampleDownloadStep(technology),
            stepTitle: "Download"
        },
        {
            stepContent: (
                <>
                    {
                        !callbacksUpdated
                        && !(checkCallbacks("https://localhost:5000")
                            && checkCallbacks("https://localhost:5000"))
                            ? (
                                <Message warning>
                                    <p>
                                        In order to try out the sample, you need to
                                        add <strong>https://localhost:5000</strong> to <strong>Authorized redirect
                                        URIs</strong>
                                        <Button color="orange" floated="right"
                                                onClick={ () => handleAddCallback("https://localhost:5000") }>Add
                                            Now</Button>
                                    </p>
                                </Message>
                            )
                            : null
                    }
                    { generateConfigureStep(technology) }
                </>
            ),
            stepTitle: "Configure"
        },
        {
            stepContent: <AddUserStepContent/>,
            stepTitle: "Add User"
        },
        {
            stepContent: generateRunStep(technology),
            stepTitle: "Run"
        }
    ];

    const renderPrerequisitesStep = (): ReactElement => {

        if (technology !== SupportedSPATechnologyTypes.REACT && technology !== SupportedSPATechnologyTypes.ANGULAR) {
            return null;
        }

        return (
            <div className="mt-3 mb-6">
                <Heading as="h3">Prerequisite</Heading>
                <Text>
                    You will need to have <strong>Node.js</strong> and <strong>npm</strong> installed on
                    your environment to try out the samples.
                </Text>
                <Text>To download the Long Term Support (LTS) version of <strong>Node.js </strong>
                    (which includes <strong>npm</strong>), navigate to the official <a
                        href="https://nodejs.org/en/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link external"
                    >downloads</a> page.
                </Text>
                {
                    technology === SupportedSPATechnologyTypes.ANGULAR && (
                        <Text>
                            <strong>Note: </strong>The SDK currently doesn&apos;t support Angular 11 applications{ " " }
                            in the <Code>Strict Mode</Code>. We are working on making the SDK compatible.
                        </Text>
                    )
                }
            </div>
        );
    };

    return (
        <>
            { renderPrerequisitesStep() }
            <VerticalStepper
                alwaysOpen
                isSidePanelOpen
                stepContent={ sampleFlowSteps }
                isNextEnabled={ technology !== undefined }
            />
        </>
    );
};
