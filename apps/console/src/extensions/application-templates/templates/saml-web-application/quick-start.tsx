/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { IntegrateSDKs } from "./integrate-sdks";
import { SupportedTraditionalSAMLAppTechnologyTypes } from "./models";
import { TryoutSamples } from "./tryout-samples";
import {
    ApplicationInterface,
    ApplicationTemplateInterface,
    URLFragmentTypes
} from "../../../../features/applications/models";
import { history } from "../../../../features/core";
import JavaLogo from "../../../assets/images/icons/java-logo.svg";
import { QuickStartModes } from "../../shared";
import { QuickStartPanelOverview, TechnologySelection } from "../../shared/components";
import { useSelector } from "react-redux";
import { AppState } from "../../../../features/core/store";
import { Heading } from "@wso2is/react-components";
import { EventPublisher } from "../../../../features/core/utils";

/**
 * Prop types of the component.
 */
interface TraditionalSAMLWebApplicationQuickStartPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    onTriggerTabUpdate: (tabIndex: number) => void;
    template: ApplicationTemplateInterface;
    defaultTabIndex: number;
}

const INFO_TAB_INDEX: number = 6;
const QUICK_START_TAB_INDEX: number = 0;

/**
 * Quick start content for the Traditional Web Application template.
 *
 * @param {TraditionalSAMLWebApplicationQuickStartPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const TraditionalSAMLWebApplicationQuickStart: FunctionComponent<
    TraditionalSAMLWebApplicationQuickStartPropsInterface> = (
    props: TraditionalSAMLWebApplicationQuickStartPropsInterface
): ReactElement => {

    const {
        application,
        defaultTabIndex,
        inboundProtocolConfig,
        onTriggerTabUpdate,
        template,
        [ "data-testid" ]: testId
    } = props;

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(QuickStartModes.INTEGRATE);
    const [
        selectedTechnology,
        setSelectedTechnology
    ] = useState<SupportedTraditionalSAMLAppTechnologyTypes>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Called when the URL fragment updates
     */
    useEffect(()=> {

        if(!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            return;
        }

        const technologyType: string = (window.location.hash).split("&" + URLFragmentTypes.VIEW)[1].
        split("_")[1];

        if (SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE.toLowerCase() == unescape(technologyType)) {
            setSelectedTechnology(SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE);
        } else {
            handleInvalidURL();
        }
    },[ window.location.hash ]);

    /**
     * Handles invalid URL fragments
     */
    const handleInvalidURL = (): void => {

        history.push({
            hash: `${ URLFragmentTypes.TAB_INDEX }${ defaultTabIndex }`,
            pathname: window.location.pathname
        });

        setSelectedTechnology(undefined);
    };

    const handleIntegrateSelection = (selection: QuickStartModes): void => {
        setSelectedIntegration(selection);
    };

    const resolveQuickStartMode = (): ReactElement => {

        switch (selectedIntegration) {
            case QuickStartModes.INTEGRATE:
                return (
                    <IntegrateSDKs
                        application={ application }
                        template={ template }
                        technology={ selectedTechnology }
                        inboundProtocolConfig={ inboundProtocolConfig }
                    />
                );
            case QuickStartModes.SAMPLES:
                return (
                    <TryoutSamples
                        application={ application }
                        template={ template }
                        technology={ selectedTechnology }
                        inboundProtocolConfig={ inboundProtocolConfig }
                    />
                );
            default:
                return null;
        }
    };

    const resetTabState = () => {

        history.push({
            hash: `${ URLFragmentTypes.TAB_INDEX }${ QUICK_START_TAB_INDEX }`,
            pathname: window.location.pathname
        });

        setSelectedTechnology(undefined);
        setSelectedIntegration(QuickStartModes.INTEGRATE);
    };

    const resolveTechnologyLogo = (technology: SupportedTraditionalSAMLAppTechnologyTypes) => {

        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return JavaLogo;
        }

        return null;
    };

    return (
        <Grid data-testid={ testId }>
            {
                !(selectedTechnology || (window.location.hash).includes(URLFragmentTypes.VIEW))
                    ? (
                        <Grid.Row className="technology-selection-wrapper" textAlign="center">
                            <Grid.Column width={ 16 }>
                                <TechnologySelection<SupportedTraditionalSAMLAppTechnologyTypes>
                                    technologies={ [
                                        {
                                            "data-componentid": "java-ee",
                                            displayName: SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE,
                                            logo: JavaLogo,
                                            type: SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE
                                        }
                                    ] }
                                    onSelectedTechnologyChange={
                                        (technology: SupportedTraditionalSAMLAppTechnologyTypes) =>
                                            setSelectedTechnology(technology)
                                    }
                                />
                                <Grid.Row className="custom-configuration">
                                    <div data-testid={ testId } >
                                        <Divider hidden/>
                                        <Divider horizontal >
                                            <Heading as="h5" color={ "grey" } >OR</Heading>
                                        </Divider>
                                        <Heading as="h5" className="mb-1" compact >
                                            <Trans i18nKey="extensions:console.application.quickStart.
                                            technologySelectionWrapper.subHeading">
                                                You can find the identity provider details in the
                                                <a
                                                    className="link pointing"
                                                    onClick={ () => {
                                                        eventPublisher.publish(
                                                            "application-quick-start-visit-info-section"
                                                        );
                                                        
                                                        onTriggerTabUpdate(INFO_TAB_INDEX);
                                                    } }
                                                > Info section
                                                </a> to configure your application.
                                            </Trans>
                                        </Heading>
                                    </div>
                                </Grid.Row>
                            </Grid.Column>.
                        </Grid.Row>
                    )
                    : (
                        <>
                            <Grid.Row>
                                <Grid.Column width={ 16 }>
                                    <QuickStartPanelOverview
                                        technology={ selectedTechnology }
                                        applicationType={ template.id }
                                        application={ application }
                                        inboundProtocols={ application?.inboundProtocols }
                                        onBackButtonClick={ () => resetTabState() }
                                        handleIntegrateSelection={ handleIntegrateSelection }
                                        technologyLogo={ resolveTechnologyLogo(selectedTechnology) }
                                        defaultTabIndex={ defaultTabIndex }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={ 16 }>
                                    { resolveQuickStartMode() }
                                </Grid.Column>
                            </Grid.Row>
                        </>
                    )
            }
        </Grid>
    );
};

/**
 * Default props for the component
 */
TraditionalSAMLWebApplicationQuickStart.defaultProps = {
    "data-testid": "traditional-saml-web-app-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TraditionalSAMLWebApplicationQuickStart;
