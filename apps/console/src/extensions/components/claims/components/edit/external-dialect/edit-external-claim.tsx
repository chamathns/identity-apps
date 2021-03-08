/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getAllLocalClaims } from "@wso2is/core/api";
import { AlertLevels, Claim, ClaimsGetParams, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Header } from "semantic-ui-react";
import { getAnExternalClaim, updateAnExternalClaim } from "../../../../../../features/claims/api";
import { ClaimManagementConstants } from "../../../../../../features/claims/constants";
import { AddExternalClaim } from "../../../../../../features/claims/models";
import { resolveType } from "../../../../../../features/claims/utils";
import { sortList } from "../../../../../../features/core";

/**
 * Prop types of `EditExternalClaims` component
 */
interface EditExternalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The claim ID to be edited.
     */
    claimID?: string;
    /**
     * The ID of the dialect the claim belongs to.
     */
    dialectID: string;
    /**
     * Called to initiate an update.
     */
    update: () => void;
    /**
     * Used to trigger submit.
     */
    submit: boolean;
    /**
     * Claim URI of the claim.
     */
    claimURI: string;
    /**
     * Specifies if this is rendered by the wizard.
     */
    wizard?: boolean;
    /**
     * Calls the onSubmit method
     */
    onSubmit?: (values: Map<string, FormValue>) => void;
    /**
     * Claim data if called from wizard
     */
    addedClaim?: AddExternalClaim;
    /**
     * The list of external claims belonging to the dialect.
     */
    externalClaims: ExternalClaim[] | AddExternalClaim[];
    /**
     * Specifies the the attribute type.
     */
    attributeType?: string;
}

