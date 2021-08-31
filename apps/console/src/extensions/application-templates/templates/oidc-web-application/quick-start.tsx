/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useLayoutEffect, useState } from "react";
import { Divider, Grid } from "semantic-ui-react";
import { IntegrateSDKs } from "./integrate-sdks";
import { SupportedTraditionalOIDCAppTechnologyTypes } from "./models";
import { TryoutSamples } from "./tryout-samples";
import {
    ApplicationInterface,
    ApplicationListInterface,
    ApplicationTemplateInterface,
    URLFragmentTypes
} from "../../../../features/applications/models";
import { history } from "../../../../features/core";
import { getTechnologyLogos } from "../../../../features/core/configs";
import DotNetLogo from "../../../assets/images/icons/dotnet-logo.svg";
import JavaLogo from "../../../assets/images/icons/java-logo.svg";
import { QuickStartModes } from "../../shared";
import { QuickStartPanelOverview, TechnologySelection } from "../../shared/components";
import { getApplicationList } from "../../../../features/applications/api";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { Trans, useTranslation } from "react-i18next";
import { AppState } from "../../../../features/core/store";
import { Heading } from "@wso2is/react-components";
import { EventPublisher } from "../../../../features/core/utils";

/**
 * Prop types of the component.
 */
interface TraditionalOIDCWebApplicationQuickStartPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
    onApplicationUpdate: () => void;
    onTriggerTabUpdate: (tabIndex: number) => void;
    defaultTabIndex: number;
}

const INFO_TAB_INDEX: number = 6;
const QUICK_START_TAB_INDEX: number = 0;

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
        defaultTabIndex,
        inboundProtocolConfig,
        onApplicationUpdate,
        onTriggerTabUpdate,
        template,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(undefined);
    const [
        selectedTechnology,
        setSelectedTechnology
    ] = useState<SupportedTraditionalOIDCAppTechnologyTypes>(undefined);
    const [ appList, setAppList ] = useState<ApplicationListInterface>(undefined);
    const isHelpPanelVisible: boolean = useSelector((state: AppState) => state.helpPanel.visibility);
    const [ addedCallBackUrls, setAddedCallBackUrls ] = useState<string[]>([]);
    const [ addedOrigins, setAddedOrigins ] = useState<string[]>([]);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Update the application only if any new callback urls are added.
     */
    useLayoutEffect(() => {
        return () => {
            if (addedCallBackUrls?.length > 0) {
                onApplicationUpdate();
            }
        }
    }, [])

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
                        message: t("console:develop.features.applications.notifications.fetchApplications." +
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.fetchApplications." +
                        "genericError.message")
                }));
            });
    }, []);

    useEffect(() => {
        if (appList === undefined) {
            return;
        }

        if(!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            if (appList?.applications?.length > 1) {
                setSelectedIntegration(QuickStartModes.INTEGRATE);
                return;
            }
            setSelectedIntegration(QuickStartModes.SAMPLES);
        }
    }, [appList]);

    const handleIntegrateSelection = (selection: QuickStartModes): void => {
        setSelectedIntegration(selection);
    };

    /**
     * Called when the URL fragment updates
     */
    useEffect(()=> {

        if(!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            return;
        }

        const technologyType: string = (window.location.hash).split("&" + URLFragmentTypes.VIEW)[1].
        split("_")[1];

        if (SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE.toLowerCase() == unescape(technologyType)) {
            setSelectedTechnology(SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE);
        } else if (SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET.toLowerCase() == technologyType) {
            setSelectedTechnology(SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET);
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
                        addedCallBackUrls={ addedCallBackUrls }
                        addedOrigins={ addedOrigins }
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
                        addedCallBackUrls={ addedCallBackUrls }
                        addedOrigins={ addedOrigins }
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
                !(selectedTechnology || (window.location.hash).includes(URLFragmentTypes.VIEW))
                    ? (
                        <Grid.Row className="technology-selection-wrapper" textAlign="center">
                            <Grid.Column width={ 16 }>
                                <TechnologySelection<SupportedTraditionalOIDCAppTechnologyTypes>
                                    technologies={ [
                                        {
                                            "data-componentid": "java-ee",
                                            displayName: SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE,
                                            logo: JavaLogo,
                                            type: SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE
                                        },
                                        {
                                            "data-componentid": "dot-net",
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
                                <Grid.Row className="custom-configuration">
                                    <div data-testid={ testId } >
                                        <Divider hidden/>
                                        <Divider horizontal >
                                            <Heading as="h5" color={ "grey" } >OR</Heading>
                                        </Divider>
                                        <Heading as="h5" className="mb-1" compact >
                                            <Trans i18nKey="extensions:console.application.quickStart.
                                            technologySelectionWrapper.subHeading">
                                                You can find the server endpoint details in the
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
                                <Grid.Column width={ isHelpPanelVisible ? 16 : 13 }>
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
TraditionalOIDCWebApplicationQuickStart.defaultProps = {
    "data-testid": "traditional-oidc-web-app-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TraditionalOIDCWebApplicationQuickStart;
