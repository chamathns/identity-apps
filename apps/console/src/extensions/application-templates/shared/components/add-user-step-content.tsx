/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, PrimaryButton, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { Divider, Icon, List } from "semantic-ui-react";
import { AppConstants } from "../../../../features/core/constants";
import { FeatureConfigInterface } from "../../../../features/core/models";
import { AppState } from "../../../../features/core/store";
import { getUserDetails } from "../../../../features/users/api";
import { AddConsumerUserWizard } from "../../../components/consumer-users/wizard";
import { UsersConstants } from "../../../components/users/constants";

/**
 * Proptypes for add user step component in application sample flow.
 */
type AddUserStepContentPropsInterface = TestableComponentInterface;

/**
 * Component to add a user during application sample flow.
 *
 * @param {AddUserStepContentPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const AddUserStepContent: FunctionComponent<AddUserStepContentPropsInterface> = (
    props: AddUserStepContentPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ addedUserList, setAddedUserList ] = useState<string[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const addNewUser = (id: string) => {
        setIsLoading(true);
        getUserDetails(id, null)
            .then((response) => {
                if (response.emails && Array.isArray(response.emails) && response.emails.length > 0) {
                    const users = addedUserList;
                    users.push(response.emails[ 0 ] as string);
                    setAddedUserList(users);
                }
            })
            .catch(() => {
                // TODO add to notifications
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div data-testid={ testId }>
            <Text compact>
                You will need a consumer user account to login to the sample application.
            </Text>
            {
                hasRequiredScopes(featureConfig?.users,
                    featureConfig?.users?.scopes?.create,
                    allowedScopes)
                    ? (
                        <>
                            <Text compact>
                                Click the button below to add a user account if you do not already have one.{ " " }
                                Alternatively, you can manually add a user by navigating to{ " " }<a
                                onClick={ () => {
                                    window.open(AppConstants.getClientOrigin()
                                        + UsersConstants.getPaths().get("USERS_PATH"),
                                        "",
                                        "noopener");
                                } }
                                className="external-link link pointing primary"
                            >user management. <Icon name="external"/></a>
                            </Text>
                            <PrimaryButton
                                className="mt-3"
                                onClick={ () => setShowWizard(true) }
                            >
                                Add User
                            </PrimaryButton>
                            <List>
                                {
                                    isLoading ? (
                                            <ContentLoader/>
                                        ) :
                                        addedUserList?.map((user, index) => {
                                            return (
                                                <List.Item key={ index }>
                                                    <div>
                                                        <Icon
                                                            className={ "mr-1" }
                                                            name={ "check" }
                                                            color={ "green" }
                                                        />User <strong>{ user }</strong> added successfully.
                                                    </div>
                                                </List.Item>
                                            );
                                        })
                                }
                            </List>
                        </>
                    )
                    : (
                        <Text compact>
                            If you do not already have an account, contact your tenant administrator.
                        </Text>
                    )
            }
            {
                showWizard && (
                    <AddConsumerUserWizard
                        data-testid="user-mgt-add-user-wizard-modal"
                        closeWizard={ () => setShowWizard(false) }
                        onSuccessfulUserAddition={ (id: string) => addNewUser(id) }
                        emailVerificationEnabled={ false }
                        requiredSteps={ [ "BasicDetails" ] }
                        submitStep={ "BasicDetails" }
                        hiddenFields={ [ "firstName", "lastName" ] }
                        showStepper={ false }
                        requestedPasswordOption="createPw"
                        title="Add User"
                        description="Follow the steps to add a new user"
                    />
                )
            }
        </div>
    );
};

/**
 * Default props for the component.
 */
AddUserStepContent.defaultProps = {
    "data-testid": "add-user-step-content"
};
