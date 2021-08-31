/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { CodeEditor, Text, Code, MessageWithIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Divider, DropdownItemProps, Form, Icon } from "semantic-ui-react";
import {
    angularSDKInitialisationCode,
    angularSDKIntegrationCode, javascriptSDKInitialisationCode,
    javascriptSDKIntegrationCode, reactSDKInitialisationCode,
    reactSDKIntegrationCode
} from "./code-blocks";
import { SDKMeta } from "./meta";
import { SupportedSPATechnologyTypes } from "./models";
import {
    ApplicationInterface,
    ApplicationTemplateInterface
} from "../../../../features/applications";
import { Config } from "../../../../features/core/configs";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";
import { AddUserStepContent } from "../../shared/components";

interface IntegrateSDKsPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    technology: SupportedSPATechnologyTypes;
    template: ApplicationTemplateInterface;
    inboundProtocolConfig: any;
}

/**
 * Integrate SDKs to Single Page Applications.
 *
 * @param {IntegrateSDKsPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const IntegrateSDKs: FunctionComponent<IntegrateSDKsPropsInterface> = (
    props: IntegrateSDKsPropsInterface
): ReactElement => {

    const {
        inboundProtocolConfig,
        technology,
        [ "data-testid" ]: testId
    } = props;

    const [ SDKInitConfig, setSDKInitConfig ] = useState(undefined);
    const [ configuredCallbacks, setConfiguredCallbacks ] = useState<DropdownItemProps[]>([]);
    const [ selectedLoginCallBack, setSelectedLoginCallBack ] = useState<any>("");
    const [ selectedLogoutCallBack, setSelectedLogoutCallBack ] = useState<any>("");

    useEffect(() => {

        if (!inboundProtocolConfig?.oidc?.callbackURLs
            || !Array.isArray(inboundProtocolConfig.oidc.callbackURLs)
            || inboundProtocolConfig.oidc.callbackURLs.length < 1) {

            return;
        }

        const callbacks: string[] = EncodeDecodeUtils.decodeURLRegex(inboundProtocolConfig.oidc.callbackURLs[ 0 ]);

        if (callbacks && Array.isArray(callbacks) && callbacks.length > 1) {
            callbacks.forEach((url: string) => {
                setConfiguredCallbacks((prevItems) => [
                    ...prevItems,
                    {
                        key: url,
                        text: url,
                        value: url
                    }
                ]);
            });
        }
    }, [ inboundProtocolConfig ]);

    useEffect(() => {
        if (!inboundProtocolConfig?.oidc) {
            return;
        }

        const configs = {
            clientID: inboundProtocolConfig.oidc.clientId,
            serverOrigin: Config.getDeploymentConfig().serverHost,
            signInRedirectURL: (configuredCallbacks.length > 1)
                ? selectedLoginCallBack
                : inboundProtocolConfig.oidc.callbackURLs[ 0 ],
            signOutRedirectURL: (configuredCallbacks.length > 1)
                ? selectedLogoutCallBack
                : inboundProtocolConfig.oidc.callbackURLs[ 0 ]
        };

        setSDKInitConfig(configs);
    }, [ inboundProtocolConfig, configuredCallbacks, selectedLoginCallBack, selectedLogoutCallBack ]);

    const generateConfigureStep = (technology: SupportedSPATechnologyTypes): ReactNode => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return (
                <>
                    <p>
                        Run the following command to install the React SDK and the necessary dependencies
                        from the npm registry.
                    </p>
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="htmlmixed"
                        sourceCode={ SDKMeta.react.npmInstallCommand }
                    />
                    <div className="mt-3">
                        <p>
                            Check out the <a
                            href={ SDKMeta.react.readme }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >
                            <Icon name="github" />documentation
                        </a> to learn more about API references, advanced usages etc.
                        </p>
                    </div>
                </>
            );
        }

        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return (
                <>
                    <p>Add the following script to the index.html of your application.</p>
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="htmlmixed"
                        sourceCode={ `<script src="${ SDKMeta.javascript.cdn }"></script>` }
                    />
                    <div className="mt-3">
                        <p>
                            Check out the <a
                            href={ SDKMeta.javascript.readme }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >
                            <Icon name="github" />documentation
                        </a> to learn more about API references, advanced usages etc.
                        </p>
                    </div>
                </>
            );
        }

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return (
                <>
                    <p>
                        Run the following command to install the Angular SDK from npm registry.
                    </p>
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="htmlmixed"
                        sourceCode={ SDKMeta.angular.npmInstallCommand }
                    />
                    <div className="mt-3">
                        <p>
                            Check out the <a
                            href={ SDKMeta.angular.readme }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >
                            <Icon name="github" />documentation
                        </a> to learn more about API references, advanced usages etc.
                        </p>
                    </div>
                </>
            );
        }

        return null;
    };

    const generateInitialisationStepTitle = (technology: SupportedSPATechnologyTypes): ReactNode => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return "Configure AuthProvider";
        }

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return "Configure AsgardeoAuthModule";
        }

        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return "Configure AsgardeoSPAClient";
        }

        return "Configure Client";
    };

    const generateInitialisationStep = (technology: SupportedSPATechnologyTypes): ReactNode => {

        if (!SDKInitConfig) {
            return null;
        }

        if (technology === SupportedSPATechnologyTypes.REACT) {

            return (
                <>
                    <Text>
                        Copy and use the following code within your root component to configure <code
                        className="inline-code">AuthProvider</code> for your application.
                    </Text>

                    <Text>
                        <strong>Note: </strong>Make sure to replace <code className="inline-code">HomePage</code>
                        component with your own component tree.
                    </Text>

                    <Text>
                        Asagrdeo uses <a
                            href="https://reactjs.org/docs/context.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external">
                                React Context API
                        </a> under the hood to manage state. You can easily integrate Asgardeo to your application by
                        wrapping your application with the <code className="inline-code">AuthProvider</code>.
                    </Text>

                    <Text>
                        <code className="inline-code">AuthProvider</code> takes a config object as a prop that can be
                        used to initialize the SDK instance. Pass the relevant <code className="inline-code">
                        clientID</code>, <code className="inline-code">serverOrigin</code>,
                        <code className="inline-code">signInRedirectURL</code> & <code className="inline-code">
                        signOutRedirectURL</code> to the <code className="inline-code">config</code> to get the SDK
                        to work with your application.
                    </Text>

                    <Divider hidden />

                    { renderCallbackURLSelectionOptions() }

                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            showLineNumbers
                            withClipboardCopy
                            language="typescript"
                            sourceCode={
                                reactSDKInitialisationCode({
                                    clientID: SDKInitConfig?.clientID,
                                    serverOrigin: SDKInitConfig?.serverOrigin,
                                    signInRedirectURL: (configuredCallbacks.length > 1)
                                        ? selectedLoginCallBack
                                        : SDKInitConfig?.signInRedirectURL,
                                    signOutRedirectURL: (configuredCallbacks.length > 1)
                                        ? selectedLogoutCallBack
                                        : SDKInitConfig?.signOutRedirectURL
                                })
                            }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                            readOnly
                        />
                    </div>
                </>
            );
        }

        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return (
                <>
                    <Text>
                        Copy and use the following code within your root component to configure <code
                        className="inline-code">AsgardeoSPAClient</code> for your application.
                    </Text>

                    <Text>
                        To initialize the SDK, use the <code className="inline-code">getInstance()</code> function in
                        the SDK and pass in the required <code className="inline-code">clientID</code>,
                        <code className="inline-code">serverOrigin</code>, <code className="inline-code">
                        signInRedirectURL</code> & <code className="inline-code">signOutRedirectURL</code> to the
                        <code className="inline-code">auth.initialize()</code> function.
                    </Text>

                    <Divider hidden />

                    { renderCallbackURLSelectionOptions() }

                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            showLineNumbers
                            withClipboardCopy
                            language="typescript"
                            sourceCode={
                                javascriptSDKInitialisationCode({
                                    clientID: SDKInitConfig?.clientID,
                                    serverOrigin: SDKInitConfig?.serverOrigin,
                                    signInRedirectURL: (configuredCallbacks.length > 1)
                                        ? selectedLoginCallBack
                                        : SDKInitConfig?.signInRedirectURL,
                                    signOutRedirectURL: (configuredCallbacks.length > 1)
                                        ? selectedLogoutCallBack
                                        : SDKInitConfig?.signOutRedirectURL
                                })
                            }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                            readOnly
                        />
                    </div>
                </>
            );
        }

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return (
                <>
                    <Text>
                        Copy and use the following code within your root component to configure <code
                        className="inline-code">AsgardeoAuthModule</code> for your application.
                    </Text>

                    <Text>
                        Pass the relevant <code className="inline-code">clientID</code>, <code
                        className="inline-code">serverOrigin</code>, <code className="inline-code">
                        signInRedirectURL</code> & <code className="inline-code">signOutRedirectURL</code> to the
                        <code className="inline-code">forRoot()</code> function of <code className="inline-code">
                        AsgardeoAuthModule</code> to get the SDK to work with your application.
                    </Text>

                    <Divider hidden />

                    { renderCallbackURLSelectionOptions() }

                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            showLineNumbers
                            withClipboardCopy
                            language="typescript"
                            sourceCode={
                                angularSDKInitialisationCode({
                                    clientID: SDKInitConfig?.clientID,
                                    serverOrigin: SDKInitConfig?.serverOrigin,
                                    signInRedirectURL: (configuredCallbacks.length > 1)
                                        ? selectedLoginCallBack
                                        : SDKInitConfig?.signInRedirectURL,
                                    signOutRedirectURL: (configuredCallbacks.length > 1)
                                        ? selectedLogoutCallBack
                                        : SDKInitConfig?.signOutRedirectURL
                                })
                            }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                            readOnly
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const generateAuthenticationStep = (technology: SupportedSPATechnologyTypes): ReactNode => {

        if (technology === SupportedSPATechnologyTypes.REACT) {

            return (
                <>
                    <Text>
                        The Asgardeo React SDK provides React Hooks to easily authenticate your React application.
                        Implement a <strong>Login button</strong> using the <code className="inline-code">signIn()
                        </code> function in the <code className="inline-code">useAuthContext</code> hook.
                        Similarly, you can also implement a <strong>Logout button</strong> using the
                        <code className="inline-code">signOut()</code> function.
                    </Text>

                    <Text>
                        If you wish to access the authenticated user&apos;s details, use the <code
                        className="inline-code">state</code> object from the <code className="inline-code">
                        useAuthContext</code> hook.
                    </Text>

                    <Divider hidden />

                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            showLineNumbers
                            withClipboardCopy
                            language="javascript"
                            sourceCode={ reactSDKIntegrationCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                            readOnly
                        />
                    </div>
                </>
            );
        }

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {

            return (
                <>
                    <Text>
                        Inject <code className="inline-code">AsgardeoAuthService</code> to your components
                        to access the authenticated state and sign-in and sign-out functionalities.
                    </Text>

                    <Divider hidden />

                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            showLineNumbers
                            withClipboardCopy
                            language="typescript"
                            sourceCode={ angularSDKIntegrationCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                            readOnly
                        />
                    </div>
                </>
            );
        }

        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {

            return (
                <>
                    <Text>
                        The <code className="inline-code">sign-in</code> hook is used to fire a callback function
                        after successful sign-in.
                    </Text>

                    <Text>
                        To sign in, simply call the <code className="inline-code">signIn()</code> function using the
                        created instance. Similarly, call the <code className="inline-code">signOut()</code> function
                        for application sign-out.
                    </Text>

                    <Divider hidden />

                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            showLineNumbers
                            withClipboardCopy
                            language="javascript"
                            sourceCode={ javascriptSDKIntegrationCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                            readOnly
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const renderCallbackURLSelectionOptions = () => {

        if (configuredCallbacks.length < 1) {
            return null;
        }

        return  (
            <>
                <Text>
                    Since you have configured multiple redirect URLs for your application, please select the
                    relevant Sign-in Redirect URL and Sign-out Redirect URL from the below dropdowns.
                </Text>
                <Form>
                    <Form.Group widths="3">
                        <Form.Select
                            fluid
                            onChange={ (value, data) => {
                                setSelectedLoginCallBack(data.value);
                            } }
                            label="Select Sign-in Redirect URL:"
                            options={ configuredCallbacks }
                            placeholder="Sign-in Redirect URL"
                        />
                    </Form.Group>
                    <Form.Group widths="3">
                        <Form.Select
                            fluid
                            onChange={ (value, data) => {
                                setSelectedLogoutCallBack(data.value);
                            } }
                            label="Select Sign-out Redirect URL:"
                            options={ configuredCallbacks }
                            placeholder="Sign-out Redirect URL"
                        />
                    </Form.Group>
                </Form>
                <Divider hidden/>
            </>
        );
    };

    const integrationFlowSteps: VerticalStepperStepInterface[] = [
        {
            stepContent: generateConfigureStep(technology),
            stepTitle: "Install SDK"
        },
        {
            stepContent: generateInitialisationStep(technology),
            stepTitle: generateInitialisationStepTitle(technology)
        },
        {
            stepContent: generateAuthenticationStep(technology),
            stepTitle: "Add Login"
        }
    ];

    const renderPrerequisitesStep = (): ReactElement => {

        if (technology !== SupportedSPATechnologyTypes.REACT && technology !== SupportedSPATechnologyTypes.ANGULAR) {
            return null;
        }

        return (
            <div className="mt-3 mb-6">
                <MessageWithIcon
                    type={ "info" }
                    header={ "Prerequisite" }
                    content={ (
                        <Text className={ 'message-info-text' } >
                            You will need to have <strong>Node.js</strong> and <strong>npm</strong> installed on
                            your environment to try out the SDK.

                            To download the Long Term Support (LTS) version of <strong>Node.js </strong>
                            (which includes <strong>npm</strong>), navigate to the official <a
                            href="https://nodejs.org/en/download/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >downloads</a> page.
                        </Text>
                    ) }
                />
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
                stepContent={ integrationFlowSteps }
                isNextEnabled={ technology !== undefined }
                data-testid={ `${ testId }-vertical-stepper` }
            />
            <Divider hidden className="x2"/>
            <div className="mt-3 mb-6">
                <MessageWithIcon
                    type={ "info" }
                    header={ "Try Out!" }
                    content={ <AddUserStepContent/> }
                />
            </div>
        </>
    );
};
