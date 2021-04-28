/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { EditAvatarModal, Heading, UserAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Label } from "semantic-ui-react";

interface AddConsumerUserWizardSummaryProps {
    summary: any;
    triggerSubmit: boolean;
    onSubmit: (application: any) => void;
    /**
     * Callback fired when profile image is changed.
     * @param {string} url - New URL.
     */
    onProfileImageChange: (url: string) => void;
}

/**
 * Add consumer user wizard summary page.
 *
 * @param props
 */
export const AddConsumerUserWizardSummary: FunctionComponent<AddConsumerUserWizardSummaryProps> = (
    props: AddConsumerUserWizardSummaryProps
): ReactElement => {

    const {
        summary,
        triggerSubmit,
        onSubmit,
        onProfileImageChange
    } = props;

    const { t } = useTranslation();

    const [ modifiedSummary, setModifiedSummary ] = useState<any>(summary);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        onSubmit(modifiedSummary);
    }, [ triggerSubmit ]);

    /**
     * Handles edit avatar modal submit action.
     *
     * @param {<HTMLButtonElement>} e - Event.
     * @param {string} url - Selected image URL.
     */
    const handleAvatarEditModalSubmit = (e: MouseEvent<HTMLButtonElement>, url: string): void => {
        setModifiedSummary({
            ...modifiedSummary,
            profileUrl: url
        });

        onProfileImageChange(url);
        setShowEditAvatarModal(false);
    };

    return (
        <Grid className="wizard-summary">
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <UserAvatar
                            editable
                            name={ modifiedSummary?.firstName ? modifiedSummary?.firstName : modifiedSummary?.email }
                            image={ modifiedSummary?.profileUrl }
                            onEditIconClick={ () => setShowEditAvatarModal(true) }
                            onClick={ () => setShowEditAvatarModal(true) }
                            size="tiny"
                        />
                        { modifiedSummary?.firstName && (
                            <Heading size="small" className="name">{ modifiedSummary.firstName }</Heading>
                        ) }
                        { modifiedSummary?.email && (
                            <div className="description">{ modifiedSummary.email }</div>
                        ) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            { modifiedSummary?.firstName && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">
                            { t("console:manage.features.user.modals.addUserWizard.wizardSummary.name") }
                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ modifiedSummary.firstName + " " + modifiedSummary.lastName }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            {
                modifiedSummary?.groups &&
                modifiedSummary.groups instanceof Array &&
                modifiedSummary.groups.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div className="label">
                                    { t("console:manage.features.user.modals.addUserWizard.wizardSummary.groups") }
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        modifiedSummary.groups
                                            .map((group, index) => (
                                                <Label
                                                    key={ index }
                                                    basic
                                                    circular
                                                >
                                                    {
                                                        group?.displayName?.split("/").length > 1
                                                            ? group.displayName.split("/")[1]
                                                            : group.displayName
                                                    }
                                                </Label>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
            { modifiedSummary?.userName && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">
                            { t("console:manage.features.user.modals.addUserWizard.wizardSummary.username") }
                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ modifiedSummary.userName }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            { modifiedSummary?.email && modifiedSummary?.passwordOption && modifiedSummary?.passwordOption === "askPw"
                ? (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                {
                                    t("console:manage.features.user.modals.addUserWizard.wizardSummary.passwordOption" +
                                        ".label")
                                }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">
                                {
                                    t("console:manage.features.user.modals.addUserWizard.wizardSummary.passwordOption" +
                                        ".message.0",
                                        { email: modifiedSummary.email })
                                }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
                : (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                {
                                    t("console:manage.features.user.modals.addUserWizard.wizardSummary.passwordOption" +
                                        ".label")
                                }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">
                                { t("console:manage.features.user.modals.addUserWizard.wizardSummary" +
                                    ".passwordOption.message.1") }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }

            {
                showEditAvatarModal && (
                    <EditAvatarModal
                        open={ showEditAvatarModal }
                        closeOnDimmerClick={ false }
                        name={ modifiedSummary?.firstName }
                        emails={ [ modifiedSummary?.email ] }
                        onClose={ () => setShowEditAvatarModal(false) }
                        onCancel={ () => setShowEditAvatarModal(false) }
                        onSubmit={ handleAvatarEditModalSubmit }
                        heading={ t("console:common.modals.editAvatarModal.heading") }
                        submitButtonText={ t("console:common.modals.editAvatarModal.primaryButton") }
                        cancelButtonText={ t("console:common.modals.editAvatarModal.secondaryButton") }
                        translations={ {
                            gravatar: {
                                errors: {
                                    noAssociation: {
                                        content: t("console:common.modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.content"),
                                        header: t("console:common.modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.header")
                                    }
                                },
                                heading: t("console:common.modals.editAvatarModal.content.gravatar.heading")
                            },
                            hostedAvatar: {
                                heading: t("console:common.modals.editAvatarModal.content.hostedAvatar.heading"),
                                input: {
                                    errors: {
                                        http: {
                                            content: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.content"),
                                            header: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.header")
                                        },
                                        invalid: {
                                            content: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.content"),
                                            pointing: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.pointing")
                                        }
                                    },
                                    hint: t("console:common.modals.editAvatarModal.content.hostedAvatar.input.hint"),
                                    placeholder: t("console:common.modals.editAvatarModal.content." +
                                        "hostedAvatar.input.placeholder"),
                                    warnings: {
                                        dataURL: {
                                            content: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.content"),
                                            header: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.header")
                                        }
                                    }
                                }
                            },
                            systemGenAvatars: {
                                heading: t("console:common.modals.editAvatarModal.content.systemGenAvatars.heading"),
                                types: {
                                    initials: t("console:common.modals.editAvatarModal.content.systemGenAvatars." +
                                        "types.initials")
                                }
                            }
                        } }
                    />
                )
            }
        </Grid>
    );
};
