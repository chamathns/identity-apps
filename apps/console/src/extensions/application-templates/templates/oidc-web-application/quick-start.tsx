/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { IntegrateSDKs } from "./integrate-sdks";
import { SupportedTraditionalOIDCAppTechnologyTypes } from "./models";
import { TryoutSamples } from "./tryout-samples";
import {
    ApplicationInterface,
    ApplicationListInterface,
    ApplicationTemplateInterface
} from "../../../../features/applications/models";
import { getTechnologyLogos } from "../../../../features/core/configs";
import JavaLogo from "../../../assets/images/icons/java-logo.svg";
import DotNetLogo from "../../../../themes/default/assets/images/technologies/dotnet-logo.svg";
import { QuickStartModes } from "../../shared";
import { QuickStartPanelOverview, TechnologySelection } from "../../shared/components";
import { getApplicationList } from "../../../../features/applications/api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { useTranslation } from "react-i18next";

/**
 * Prop types of the component.
 */
interface TraditionalOIDCWebApplicationQuickStartPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
    onApplicationUpdate: () => void;
}

/**
 * Quick start content for the Traditional OIDC Web Application template.
 *
 * @param {TraditionalOIDCWebApplicationQuickStartPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const TraditionalOIDCWebApplicationQuickStart: FunctionComponent<
    TraditionalOIDCWebApplicationQuickStartPropsInterface> = (
        props: TraditionalOIDCWebApplicationQuickStartPropsInterface
): ReactElement => {

    const {
        application,
        inboundProtocolConfig,
        onApplicationUpdate,
        template,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(QuickStartModes.INTEGRATE);
    const [
        selectedTechnology,
        setSelectedTechnology
    ] = useState<SupportedTraditionalOIDCAppTechnologyTypes>(undefined);
    const [ appList, setAppList ] = useState<ApplicationListInterface>(undefined);

    useEffect(() => {
        getApplicationList(null, null, null)
            .then((response) => {
                setAppList(response);

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.fetchApplications.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.fetchApplications.genericError.message")
                }));
            });
    }, []);

    useEffect(() => {
        if (appList === undefined) {
            return;
        }
        if (appList?.applications?.length > 1) {
            setSelectedIntegration(QuickStartModes.INTEGRATE);
            return;
        }
        setSelectedIntegration(QuickStartModes.SAMPLES);
    }, [appList]);
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
                        onApplicationUpdate={ onApplicationUpdate }
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
    };

    const resolveTechnologyLogo = (technology: SupportedTraditionalOIDCAppTechnologyTypes) => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
            return JavaLogo;
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return getTechnologyLogos().dotNet;
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
                                <TechnologySelection<SupportedTraditionalOIDCAppTechnologyTypes>
                                    technologies={ [
                                        {
                                            displayName: SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE,
                                            logo: JavaLogo,
                                            type: SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE
                                        },
                                        {
                                            displayName: SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET,
                                            logo: DotNetLogo,
                                            type: SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET,
                                            disabled: true
                                        }
                                    ] }
                                    onSelectedTechnologyChange={
                                        (technology: SupportedTraditionalOIDCAppTechnologyTypes) =>
                                            setSelectedTechnology(technology)
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
TraditionalOIDCWebApplicationQuickStart.defaultProps = {
    "data-testid": "traditional-oidc-web-app-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TraditionalOIDCWebApplicationQuickStart;
