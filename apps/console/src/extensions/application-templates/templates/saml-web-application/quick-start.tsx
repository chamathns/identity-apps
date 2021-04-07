/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Grid } from "semantic-ui-react";
import { IntegrateSDKs } from "./integrate-sdks";
import { SupportedTraditionalSAMLAppTechnologyTypes } from "./models";
import { TryoutSamples } from "./tryout-samples";
import { ApplicationInterface, ApplicationTemplateInterface } from "../../../../features/applications/models";
import JavaLogo from "../../../assets/images/icons/java-logo.svg";
import { QuickStartModes } from "../../shared";
import { QuickStartPanelOverview, TechnologySelection } from "../../shared/components";
import { useSelector } from "react-redux";
import { AppState } from "../../../../features/core/store";

/**
 * Prop types of the component.
 */
interface TraditionalSAMLWebApplicationQuickStartPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
}

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
        inboundProtocolConfig,
        template,
        [ "data-testid" ]: testId
    } = props;

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(QuickStartModes.INTEGRATE);
    const [
        selectedTechnology,
        setSelectedTechnology
    ] = useState<SupportedTraditionalSAMLAppTechnologyTypes>(undefined);

    const handleIntegrateSelection = (selection: QuickStartModes): void => {
        setSelectedIntegration(selection);
    };
    const isHelpPanelVisible: boolean = useSelector((state: AppState) => state.helpPanel.visibility);

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
        <Grid data-testid={ testId } className="ml-0 mr-0">
            {
                !selectedTechnology
                    ? (
                        <Grid.Row className="technology-selection-wrapper" textAlign="center">
                            <Grid.Column width={ 16 }>
                                <TechnologySelection<SupportedTraditionalSAMLAppTechnologyTypes>
                                    technologies={ [
                                        {
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
                            </Grid.Column>.
                        </Grid.Row>
                    )
                    : (
                        <>
                            <Grid.Row>
                                <Grid.Column width={ isHelpPanelVisible ? 16 : 13 }>
                                    <QuickStartPanelOverview
                                        technology={ selectedTechnology }
                                        applicationType={ template.id }
                                        application={ application }
                                        inboundProtocols={ application?.inboundProtocols }
                                        onBackButtonClick={ () => resetTabState() }
                                        handleIntegrateSelection={ handleIntegrateSelection }
                                        technologyLogo={ resolveTechnologyLogo(selectedTechnology) }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={ isHelpPanelVisible ? 16 : 13 }>
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
