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

import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/system";
import { ChevronUpIcon, XMarkIcon }from "@oxygen-ui/react-icons";
import Button from "@oxygen-ui/react/Button";
import { DocumentationLink, GenericIcon } from "@wso2is/react-components";
import React, { ReactElement, useContext, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Header, Icon, Input, Segment, TextArea } from "semantic-ui-react";
import { ReactComponent as AIIcon }
    from "../../../modules/theme/src/themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import AILoginFlowContext from "../context/login-flow-context";
import { BannerState } from "../models/banner-state";

/*
LoginFlowAIComponentProps is an interface that defines the props for the LoginFlowAIComponent.
params:
- @onGenerateBrandingClick - A callback function that is triggered when the user clicks on the generate branding button.
- @onGenerate - A callback function that is triggered when the user clicks on the generate button.
*/
interface LoginFLowBannerProps {
    onGenerateClick: (userInput:string) => void;

}
const LoginFLowBanner: React.FC<LoginFLowBannerProps> = ({ onGenerateClick }): ReactElement => {

    const grey = {
        50: "#F3F6F9",
        100: "#E5EAF2",
        200: "#DAE2ED",
        300: "#C7D0DD",
        400: "#B0B8C4",
        500: "#9DA8B7",
        600: "#6B7A90",
        700: "#434D5B",
        800: "#303740",
        900: "#1C2025"
    };

    const orange = {
        100: "#FFE8D9",
        200: "#FFD0B5",
        300: "#FFB088",
        400: "#FF9466",
        500: "#F9703E",
        600: "#F35627",
        700: "#DE3A11",
        800: "#B31D0E",
        900: "#8B0E07"
    };

    const Textarea = styled(TextareaAutosize)(
        ({ theme }) => `
        box-sizing: border-box;
        width: 320px;
        // font-family: 'IBM Plex Sans', sans-serif;
        // font-size: 0.875rem;
        // font-weight: 400;
        line-height: 1.5;
        padding: 8px 12px;
        border-radius: 8px;
        color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
        background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
        border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
        box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    
        &:hover {
          border-color: ${orange[200]};
        }
    
        &:focus {
          border-color: ${orange[200]};
        //   box-shadow: 0 0 0 2px ${theme.palette.mode === "dark" ? orange[600] : orange[200]};
        }
    
        // firefox
        &:focus-visible {
          outline: 0;
        }
      `
    );
    const { t } = useTranslation();
    /**
     * Load login flow context.
     */
    const {
        bannerState,
        setBannerState
    } = useContext(AILoginFlowContext);

    //Try login flow button click event handler.
    const handleTryLoginFlowButtonClick = () => {
        setBannerState(BannerState.Input);
    };

    const [ loginFlowInput, setLoginFlowInput ] = useState("");

    const handleInputChange = (event) => {
        setLoginFlowInput(event.target.value);
    };

    //Banner collapse button click event handler.
    const handleBannerCollapseButtonClick = () => {
        setBannerState(BannerState.Collapsed);
    };

    //Delete banner button click event handler.
    const handleDeleteButtonCLick = () => {
        setBannerState(BannerState.Null);
    };


    const handleGenerateButtonClick = (event) => {
        event.preventDefault(); // Prevent the form from being submitted
        // Now you can process the input value
        console.log(loginFlowInput);
        const data = "I'm setting up a two-step login process. First, all users enter their username and password. If the user is a manager, they're then asked for a TOTP code. If they're not a manager, they skip this step and go straight in after entering their password."
        onGenerateClick(data);
    };


    /*
    Declaring sub components for the card.
    */

    // Full Banner.
    const FullBanner = () => (

        <Segment
            basic
            style={ {
                background: "linear-gradient(90deg, rgba(255,115,0,0.42) 0%, rgba(255,244,235,1) 37%)",
                borderRadius: "8px"
            } }
        >
            <div
                style={ {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "45px"
                } }>
                <div>
                    <Header as="h3">
                        { t("ai:banner.full.heading") }
                    </Header>
                    <p>
                        Input your preferred login sequence, and our AI will
                        analyze your authenticators and context to configure the flow accordingly.<br />
                        { /* { t("ai:banner.full.subheading2") } */ }
                    </p>
                </div>
                <Button onClick={ handleTryLoginFlowButtonClick } color="secondary" variant="outlined">
                    <GenericIcon icon={ AIIcon } style={ { paddingRight: "5px" } }/>
                    { t("ai:banner.full.button") }
                </Button>
            </div>
        </Segment>
    );

    // Input Banner.
    const InputBanner = () => (
        <Segment>
            <div
                style={ {
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    position: "relative"
                } }>
                <Icon
                    name="dropdown"
                    onClick={ handleBannerCollapseButtonClick }
                    style={ {
                        cursor: "pointer",
                        position: "absolute",
                        right: "0",
                        top: "0"
                    } }
                />
                <div
                    style={ {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "10px"
                    } }>
                    <div>
                        <Header as="h3" style={ { marginBottom: "5px" } }>Craft Your Login Flow Effortlessly Using Login AI</Header>
                        <p>
                            AI-powered login configurations crafted to align with your application&apos;s environment and authenticators.
                            <DocumentationLink
                                link={ "develop.applications.editApplication.asgardeoTryitApplication.general.learnMore" }
                                isLinkRef={ true }>
                                <Trans i18nKey={ "extensions:common.learnMore" }>
                                Learn more
                                </Trans>
                            </DocumentationLink>
                        </p>
                    </div>
                    <div
                        style={ {
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                            paddingTop: "20px"

                        } }>
                        <Textarea
                            minRows={ 3 }
                            maxRows={ 4 }
                            style={ {
                                width: "70%"
                            } }
                            autoFocus
                            placeholder="Describe your login flow"
                            value={ loginFlowInput }
                            onChange={ handleInputChange }
                        />
                        <Button
                            onClick={ handleGenerateButtonClick }
                            color="secondary"
                            variant="outlined"
                            style={ { marginLeft: "auto" } }
                        >
                            <GenericIcon
                                style={ { paddingRight: "5px" } }
                                icon={ AIIcon }
                            />
                            { t("ai:banner.input.button") }
                        </Button>
                    </div>
                </div>
            </div>
        </Segment>
    );

    // Collapsed Banner.
    const CollapsedBanner = () => (
        <Segment>
            <div
                style={ {
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    justifyContent: "space-between"
                } }>
                <div>
                    <Header as="h3" style={ { marginBottom: "5px" } }>Craft Your Login Flow Effortlessly Using Login AI</Header>
                    <p>
                        AI-powered login configurations crafted to align with your application&apos;s environment and authenticators.
                        <DocumentationLink
                            link={ "develop.applications.editApplication.asgardeoTryitApplication.general.learnMore" }
                            isLinkRef={ true }>
                            <Trans i18nKey={ "extensions:common.learnMore" }>
                                Learn more
                            </Trans>
                        </DocumentationLink>
                    </p>
                </div>
                <Button onClick={ handleTryLoginFlowButtonClick } color="secondary" variant="outlined">
                    <GenericIcon icon={ AIIcon } style={ { paddingRight: "5px" } }/>
                    { t("ai:banner.collapsed.button") }
                </Button>
            </div>
        </Segment>
    );

    return (
        <>
            { bannerState === BannerState.Full && (<FullBanner />) }
            { bannerState === BannerState.Input && (<InputBanner />) }
            { bannerState === BannerState.Collapsed && (<CollapsedBanner />) }
            { bannerState === BannerState.Null && (<></>) }
        </>

    );
};

export default LoginFLowBanner;
