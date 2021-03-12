/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar, PageLayout, ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Image } from "semantic-ui-react";
import { AppConstants, history } from "../../../../features/core";
import { getAClaim } from "../../../../features/claims/api";
import {
    EditAdditionalPropertiesLocalClaims,
    EditBasicDetailsLocalClaims,
    EditMappedAttributesLocalClaims
} from "../components";

/**
 * Props for the Local Claims edit page.
 */
type LocalClaimsEditPageInterface = TestableComponentInterface;

/**
 * Route parameters interface.
 */
interface RouteParams {
    id: string;
}

/**
 * This renders the edit local claims page
 *
 * @param {LocalClaimsEditPageInterface & RouteComponentProps<RouteParams>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const LocalClaimsEditPage: FunctionComponent<LocalClaimsEditPageInterface> = (
    props: LocalClaimsEditPageInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId
    } = props;

    const claimID = match.params.id;

    const [ claim, setClaim ] = useState<Claim>(null);
    const [ isLocalClaimDetailsRequestLoading, setIsLocalClaimDetailsRequestLoading ] = useState<boolean>(false);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Fetches the local claim.
     */
    const getClaim = () => {
        setIsLocalClaimDetailsRequestLoading(true);

        getAClaim(claimID)
            .then((response) => {
                setClaim(response);
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.description
                        || t("console:manage.features.claims.local.notifications.getAClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("console:manage.features.claims.local.notifications.getAClaim.genericError.message")
                })
                );
            })
            .finally(() => {
                setIsLocalClaimDetailsRequestLoading(false);
            });
    };

    useEffect(() => {
        getClaim();
    }, []);

    /**
     * Contains the data of the panes
     */
    const panes = [
        {
            menuItem: t("console:manage.features.claims.local.pageLayout.edit.tabs.general"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation>
                    <EditBasicDetailsLocalClaims
                        claim={ claim }
                        update={ getClaim }
                        data-testid="local-claims-basic-details-edit"
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("console:manage.features.claims.local.pageLayout.edit.tabs.mappedAttributes"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation>
                    <EditMappedAttributesLocalClaims
                        claim={ claim }
                        update={ getClaim }
                        data-testid={ `${ testId }-edit-local-claims-mapped-attributes` }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("console:manage.features.claims.local.pageLayout.edit.tabs.additionalProperties"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation>
                    <EditAdditionalPropertiesLocalClaims
                        claim={ claim }
                        update={ getClaim }
                        data-testid={ `${ testId }-edit-local-claims-additional-properties` }
                    />
                </ResourceTab.Pane>
            )
        }
    ];

    /**
     * This generates the first letter of a claim
     * @param {string} name
     * @return {string} The first letter of a claim
     */
    const generateClaimLetter = (name: string): string => {
        const stringArray = name?.replace("http://", "")?.split("/");
        return stringArray[ stringArray?.length - 1 ][ 0 ]?.toLocaleUpperCase();
    };

    return (
        <PageLayout
            isLoading={ isLocalClaimDetailsRequestLoading }
            image={
                <Image
                    floated="left"
                    verticalAlign="middle"
                    rounded
                    centered
                    size="tiny"
                >
                    <AnimatedAvatar />
                    <span className="claims-letter">
                        { claim && generateClaimLetter(claim?.claimURI) }
                    </span>
                </Image>
            }
            title={ claim?.displayName }
            description={ t("console:manage.features.claims.local.pageLayout.edit.description") }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("LOCAL_CLAIMS"));
                },
                text: t("console:manage.features.claims.local.pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            { /*<ResourceTab panes={ panes } data-testid={ `${ testId }-tabs` } />*/ }
            <EditBasicDetailsLocalClaims
                claim={ claim }
                update={ getClaim }
                data-testid="local-claims-basic-details-edit"
            />
        </PageLayout>
    );
};

/**
 * Default proptypes for the component.
 */
LocalClaimsEditPage.defaultProps = {
    "data-testid": "edit-local-claims"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default LocalClaimsEditPage;
