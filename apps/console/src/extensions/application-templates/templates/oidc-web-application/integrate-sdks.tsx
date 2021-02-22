/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { FormValidation } from "@wso2is/validation";
import { addAlert } from "@wso2is/core/store";
import { EncodeDecodeUtils } from "@wso2is/core/utils";

import { CodeEditor, Heading, Text, GenericIcon, Hint } from "@wso2is/react-components";
import isEmpty from "lodash/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, DropdownItemProps, Form, Icon, InputOnChangeData, List, Message } from "semantic-ui-react";
import {
    dotNetSDKConfigCode,
    dotNetSDKLoginCode,
    dotNetSDKLogoutCode,
    dotNetSDKNugetCLICode,
    tomcatOIDCAgentLoginButtonCode,
    tomcatOIDCAgentLogoutCode,
    tomcatOIDCAgentMavenDependencyCode,
    tomcatOIDCAgentSamplePropertiesCode,
    tomcatOIDCAgentSampleWebXMLCode,
    wso2InternalRepoPointingCode
} from "./code-blocks";
import { SDKMeta } from "./meta";
import { SupportedTraditionalOIDCAppTechnologyTypes } from "./models";
import {
    ApplicationInterface,
    ApplicationManagementUtils,
    ApplicationTemplateInterface, OIDCDataInterface, SupportedAuthProtocolTypes, updateAuthProtocolConfig
} from "../../../../features/applications";
import { Config } from "../../../../features/core/configs";
import { ConfigReducerStateInterface } from "../../../../features/core/models";
import { AppState } from "../../../../features/core/store";
import TomcatLogo from "../../../assets/images/icons/tomcat-icon.svg";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";

