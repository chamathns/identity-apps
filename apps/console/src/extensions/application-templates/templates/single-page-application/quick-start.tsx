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
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Grid } from "semantic-ui-react";
import AngularLogo from "./assets/angular-logo.svg";
import JavaScriptLogo from "./assets/javascript-logo.svg";
import ReactLogo from "./assets/react-icon.svg";
import { IntegrateSDKs } from "./integrate-sdks";
import { SupportedSPATechnologyTypes } from "./models";
import { TryoutSamples } from "./tryout-samples";
import { ApplicationInterface, ApplicationTemplateInterface } from "../../../../features/applications/models";
import { QuickStartModes } from "../../shared";
import { QuickStartPanelOverview, TechnologySelection } from "../../shared/components";

/**
 * Prop types of the component.
 */
interface SinglePageApplicationQuickStartPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
    onApplicationUpdate: () => void;
}

/**
 * Quick start content for the Single page application template.
 *
 * @param {SinglePageApplicationQuickStartPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const SinglePageApplicationQuickStart: FunctionComponent<SinglePageApplicationQuickStartPropsInterface> = (
    props: SinglePageApplicationQuickStartPropsInterface
): ReactElement => {

    const {
        application,
        inboundProtocolConfig,
        onApplicationUpdate,
        template,
        [ "data-testid" ]: testId
    } = props;

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(QuickStartModes.INTEGRATE);
    const [ selectedTechnology, setSelectedTechnology ] = useState<SupportedSPATechnologyTypes>(undefined);

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
                        onApplicationUpdate={ onApplicationUpdate }
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

    const resolveTechnologyLogo = (technology: SupportedSPATechnologyTypes) => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return ReactLogo;
        }

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return AngularLogo;
        }

        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return JavaScriptLogo;
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
                                <TechnologySelection<SupportedSPATechnologyTypes>
                                    technologies={ [
                                        {
                                            displayName: SupportedSPATechnologyTypes.REACT,
                                            logo: ReactLogo,
                                            type: SupportedSPATechnologyTypes.REACT
                                        },
                                        {
                                            displayName: SupportedSPATechnologyTypes.ANGULAR,
                                            logo: AngularLogo,
                                            type: SupportedSPATechnologyTypes.ANGULAR
                                        },
                                        {
                                            displayName: SupportedSPATechnologyTypes.JAVASCRIPT,
                                            logo: JavaScriptLogo,
                                            type: SupportedSPATechnologyTypes.JAVASCRIPT
                                        }
                                    ] }
                                    onSelectedTechnologyChange={
                                        (technology: SupportedSPATechnologyTypes) => setSelectedTechnology(technology)
                                    }
                                />
                            </Grid.Column>.
                        </Grid.Row>
                    )
                    : (
                        <>
                            <Grid.Row>
                                <Grid.Column width={ 13 }>
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
                                <Grid.Column width={ 13 }>
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
SinglePageApplicationQuickStart.defaultProps = {
    "data-testid": "spa-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SinglePageApplicationQuickStart;
