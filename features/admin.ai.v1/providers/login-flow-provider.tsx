/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import axios from "axios";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import { AuthenticationSequenceInterface } from "../../admin.applications.v1/models/application";
import useAuthenticationFlow from "../../admin.authentication-flow-builder.v1/hooks/use-authentication-flow";
import fetchUserClaims from "../api/fetch-user-claims";
import useGenerateAILoginFlow from "../api/generate-ai-loginflow";
import LoginFLowBanner from "../components/login-flow-banners";
import LoadingScreen from "../components/login-flow-loading-screen";
import AILoginFlowContext from "../context/login-flow-context";
import useGetLoginFLow from "../hooks/use-get-login-flow";
import { BannerState } from "../models/banner-state";
import { ClaimURIs } from "../models/claim-uris";

export type AILoginFlowProviderProps = unknown;

/**
 * Provider for the sign on methods context.
 *
 * @param props - Props for the client.
 * @returns Sign On Mehtods provider.
 */

const generateAILoginFlow = (
    userQuery, userClaims, availableAuthenticators, traceId
) => {
    console.log("/generate TraceId: ", traceId);
    return axios.post(
        "http://0.0.0.0:8081/loginflow/generate",
        { user_query: userQuery, user_claims: userClaims, available_authenticators: availableAuthenticators },
        { headers: { "trace-id": traceId, Accept: "application/json", "Content-Type": "application/json" } }
    )
        .then(response => ({ loginFlow: response.data, isError: false, error: null }))
        .catch(error => ({ loginFlow: null, isError: true, error: error }));
};

const getLoginFlow = (generatedLoginFlow) => ({
    attributeStepId: generatedLoginFlow.authenticationSequence.attributeStepId,
    requestPathAuthenticators: [],
    steps: generatedLoginFlow.authenticationSequence.steps,
    script: generatedLoginFlow.script,
    type: generatedLoginFlow.type,
    subjectStepId: generatedLoginFlow.subjectStepId
});

const AILoginFlowProvider =(props: React.PropsWithChildren<AILoginFlowProviderProps>): React.ReactElement=>{

    const { children } = props;

    const { t } = useTranslation();
    const disabledFeatures: string[] = window["AppUtils"]?.getConfig()?.ui?.features?.applications?.disabledFeatures;
    const [ bannerState, setBannerState ] = useState<BannerState>(BannerState.Full);
    const [ aiGeneratedAiLoginFlow, setAiGeneratedAiLoginFlow ] = useState<AuthenticationSequenceInterface>(undefined);
    const [ isAiLoginFlowGenerationRequested, setIsAiLoginFlowGenerationRequested ] = useState<boolean>(false);
    const [ traceId, setTraceId ] = useState<string>("custom-ai-login-flow");
    const dispatch: Dispatch = useDispatch();
    const { refetchApplication } = useAuthenticationFlow();

    const handleGenerateButtonClick = async (userInput:string) => {

        // const trace_id = uuidv4();
        // setTraceId(trace_id);

        const available_authenticators: { authenticator: string, idp: string }[] = [
            { "authenticator": "BasicAuthenticator", "idp": "LOCAL" },
            { "authenticator" : "GoogleAuthenticator", "idp": "google123" },
            { "authenticator":"email-otp-authenticator", "idp" : "LOCAL" },
            { "authenticator": "totp", "idp": "LOCAL" },
            { "authenticator" : "FIDOAuthenticator","idp" : "abcxyz" },
            { "authenticator" : "MagicLinkAuthenticator","idp" : "LOCAL" }
        ];

        setIsAiLoginFlowGenerationRequested(true);
        try {
            const claimsResponse = await fetchUserClaims();

            if (claimsResponse.error) {
                throw claimsResponse.error;
            }

            const loginFlowResponse = await generateAILoginFlow(
                userInput, claimsResponse.claimURIs, available_authenticators, traceId
            );

            if (loginFlowResponse.isError) {
                throw loginFlowResponse.error;
            }

            setAiGeneratedAiLoginFlow(getLoginFlow(loginFlowResponse.loginFlow));
        } catch (error) {
            dispatch(addAlert({
                description: error?.response?.data?.detail || t("some.error.translation.path"),
                level: AlertLevels.ERROR,
                message: "Error"
            }));
        } finally {
            setBannerState(BannerState.Collapsed);
            setIsAiLoginFlowGenerationRequested(false);
        }
        /**
        * Fetching user claims
        */
        // fetchUserClaims()
        //     .then((response:{claimURIs: ClaimURIs[]; error: IdentityAppsApiException;}) => {
        //         if (response.error) {
        //             dispatch(addAlert(
        //                 {
        //                     description: response.error?.response?.data?.description
        //                         || t("console:manage.features.claims.local.notifications.getClaims.genericError.description"),
        //                     level: AlertLevels.ERROR,
        //                     message: response.error?.response?.data?.message
        //                         || t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
        //                 }
        //             ));

        //             return ({ loginFlow: null, isError: true, error: response.error });
        //         }else{
        //             /**
        //             * API call to generate AI login flow.
        //             */
        //             return useGenerateAILoginFlow(userInput, response.claimURIs, available_authenticators, traceId);
        //         }
        //     })
        //     .then((response:{loginFlow:any; isError:boolean; error:any}) => {
        //         if (response.isError) {
        //             dispatch(
        //                 addAlert({
        //                     description: response.error.data.detail,
        //                     level: AlertLevels.ERROR,
        //                     message: "Error"
        //                 })
        //             );
        //             () => refetchApplication();
        //         }else{
        //             setAiGeneratedAiLoginFlow(useGetLoginFLow(response.loginFlow));
        //         }
        //     })
        //     .catch((error) => {
        //         dispatch(
        //             addAlert({
        //                 description: error?.response?.data?.detail,
        //                 level: AlertLevels.ERROR,
        //                 message: "Error"
        //             })
        //         );
        //         () => refetchApplication();
        //     })
        //     .finally(() => {
        //         setBannerState(BannerState.Collapsed);
        //         setIsAiLoginFlowGenerationRequested(false);
        //     });
    };

    return (
        <AILoginFlowContext.Provider
            value={ {
                bannerState: bannerState,
                aiGeneratedAiLoginFlow: aiGeneratedAiLoginFlow,
                setBannerState: setBannerState
            } }>
            { !isAiLoginFlowGenerationRequested &&
            (<>
                { !disabledFeatures?.includes("loginFlowAI1") &&
                    <LoginFLowBanner onGenerateClick={ handleGenerateButtonClick } />
                }
                { children }
            </>)

            }
            { isAiLoginFlowGenerationRequested &&
            <LoadingScreen traceId={ traceId } /> }

        </AILoginFlowContext.Provider>
    );
};

export default AILoginFlowProvider;