interface IntegrateSDKsPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    technology: SupportedTraditionalOIDCAppTechnologyTypes;
    template: ApplicationTemplateInterface;
    inboundProtocolConfig: any;
    onApplicationUpdate: () => void;
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
        application,
        inboundProtocolConfig,
        onApplicationUpdate,
        technology,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ SDKInitConfig, setSDKInitConfig ] = useState(undefined);
    const [ configuredCallbacks, setConfiguredCallbacks ] = useState<DropdownItemProps[]>([]);
    const [ sampleServerHost, setSampleServerHost ] = useState<string>(null);
    const [ callbacksUpdated, setCallbacksUpdated ] = useState<boolean>(false);
    const [ appContextPath, setAppContextPath ] = useState<string>(null);
    const [ isValidAppContextPath, setIsValidAppContextPath ] = useState<boolean>(true);

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
            clientSecret: inboundProtocolConfig.oidc.clientSecret,
            serverOrigin: Config.getDeploymentConfig().serverHost,
            signInRedirectURL: configuredCallbacks[ 0 ] ? configuredCallbacks[ 0 ].value : null,
            signOutRedirectURL: configuredCallbacks[ 0 ] ? configuredCallbacks[ 0 ].value : null,
        };

        setSDKInitConfig(configs);
    }, [ inboundProtocolConfig, configuredCallbacks ]);

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

    const checkCallbacks = (urlToCheck: string) => {
        const urlArray = inboundProtocolConfig.oidc
            ? EncodeDecodeUtils.decodeURLRegex(inboundProtocolConfig.oidc.callbackURLs[ 0 ])
            : [];

        if (!urlArray || !Array.isArray(urlArray) || urlArray.length < 1) {

            return false;
        }

        return urlArray.includes(urlToCheck);
    };

    const generateConfigureStepTitle = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactNode => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
            return "Add Dependencies";
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return "Installing the SDK";
        }

        return "Configure SDK";
    };

    const generateConfigureStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactNode => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
            return (
                <>
                    <Text>
                        To ease the developers, we&apos;ve introduced the <a
                            href="https://github.com/asgardeo/asgardeo-tomcat-oidc-agent"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >Asgardeo OIDC Agent</a>. You can use this Agent in your project by updating
                        your <code className="inline-code">pom.xml</code> file with the following dependency.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            beautify
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatOIDCAgentMavenDependencyCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>

                    <Divider hidden />

                    <Text>
                        The Agent is hosted at <strong>WSO2 Internal Repository</strong>.
                        To resolve the dependency mentioned above, point to the repository as follows.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ wso2InternalRepoPointingCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                            height="100%"
                        />
                    </div>
                </>
            );
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return (
                <>
                    <Text>
                        You can download the SDK using <strong>Nuget Package Manger</strong> by following the steps
                        below.
                    </Text>

                    <List ordered>
                        <List.Item>
                            Open the <a
                            href="https://www.nuget.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                            >Nuget Package Manger</a>.
                        </List.Item>
                        <List.Item>
                            Search for <code className="inline-code">Asgardeo.OIDC.SDK</code>.
                        </List.Item>
                        <List.Item>
                            Include it with the suggested required dependencies for the project/solution.
                        </List.Item>
                    </List>

                    <Text>
                        Alternatively, you can also run the following command in the Package Manager CLI as shown below.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            beautify
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ dotNetSDKNugetCLICode() }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>

                    <div className="mt-3">
                        <Text>
                            Check out the <a
                            href={ SDKMeta.dotNet.readme }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >
                            <Icon name="github" />documentation
                        </a> to learn more about other installation options.
                        </Text>
                    </div>
                </>
            );
        }

        return null;
    };

    const generateInitialisationStepTitle = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactNode => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
            return "Configure";
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return "Configure";
        }

        return "Configure";
    };

    const handleURLFieldUpdate = (e: ChangeEvent, data: InputOnChangeData) => {
        if (FormValidation.url(data.value)) {
            setIsValidAppContextPath(true);
            setAppContextPath(data.value);
        } else {
            setAppContextPath(null);
            setIsValidAppContextPath(false);
        }
    }

    const renderAppContextInput = () => {

        return  (
            <>
                <Form>
                    <Form.Group widths="3">
                        <Form.Input
                            fluid
                            placeholder="https://myapp.io"
                            label="App Context Path"
                            value={ appContextPath }
                            onChange={ (e, data) => {
                                handleURLFieldUpdate(e, data);
                            } }
                        />
                    </Form.Group>
                    <Hint>
                        Few of the configurations such as <code className="inline-code">callBackURL</code> and <code
                        className="inline-code">skipURIs</code> depends on your <strong>App context path</strong>.
                    </Hint>
                </Form>

                <Text>

                </Text>
                { !isValidAppContextPath && (
                    <Message error>
                        <p>Please enter a valid URL</p>
                    </Message>
                ) }
            </>
        );
    };

    const generateInitialisationStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactNode => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {

            return (
                <>
                    {
                        !callbacksUpdated
                            && !isEmpty(sampleServerHost)
                            && !(checkCallbacks(
                                sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.sigInRedirectURL))
                            ? (
                                <Message warning>
                                    <p>
                                        In order to try out the sample, you need to
                                        add <strong>
                                        { sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.sigInRedirectURL }
                                        </strong> to <strong>Authorized redirect URIs</strong>
                                        <Button
                                            color="orange"
                                            floated="right"
                                            onClick={
                                                () => handleAddCallback(sampleServerHost +
                                                    SDKMeta.tomcatOIDCAgent.sample.sigInRedirectURL)
                                            }
                                        >
                                            Add Now
                                        </Button>
                                    </p>
                                </Message>
                            )
                            : null
                    }

                    <Text>
                        We provide the Asgardeo endpoints to the application using a property file, which is read
                        by the Asgardeo OIDC Agent.
                    </Text>
                    <Text>
                        Create a file named <code className="inline-code">oidc-sample-app.properties</code> inside the
                        <code className="inline-code">&#60;YOUR_APP&#62;/src/main/resources</code> directory,
                        using the content below.
                    </Text>
                    <Text>
                        Note the property, <strong>skipURIs</strong>. This defines the application paths that will not
                        be protected.
                    </Text>

                    <Divider hidden />

                    { renderAppContextInput() }

                    {
                        !callbacksUpdated
                        && !isEmpty(appContextPath)
                        && !(checkCallbacks(
                            appContextPath + SDKMeta.tomcatOIDCAgent.integrate.defaultCallbackContext))
                            ? (
                                <Message warning>
                                    <p>
                                        For successful integration, you need to
                                        add <strong>
                                        { appContextPath + SDKMeta.tomcatOIDCAgent.integrate.defaultCallbackContext }
                                    </strong> to <strong>Authorized redirect URIs</strong>
                                        <Button
                                            color="orange"
                                            floated="right"
                                            onClick={
                                                () => handleAddCallback(appContextPath +
                                                    SDKMeta.tomcatOIDCAgent.integrate.defaultCallbackContext)
                                            }
                                        >
                                            Add Now
                                        </Button>
                                    </p>
                                </Message>
                            )
                            : null
                    }

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatOIDCAgentSamplePropertiesCode(SDKInitConfig, appContextPath) }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>

                    <Divider hidden/>

                    <Text>
                        A comprehensive list of the properties used above, can be found in the <a
                            href={ SDKMeta.tomcatOIDCAgent.catalog }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >Configuration Catalog</a>.
                    </Text>

                    <Divider hidden/>

                    <Text>
                        Finally, copy and paste the following configuration to the <code
                        className="inline-code">&#60;YOUR_APP&#62;/src/main/webapp/WEB-INF/web.xml</code> file.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatOIDCAgentSampleWebXMLCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                        />
                    </div>
                </>
            );
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {

            return (
                <>
                    <Text>
                        Once you have installed the SDK, create a file named <code className="inline-code">
                        App.config</code> in the application path and add the following configuration.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ dotNetSDKConfigCode(SDKInitConfig) }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const generateLoginStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactNode => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {

            return (
                <>
                    <Text>
                        In the <code className="inline-code">index.html</code> file, add a login button to be used to
                        forward users to secured pages.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            beautify
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatOIDCAgentLoginButtonCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                </>
            );
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {

            return (
                <>
                    <Text>
                        Use the following code snippet to authenticate a user.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            beautify
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ dotNetSDKLoginCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const generateLogoutStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactNode => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {

            return (
                <>
                    <Text>
                        Add the following snippet to enable logout from a secured page.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            beautify
                            readOnly
                            oneLiner
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatOIDCAgentLogoutCode() }
                            theme="dark"
                            height="100%"
                        />
                    </div>
                </>
            );
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {

            return (
                <>
                    <Text>
                        Use the following code snippet to log out an already logged in user.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            beautify
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ dotNetSDKLogoutCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const integrationFlowSteps: VerticalStepperStepInterface[] = [
        {
            stepContent: generateConfigureStep(technology),
            stepTitle: generateConfigureStepTitle(technology)
        },
        {
            stepContent: generateInitialisationStep(technology),
            stepTitle: generateInitialisationStepTitle(technology)
        },
        {
            stepContent: generateLoginStep(technology),
            stepTitle: "Add Login"
        },
        {
            stepContent: generateLogoutStep(technology),
            stepTitle: "Add Logout"
        }
    ];

    const renderPrerequisitesStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactElement => {

        if (!(technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE
            || technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET)) {

            return null;
        }

        const generateContent = () => {

            if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
                return (
                    <>
                        <Message
                            icon="info circle"
                            content={ (
                                <p>
                                    In this section, we guide you on how to configure your own Java application that
                                    uses <strong>Apache Maven</strong> (3.6.x or higher) as the package manager
                                    and <GenericIcon
                                        transparent
                                        icon={ TomcatLogo }
                                        size="micro"
                                        style={ {
                                            "display": "inline",
                                            "vertical-align": "sub"
                                        } }
                                    /> <strong>Apache Tomcat</strong> (8.x or higher) as the deployment engine. You may 
                                    need to adjust some of the steps if you&apos;re working with a different application 
                                    container or technology.
                                </p>
                            ) }
                        />
                        <Text>To download the latest <strong>Apache Maven</strong>, navigate to the official <a
                            href="https://maven.apache.org/download.cgi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >downloads</a> page.
                        </Text>
                    </>
                );
            }

            if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
                return (
                    <>
                        <Message
                            icon="info circle"
                            content={ (
                                <p>
                                    In this section we&apos;re guiding you on configuring your own .Net application
                                    that uses <strong>Microsoft Windows 8</strong> (Or server equivalent) or greater,
                                    and <strong>.NET Framework 4.6.1</strong> (or greater).
                                </p>
                            ) }
                        />
                        <Text>
                            To download <strong>.NET Framework</strong>, navigate to the official <a
                                href="https://dotnet.microsoft.com/download/dotnet-framework/net461"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link external"
                            >downloads</a> page.
                        </Text>
                    </>
                );
            }
        };

        return (
            <div className="mt-3 mb-6">
                <Heading as="h3">Prerequisite</Heading>
                { generateContent() }
            </div>
        );
    };

    return (
        <>
            { renderPrerequisitesStep(technology) }
            <VerticalStepper
                alwaysOpen
                isSidePanelOpen
                stepContent={ integrationFlowSteps }
                isNextEnabled={ technology !== undefined }
                data-testid={ `${ testId }-vertical-stepper` }
            />
        </>
    );
};
