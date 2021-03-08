/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getUserStoreList } from "@wso2is/core/api";
import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, useTrigger } from "@wso2is/forms";
import { EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { UserStoreListItem } from "../../../../../../features/userstores";
import { updateAClaim } from "../../../../../../features/claims/api";

/**
 * Prop types of `EditMappedAttributesLocalClaims` component
 */
interface EditMappedAttributesLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * Claim to be edited
     */
    claim: Claim;
    /**
     * Called to initiate an update
     */
    update: () => void;
}

/**
 * This component renders the Mapped Attribute pane of
 * the edit local claim screen
 *
 * @param {EditMappedAttributesLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditMappedAttributesLocalClaims: FunctionComponent<EditMappedAttributesLocalClaimsPropsInterface> = (
    props: EditMappedAttributesLocalClaimsPropsInterface
): ReactElement => {

    const {
        claim,
        update,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ userStore, setUserStore ] = useState([]);

    const [ submit, setSubmit ] = useTrigger();

    const { t } = useTranslation();

    useEffect(() => {
        const userstore = [];

        userstore.push({
            id: "PRIMARY",
            name: "PRIMARY"
        });

        getUserStoreList().then((response) => {
            userstore.push(...response.data);
            setUserStore(userstore);
        }).catch(() => {
            setUserStore(userstore);
        });
    }, []);

    return (
        <EmphasizedSegment padded="very">
            <Grid data-testid={ testId }>
                <Grid.Row columns={ 1 }>
                    <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                        <p>
                            { t("console:manage.features.claims.local.mappedAttributes.hint") }
                        </p>
                        <Divider hidden />
                        <Forms
                            submitState={ submit }
                            onSubmit={ (values: Map<string, FormValue>) => {
                                const claimData = { ...claim };
                                delete claimData.id;
                                delete claimData.dialectURI;

                                const submitData = {
                                    ...claimData,
                                    attributeMapping: Array.from(values).map(([ userstore, attribute ]) => {
                                        return {
                                            mappedAttribute: attribute.toString(),
                                            userstore: userstore.toString()
                                        };
                                    })
                                };
                                updateAClaim(claim.id, submitData).then(() => {
                                    dispatch(addAlert(
                                        {
                                            description: t("console:manage.features.claims.local.notifications." +
                                                "updateClaim.success.description"),
                                            level: AlertLevels.SUCCESS,
                                            message: t("console:manage.features.claims.local.notifications." +
                                                "updateClaim.success.message")
                                        }
                                    ));
                                    update();
                                }).catch(error => {
                                    dispatch(addAlert(
                                        {
                                            description: error?.description
                                                || t("console:manage.features.claims.local.notifications." +
                                                    "updateClaim.genericError.description"),
                                            level: AlertLevels.ERROR,
                                            message: error?.message
                                                || t("console:manage.features.claims.local.notifications." +
                                                    "updateClaim.genericError.message")
                                        }
                                    ));
                                });
                            } }
                        >
                            <Grid>
                                { userStore.map((store: UserStoreListItem, index: number) => {
                                    return (
                                        <Grid.Row columns={ 2 } key={ index }>
                                            <Grid.Column width={ 4 }>
                                                { store.name }
                                            </Grid.Column>
                                            <Grid.Column width={ 12 }>
                                                <Field
                                                    type="text"
                                                    name={ store.name }
                                                    placeholder={ t("console:manage.features.claims.local.forms." +
                                                        "attribute.placeholder") }
                                                    required={ true }
                                                    requiredErrorMessage={
                                                        t("console:manage.features.claims.local.forms." +
                                                        "attribute.requiredErrorMessage")
                                                    }
                                                    value={ claim?.attributeMapping?.find((attribute) => {
                                                        return attribute.userstore
                                                            .toLowerCase() === store.name.toLowerCase();
                                                    })?.mappedAttribute }
                                                    data-testid={ `${ testId }-form-store-name-input` }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    );
                                }) }
                            </Grid>
                        </Forms>

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        <PrimaryButton
                            onClick={ () => {
                                setSubmit();
                            } }
                            data-testid={ `${ testId }-form-submit-button` }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
EditMappedAttributesLocalClaims.defaultProps = {
    "data-testid": "edit-local-claims-mapped-attributes"
};
