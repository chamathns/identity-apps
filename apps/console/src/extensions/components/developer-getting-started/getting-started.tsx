/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { 
    GenericIcon, 
    Heading, 
    LinkButton, 
    PageLayout, 
    Text
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Card, Divider, Grid, Icon } from "semantic-ui-react";
import ApplicationSelectionModal from "./application-selection-modal";
import { AppConstants, history } from "../../../features/core";
import { ReactComponent as SupportHeadsetIcon } from "../../assets/images/icons/support-headset-icon.svg";
import MFAIllustration from "../../assets/images/illustrations/mfa-illustration.svg";
import RegisterApplicationIllustration from "../../assets/images/illustrations/register-application-illustration.svg";
import SocialLoginIllustration from "../../assets/images/illustrations/social-login-illustration.svg";

/**
 * Proptypes for the developer getting started page component.
 */
type DeveloperGettingStartedPageInterface = TestableComponentInterface;

/**
 * Developer view Getting started page.
 *
 * @param {DeveloperGettingStartedPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const DeveloperGettingStartedPage: FunctionComponent<DeveloperGettingStartedPageInterface> = (
    props: DeveloperGettingStartedPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    return (
        <PageLayout contentTopMargin={ false } data-testid={ testId }>
            <div className="developer-portal page getting-started-page">
                <div className="getting-started-section">
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column>
                                <Heading as="h1">Getting Started</Heading>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column
                                className="stackable"
                                largeScreen={ 16 }
                                widescreen={ 16 }
                                computer={ 16 }
                                tablet={ 16 }
                                mobile={ 16 }
                            >
                                <Card
                                    fluid
                                    className="basic-card no-hover section-card auth-demo-card"
                                    style={ {
                                        backgroundImage: `url(${ RegisterApplicationIllustration })`
                                    } }
                                >
                                    <Card.Content>
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column computer={ 8 } tablet={ 8 } mobile={ 16 }>
                                                    <Heading as="h3">Onboard an Application</Heading>
                                                    <Text muted>
                                                        Use our sample apps to get familiar with Asgardeo or
                                                        use an SDK to integrate Asgardeo with your own application.
                                                    </Text>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Card.Content>
                                    <Card.Content className="action-container" extra>
                                        <LinkButton
                                            data-testid="develop-getting-started-page-register-application-button"
                                            className="quick-start-action"
                                            onClick={
                                                () => history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"))
                                            }
                                            compact
                                        >
                                            <span className="quick-start-action-text">
                                                Register Application
                                            </span>
                                            <Icon className="ml-1" name="caret right"/>
                                        </LinkButton>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>

                <Divider hidden/>

                <div className="mfa-section">
                    <Grid>
                        <Grid.Row stretched>
                            <Grid.Column computer={ 8 } tablet={ 16 } mobile={ 16 }>
                                <Card
                                    fluid
                                    className="basic-card no-hover section-card mfa-card mb-5"
                                    style={ {
                                        backgroundImage: `url(${ MFAIllustration })`
                                    } }
                                >
                                    <Card.Content>
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column
                                                    largeScreen={ 14 }
                                                    computer={ 14 }
                                                    tablet={ 15 }
                                                    mobile={ 15 }
                                                >
                                                    <Heading as="h3">Add Stronger Authentication</Heading>
                                                    <Text muted>
                                                        Protect your application and its users by adding
                                                        multi-factor authentication with Asgardeo.
                                                    </Text>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Card.Content>
                                    <Card.Content className="action-container" extra>
                                        <LinkButton
                                            data-testid="develop-getting-started-page-setup-mfa-button"
                                            className="quick-start-action" 
                                            onClick={
                                                () => setShowApplicationModal(true)
                                            }
                                            compact
                                        >
                                            <span className="quick-start-action-text">
                                                Set Up Multi-Factor Authentication
                                            </span>
                                            <Icon className="ml-1" name="caret right"/>
                                        </LinkButton>
                                    </Card.Content>
                                </Card>
                                {
                                    showApplicationModal && (
                                        <ApplicationSelectionModal
                                            data-testid={ testId }
                                            open={ showApplicationModal }
                                            onClose={ () => setShowApplicationModal(false) }
                                        />
                                    )
                                }
                            </Grid.Column>
                            <Grid.Column computer={ 8 } tablet={ 16 } mobile={ 16 }>
                                <Card
                                    fluid
                                    className="basic-card no-hover section-card social-login-card mb-5"
                                    style={ {
                                        backgroundImage: `url(${ SocialLoginIllustration })`
                                    } }
                                >
                                    <Card.Content>
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column
                                                    largeScreen={ 14 }
                                                    computer={ 14 }
                                                    tablet={ 15 }
                                                    mobile={ 15 }
                                                >
                                                    <Heading as="h3">Add Social Login</Heading>
                                                    <Text muted>
                                                        Let your users log in to your application with an
                                                        identity provider of their choice.
                                                    </Text>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Card.Content>
                                    <Card.Content className="action-container" extra>
                                        <LinkButton
                                            data-testid="develop-getting-started-page-setup-social-connections-button"
                                            className="quick-start-action"
                                            onClick={
                                                () => history.push(AppConstants.getPaths().get("IDP"))
                                            }
                                            compact
                                        >
                                            <span className="quick-start-action-text">
                                                Set Up Social Connections
                                            </span>
                                            <Icon className="ml-1" name="caret right"/>
                                        </LinkButton>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>

                <Divider hidden />

            </div>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
DeveloperGettingStartedPage.defaultProps = {
    "data-testid": "developer-quick-start-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default DeveloperGettingStartedPage;
