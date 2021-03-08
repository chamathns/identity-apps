/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, GenericIconProps, Heading, PageHeader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Card, Grid, Radio } from "semantic-ui-react";
import {
    ApplicationInterface,
    ApplicationListInterface,
    getApplicationList,
    InboundProtocolListItemInterface
    } from "../../../../features/applications";
import { QuickStartModes } from "../models";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { useTranslation } from "react-i18next";

/**
 * Proptypes for the applications help panel overview component.
 */
interface QuickStartPanelOverviewPropsInterface extends TestableComponentInterface {
    inboundProtocols?: InboundProtocolListItemInterface[];
    application?: ApplicationInterface;
    applicationType: string;
    handleIntegrateSelection?: (selection: string) => void;
    onBackButtonClick?: () => void;
    technology: string;
    technologyLogo: GenericIconProps["icon"];
}

/**
 * Quick start pane overview Component.
 * TODO: Add localization support. (https://github.com/wso2-enterprise/asgardeo-product/issues/209)
 *
 * @param {QuickStartPanelOverviewPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const QuickStartPanelOverview: FunctionComponent<QuickStartPanelOverviewPropsInterface> = (
    props: QuickStartPanelOverviewPropsInterface
): ReactElement => {

    const {
        applicationType,
        handleIntegrateSelection,
        onBackButtonClick,
        technology,
        technologyLogo
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ appList, setAppList ] = useState<ApplicationListInterface>(undefined);

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(undefined);

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
        /**
         * TODO: QuickStartModes.SAMPLES should be selected if there are no applications with the current
         * 'applicationType'. Use the template ID of the applications in the appList and set selectedIntegration
         * accordingly.
         */
        if (appList?.applications?.length > 1) {
            setSelectedIntegration(QuickStartModes.INTEGRATE);
            return;
        }
        setSelectedIntegration(QuickStartModes.SAMPLES);
    }, [appList]);

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <PageHeader
                            image={ (
                                <GenericIcon
                                    inline
                                    transparent
                                    className="display-flex"
                                    icon={ technologyLogo }
                                    size="mini"
                                />
                            ) }
                            className="mb-2"
                            title={ technology }
                            backButton={ {
                                onClick: () => onBackButtonClick(),
                                text: "Go back to selection"
                            } }
                            imageSpaced={ false }
                            bottomMargin={ false }
                        />
                        <Heading subHeading as="h6">
                            Select one of the following paths to get started.
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                {
                    applicationType
                        ? (
                            <>
                                <Grid.Row stretched>
                                    <Grid.Column width={ 8 }>
                                        <Card
                                            fluid
                                            className={
                                                `selection-card radio-selection-card ${
                                                    selectedIntegration === QuickStartModes.INTEGRATE
                                                        ? "card-selected"
                                                        : ""
                                                    }`
                                            }
                                            data-testid="integration-mode-selection-card"
                                        >
                                            <Card.Content
                                                onClick={ () => {
                                                    setSelectedIntegration(QuickStartModes.INTEGRATE);
                                                    handleIntegrateSelection(QuickStartModes.INTEGRATE);
                                                } }
                                                className="selection-card-content"
                                                data-testid="integration-mode-selection-card-content"
                                            >
                                                <div className="integrate-radio">
                                                    <Radio
                                                        checked={ selectedIntegration === QuickStartModes.INTEGRATE }
                                                        data-testid="integration-mode-selection-card-radio"
                                                    />
                                                </div>
                                                <div className="card-content">
                                                    <Card.Header
                                                        data-testid="integration-mode-selection-card-header"
                                                    >
                                                        <span>Integrate</span> your application
                                                    </Card.Header>
                                                    <Card.Meta>
                                                        <span>
                                                            Follow the steps below to integrate your own application
                                                        </span>
                                                    </Card.Meta>
                                                </div>
                                            </Card.Content>
                                        </Card>
                                    </Grid.Column>
                                    <Grid.Column width={ 8 }>
                                        <Card
                                            fluid
                                            className={
                                                `selection-card radio-selection-card ${
                                                    selectedIntegration === QuickStartModes.SAMPLES
                                                        ? "card-selected"
                                                        : ""
                                                    }`
                                            }
                                            data-testid="try-out-mode-selection-card"
                                        >
                                            <Card.Content
                                                onClick={ () => {
                                                    setSelectedIntegration(QuickStartModes.SAMPLES);
                                                    handleIntegrateSelection(QuickStartModes.SAMPLES);
                                                } }
                                                className="selection-card-content"
                                                data-testid="try-out-mode-selection-card-content"
                                            >
                                                <div className="integrate-radio">
                                                    <Radio
                                                        checked={ selectedIntegration === QuickStartModes.SAMPLES }
                                                        data-testid="try-out-mode-selection-card-radio"
                                                    />
                                                </div>
                                                <div className="card-content">
                                                    <Card.Header
                                                        data-testid="try-out-mode-selection-card-header"
                                                    >
                                                        <span>Try out </span>a sample
                                                    </Card.Header>
                                                    <Card.Meta>
                                                        <span>
                                                            Use our preconfigured samples to try out the
                                                            authentication flow
                                                        </span>
                                                    </Card.Meta>
                                                </div>
                                            </Card.Content>
                                        </Card>
                                    </Grid.Column>
                                </Grid.Row>
                            </>
                        )
                        : null
                }
            </Grid>
        </>
    );
};