/**
 * This component renders the edit external claim modal.
 *
 * @param {EditExternalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditExternalClaim: FunctionComponent<EditExternalClaimsPropsInterface> = (
    props: EditExternalClaimsPropsInterface
): ReactElement => {

    const {
        claimID,
        update,
        dialectID,
        submit,
        claimURI,
        wizard,
        onSubmit,
        addedClaim,
        externalClaims,
        attributeType,
        [ "data-testid" ]: testId
    } = props;

    const [ localClaims, setLocalClaims ] = useState<Claim[]>();
    const [ claim, setClaim ] = useState<ExternalClaim>(null);
    const [ filteredLocalClaims, setFilteredLocalClaims ] = useState<Claim[]>();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        const params: ClaimsGetParams = {
            "exclude-identity-claims": true,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };
        getAllLocalClaims(params).then(response => {
            setLocalClaims(sortList(response, "displayName", true));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("console:manage.features.claims.local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
                }
            ));
        });

        if (!wizard) {
            getAnExternalClaim(dialectID, claimID).then(response => {
                setClaim(response);
            }).catch(error => {
                dispatch(addAlert(
                    {
                        description: error?.description
                            || t("console:manage.features.claims.external.notifications." +
                                "getExternalAttribute.genericError.description", { type: resolveType(attributeType) }),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            || t("console:manage.features.claims.external.notifications." +
                                "getExternalAttribute.genericError.message")
                    }
                ));
            });
        }
    }, []);

    /**
     * Remove local claims that have already been mapped.
     */
    useEffect(() => {
        if (externalClaims && localClaims && (claim || addedClaim)) {
            let tempLocalClaims: Claim[] = [ ...localClaims ];
            externalClaims.forEach((externalClaim: ExternalClaim) => {
                tempLocalClaims = [ ...removeMappedLocalClaim(externalClaim.mappedLocalClaimURI, tempLocalClaims) ];
            });
            tempLocalClaims.unshift(getLocalClaimMappedToSelectedExternalClaim());
            setFilteredLocalClaims(tempLocalClaims);
        }
    }, [ externalClaims, localClaims, claim, addedClaim ]);

    /**
     * This removes the mapped local claims from the local claims list.
     *
     * @param {string} claimURI The claim URI of the mapped local claim.
     * @param {Claim[]} filteredLocalClaims - Filtered claims.
     *
     * @returns {Claim[]} The array of filtered Claims.
     */
    const removeMappedLocalClaim = (claimURI: string, filteredLocalClaims?: Claim[]): Claim[] => {
        const claimsToFilter = filteredLocalClaims ? filteredLocalClaims : localClaims;

        return claimsToFilter?.filter((claim: Claim) => {
            return claim.claimURI !== claimURI;
        });
    };

    /**
     * Returns the local claim that is mapped to the external claim.
     *
     * @returns {Claim} The Local Claim mapped to the selected external claim.
     */
    const getLocalClaimMappedToSelectedExternalClaim = (): Claim => {
        return localClaims.find((localClaim: Claim) => {
            return wizard
                ? localClaim?.claimURI === addedClaim?.mappedLocalClaimURI
                : localClaim?.claimURI === claim?.mappedLocalClaimURI;
        });
    };

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>) => {
                if (!wizard) {
                    updateAnExternalClaim(dialectID, claimID, {
                        claimURI: claimURI,
                        mappedLocalClaimURI: values.get("localClaim").toString()
                    }).then(() => {
                        dispatch(addAlert(
                            {
                                description: t("console:manage.features.claims.external.notifications." +
                                    "updateExternalAttribute.success.description",
                                    { type: resolveType(attributeType) }),
                                level: AlertLevels.SUCCESS,
                                message: t("console:manage.features.claims.external.notifications." +
                                    "updateExternalAttribute.success.message", { type: resolveType(attributeType) })
                            }
                        ));
                        update();
                    }).catch(error => {
                        dispatch(addAlert(
                            {
                                description: error?.description
                                    || t("console:manage.features.claims.external.notifications." +
                                        "updateExternalAttribute.genericError.description",
                                        { type: resolveType(attributeType) }),
                                level: AlertLevels.ERROR,
                                message: error?.message
                                    || t("console:manage.features.claims.external.notifications." +
                                        "updateExternalAttribute.genericError.message")
                            }
                        ));
                    });
                } else {
                    onSubmit(values);
                    update();
                }
            } }
            submitState={ submit }
        >
            <Grid>
                <Grid.Row columns={ wizard ? 2 : 1 }>
                    {
                        wizard &&
                        (
                            <Grid.Column width={ 8 }>
                                <Field
                                    name="claimURI"
                                    label={ t("console:manage.features.claims.external.forms.attributeURI.label",
                                        { type: resolveType(attributeType, true) }) }
                                    required={ true }
                                    requiredErrorMessage={ t("console:manage.features.claims.external.forms." +
                                        "attributeURI.label", { type: resolveType(attributeType, true) }) }
                                    placeholder={
                                        t("console:manage.features.claims.external.forms.attributeURI.label",
                                            { type: resolveType(attributeType) })
                                    }
                                    type="text"
                                    value={ addedClaim.claimURI }
                                    data-testid={ `${ testId }-form-claim-uri-input` }
                                    validation={ (value: string, validation: Validation) => {
                                        for (const claim of externalClaims) {
                                            if (claim.claimURI === value) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(t("console:manage.features.claims." +
                                                    "external.forms.attributeURI.validationErrorMessages.duplicateName",
                                                    { type: resolveType(attributeType) }));
                                                break;
                                            }
                                        }
                                    } }
                                />
                            </Grid.Column>
                        )
                    }
                    <Grid.Column width={ 8 } className="select-attribute">
                        <Field
                            type="dropdown"
                            name="localClaim"
                            label={ t("console:manage.features.claims.external.forms.localAttribute.label") }
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.claims.external.forms." +
                                "localAttribute.requiredErrorMessage") }
                            placeholder={ t("console:manage.features.claims.external.forms.attributeURI.placeholder") }
                            search
                            value={ wizard ? addedClaim.mappedLocalClaimURI : claim?.mappedLocalClaimURI }
                            children={
                                filteredLocalClaims?.map((claim: Claim, index) => {
                                    return {
                                        key: index,
                                        text: (
                                            <Header as="h6">
                                                <Header.Content>
                                                    { claim?.displayName }
                                                    <Header.Subheader>
                                                        <code className="inline-code compact transparent">
                                                            { claim.claimURI }
                                                        </code>
                                                    </Header.Subheader>
                                                </Header.Content>
                                            </Header>),
                                        value: claim?.claimURI
                                    };
                                })
                                ?? []
                            }
                            data-testid={ `${ testId }-local-claim-dropdown` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the component.
 */
EditExternalClaim.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "edit-external-claim"
};
