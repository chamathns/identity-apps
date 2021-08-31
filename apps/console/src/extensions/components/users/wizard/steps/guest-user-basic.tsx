/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getRolesList } from "@wso2is/core/api";
import { RolesInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import kebabCase from "lodash-es/kebabCase";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { UserInviteInterface } from "../../models";
import { SharedUserStoreConstants, SharedUserStoreUtils } from "../../../../../features/core";
import { CONSUMER_USERSTORE } from "../../../../../features/userstores";
import { EventPublisher } from "../../../../../features/core/utils";

/**
 * Proptypes for the add guest user basic component.
 */
interface AddGuestUserBasicProps {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * Add guest user basic component.
 *
 * @return {ReactElement}
 */
export const AddGuestUserBasic: React.FunctionComponent<AddGuestUserBasicProps> = (
    props: AddGuestUserBasicProps): ReactElement => {

    const {
        triggerSubmit,
        onSubmit
    } = props;

    const [ userRoleOptions, setUserRoleList ] = useState([]);
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);
    const { t } = useTranslation();

    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);

    // Username input validation error messages.
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("console:manage.features.users.guestUsers.fields." +
        "username.validations.regExViolation");

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        const roleOptions = [];
        let roleOption =
            {
                key: null,
                text: "",
                value: ""
            };
        if (userRoleOptions.length === 0) {
            setUserListRequestLoading(true);
            getRolesList(null)
                .then((response) => {
                    response.data.Resources.map((role: RolesInterface, index) => {
                        if (role.displayName !== "system" &&
                            role.displayName !== "everyone" &&
                            role.displayName !== "selfsignup" &&
                            (role.displayName?.split("/")?.length < 2 &&
                            role.displayName?.split("/")[0] !== "Application")
                        ) {
                            roleOption = {
                                key: index,
                                text: role.displayName,
                                value: role.displayName
                            };
                            roleOptions.push(roleOption);
                        }
                    });
                    setUserRoleList(roleOptions);
                })
                .finally(() => {
                    setUserListRequestLoading(false);
                });
        }
        setUserRoleList(roleOptions);

    }, []);

    /**
     * The following function validates user name against the user store regEx.
     */
    const validateUserNamePattern = async (): Promise<string> => {
        let userStoreRegEx = "";
        await SharedUserStoreUtils.getUserStoreRegEx(CONSUMER_USERSTORE,
            SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.UsernameRegEx)
            .then((response) => {
                setRegExLoading(true);
                userStoreRegEx = response;
            });

        setRegExLoading(false);
        return new Promise((resolve, reject) => {
            if (userStoreRegEx !== "") {
                resolve(userStoreRegEx);
            } else {
                reject("");
            }
        });
    };

    const getFormValues = (values: Map<string, FormValue>): void => {
        eventPublisher.publish("manage-users-collaborator-role", {
            "type": kebabCase(values.get("role").toString())
        });

        const inviteUser: UserInviteInterface = {
            roles: [ values.get("role").toString() ],
            email: values.get("email").toString()
        };

        if (triggerSubmit) {
            onSubmit(inviteUser);
        }
    };
    /**
     * The modal to add new user.
     */
    const inviteUserForm = () => (
        <Forms
            data-testid="user-mgt-add-user-form"
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field
                            data-testid="usermgt-add-guest-user-form-email-input"
                            label={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.email.label"
                            ) }
                            name="email"
                            placeholder={ t(
                                "console:manage.features.user.forms.addUserForm.inputs." +
                                "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.email.validations.empty"
                            ) }
                            validation={ (value: string, validation: Validation) => {
                                // Check whether username is a valid email.
                                // check username validity against userstore regex
                                if (value && (!FormValidation.email(value) || !SharedUserStoreUtils
                                    .validateInputAgainstRegEx(value, window["AppUtils"].getConfig().extensions
                                        .collaboratorUsernameRegex))) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                }
                            }
                            }
                            type="email"
                            tabIndex={ 5 }
                            maxLength={ 50 }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field
                            data-testid="usermgt-add-guest-user-form-role-dropdown"
                            type="dropdown"
                            label={ "Role" }
                            name="role"
                            children={ userRoleOptions }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.domain.validations.empty"
                            ) }
                            required={ true }
                            value={ userRoleOptions[0]?.value }
                            // listen={ handleUserStoreChange }
                            tabIndex={ 1 }
                        />
                        <Hint>
                            { "Select a role to assign to the user. The access level depends on role permissions." }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Divider hidden/>
            </Grid>
        </Forms>
    );

    return (
        <>
            { !isUserListRequestLoading && inviteUserForm() }
        </>
    );
};
