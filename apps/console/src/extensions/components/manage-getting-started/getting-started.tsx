/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, LinkButton, PageLayout, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Divider, Grid, Icon } from "semantic-ui-react";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../../features/core";
import { ReactComponent as SupportHeadsetIcon } from "../../assets/images/icons/support-headset-icon.svg";
import BusinessUsersIllustration from "../../assets/images/illustrations/business-users-illustration.svg";
import UserAttributesIllustration from "../../assets/images/illustrations/user-attributes-illustration.svg";
import { CreateGroupWizard } from "../groups/wizard";
import { UserAccountTypes } from "../users";
import { UsersConstants } from "../users/constants";
import { AddUserWizard, WizardStepsFormTypes } from "../users/wizard";

/**
 * Proptypes for the developer getting started page component.
 */
type ManageGettingStartedPageInterface = TestableComponentInterface;

/**
 * Manage view Getting started page.
 *
 * @param {ManageGettingStartedPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const ManageGettingStartedPage: FunctionComponent<ManageGettingStartedPageInterface> = (
    props: ManageGettingStartedPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const [ showUserWizard, setUserShowWizard ] = useState<boolean>(false);
    const [ showGroupWizard, setShowGroupWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

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
                        { hasRequiredScopes(featureConfig?.users,
                            featureConfig?.users?.scopes?.create, allowedScopes) &&
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
                                        style={ {
                                            backgroundImage: `url(${ BusinessUsersIllustration })`
                                        } }
                                        className="basic-card no-hover section-card auth-demo-card"
                                    >
                                        <Card.Content>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column computer={ 8 } tablet={ 8 } mobile={ 16 }>
                                                        <Heading as="h3">Manage Users</Heading>
                                                        <Text muted>
                                                            { "Create users that consume your applications and " +
                                                            "manage their profiles." }
                                                        </Text>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Card.Content>
                                        <Card.Content className="action-container" extra>
                                            <LinkButton
                                                data-testid="manage-getting-started-page-create-user-button"
                                                className="quick-start-action"
                                                onClick={
                                                    () => setUserShowWizard(true)
                                                }
                                                compact
                                            >
                                                <span className="quick-start-action-text">
                                                    Create User
                                                </span>
                                                <Icon className="ml-1" name="caret right"/>
                                            </LinkButton>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            </Grid.Row>
                        }
                        { hasRequiredScopes(featureConfig?.groups,
                            featureConfig?.groups?.scopes?.create, allowedScopes) && <Grid.Row>
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
                                        style={ {
                                            backgroundImage: `url(${ UserAttributesIllustration })`
                                        } }
                                        className="basic-card no-hover section-card business-users-card"
                                    >
                                        <Card.Content>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column computer={ 8 } tablet={ 8 } mobile={ 16 }>
                                                        { hasRequiredScopes(featureConfig?.groups,
                                                            featureConfig?.groups?.scopes?.create, allowedScopes) ?
                                                            <Heading as="h3">Manage Groups</Heading> :
                                                            <Heading as="h3">View Groups</Heading>
                                                        }
                                                        <Text muted>
                                                            { "Group users that consume your applications and " +
                                                                "collectively manage their user access." }
                                                        </Text>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Card.Content>
                                        <Card.Content className="action-container" extra>
                                            <LinkButton
                                                data-testid="manage-getting-started-page-create-group-button"
                                                className="quick-start-action"
                                                onClick={ () => {
                                                    hasRequiredScopes(featureConfig?.groups,
                                                        featureConfig?.groups?.scopes?.create, allowedScopes) ?
                                                        setShowGroupWizard(true) :
                                                        history.push(AppConstants.getPaths().get("GROUPS"));
                                                }
                                                }
                                                compact
                                            >
                                                <span className="quick-start-action-text">
                                                    { hasRequiredScopes(featureConfig?.groups,
                                                        featureConfig?.groups?.scopes?.create, allowedScopes) ?
                                                        "Create Group" :
                                                        "View Group"
                                                    }
                                                </span>
                                                <Icon className="ml-1" name="caret right" />
                                            </LinkButton>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            </Grid.Row>
                        }
                    </Grid>
                </div>

                <Divider hidden/>

            </div>
            {
                showUserWizard && (
                    <AddUserWizard
                        data-testid="user-mgt-add-user-wizard-modal"
                        closeWizard={ () => {
                            setUserShowWizard(false);
                        } }
                        emailVerificationEnabled={ true }
                        onSuccessfulUserAddition={ (id: string) => {
                            setListUpdated(true);
                            history.push(UsersConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH")
                                .replace(":id", id));
                        } }
                        submitStep={ WizardStepsFormTypes.GROUP_LIST }
                        requiredSteps={ [
                            WizardStepsFormTypes.BASIC_DETAILS,
                            WizardStepsFormTypes.GROUP_LIST
                        ] }
                        defaultUserTypeSelection={ UserAccountTypes.CUSTOMER }
                        conditionallyShowStepper={ true }
                    />
                )
            }
            {
                showGroupWizard && (
                    <CreateGroupWizard
                        data-testid="group-mgt-create-group-wizard"
                        closeWizard={ () => setShowGroupWizard(false) }
                        updateList={ () => setListUpdated(true) }
                        requiredSteps={ [ "BasicDetails" ] }
                        submitStep={ "BasicDetails" }
                    />
                )
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ManageGettingStartedPage.defaultProps = {
    "data-testid": "developer-quick-start-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ManageGettingStartedPage;
