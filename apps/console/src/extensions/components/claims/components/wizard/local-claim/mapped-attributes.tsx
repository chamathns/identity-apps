/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getUserStoreList } from "@wso2is/core/api";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { UserStoreListItem } from "../../../../../../features/userstores";

/**
 * Prop types of `MappedAttributes` component
 */
interface MappedAttributesPropsInterface extends TestableComponentInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Handles update
     */
    onSubmit: (data: any, values: Map<string, FormValue>) => void;
    /**
     * The key values to be stored
     */
    values: Map<string, FormValue>;
}

/**
 * This component renders the Mapped Attributes step of the wizard.
 *
 * @param {MappedAttributesPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const MappedAttributes: FunctionComponent<MappedAttributesPropsInterface> = (
    props: MappedAttributesPropsInterface
): ReactElement => {

    const {
        onSubmit,
        submitState,
        values,
        [ "data-testid" ]: testId
    } = props;

    const [ userStore, setUserStore ] = useState<UserStoreListItem[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        const userstore: UserStoreListItem[] = [];
        userstore.push({
            description: "",
            enabled: true,
            id: "PRIMARY",
            name: "PRIMARY",
            self: ""
        });
        getUserStoreList().then((response) => {
            userstore.push(...response.data);
            setUserStore(userstore);
        }).catch(() => {
            setUserStore(userstore);
        });
    }, []);

    return (
        <Grid data-testid={ testId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 14 }>
                    <h4>{ t("console:manage.features.claims.local.wizard." +
                        "steps.mapAttributes") }</h4>
                    <p>
                        { t("console:manage.features.claims.local.mappedAttributes.hint") }
                    </p>
                    <Divider hidden />
                    <Divider hidden />
                    <Forms
                        submitState={ submitState }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const submitData = {
                                attributeMapping: Array.from(values).map(([ userstore, attribute ]) => {
                                    return {
                                        mappedAttribute: attribute,
                                        userstore: userstore
                                    };
                                })
                            };
                            onSubmit(submitData, values);
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
                                                requiredErrorMessage={ t("console:manage.features.claims.local.forms." +
                                                    "attribute.requiredErrorMessage") }
                                                value={ values?.get(store.name).toString() }
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
        </Grid>
    );
};

/**
 * Default props for the application creation wizard.
 */
MappedAttributes.defaultProps = {
    "data-testid": "mapped-attributes"
};
