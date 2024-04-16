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

import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import useAIBrandingPreference from "features/admin.ai.v1/hooks/use-ai-branding-preference";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as LoadingPlaceholder }
    from "../../../modules/theme/src/themes/wso2is/assets/images/illustrations/ai-loading-screen-placeholder.svg";
import useGetAIBrandingGenerationStatus from "../api/use-get-branding-generation-status";
import "./loading-screen.scss";

export const LoadingScreen = (): JSX.Element => {
    const { t } = useTranslation();
    const [ factIndex, setFactIndex ] = useState(0);
    const facts: string[] = [
        t("branding:ai.screens.loading.facts.0"),
        t("branding:ai.screens.loading.facts.1"),
        t("branding:ai.screens.loading.facts.2")
    ];

    const [ currentProgress, setCurrentProgress ] = useState(0);

    const { operationId } = useAIBrandingPreference();

    const { data, isLoading } = useGetAIBrandingGenerationStatus(operationId);

    const statusLabels: Record<string, string> = {
        branding_generation_completed: t("branding:ai.screens.loading.states.8"),
        color_palette: t("branding:ai.screens.loading.states.5"),
        create_branding_theme: t("branding:ai.screens.loading.states.7"),
        extract_webpage_content: t("branding:ai.screens.loading.states.2"),
        generate_branding: t("branding:ai.screens.loading.states.4"),
        render_webpage: t("branding:ai.screens.loading.states.1"),
        style_properties: t("branding:ai.screens.loading.states.6"),
        webpage_extraction_completed: t("branding:ai.screens.loading.states.3")
    };

    useEffect(() => {
        // Calculate the target progress based on the completed tasks
        const targetProgress = getProgress();

        // Start a timer that increments currentProgress until it reaches targetProgress
        const interval: NodeJS.Timeout = setInterval(() => {
            setCurrentProgress((prevProgress) => {
                if (prevProgress >= targetProgress) {
                    // Clear the timer if currentProgress has reached targetProgress
                    clearInterval(interval);

                    return targetProgress;
                } else {
                    // Increment currentProgress by 1% (adjust this value as needed)
                    return prevProgress + 1;
                }
            });
        }, 100); // Update every 100ms (adjust this value as needed)

        // Clear the timer when the component unmounts or when the target progress changes
        return () => clearInterval(interval);
    }, [ data ]);

    const statusProgress: Record<string, number> = {
        branding_generation_completed: 100,
        color_palette: 95,
        create_branding_theme: 99,
        extract_webpage_content: 15,
        generate_branding: 94,
        render_webpage: 10,
        style_properties: 98,
        webpage_extraction_completed: 20
    };

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(() => {
            setFactIndex((factIndex + 1) % facts.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [ factIndex ]);

    const getProgress = () => {
        if (!data) return 0;
        // Find the last completed status based on the predefined progress mapping
        let maxProgress: number = 0;

        Object.entries(data.status).forEach(([ key, value ]: [string, boolean]) => {
            if (value && statusProgress[key] > maxProgress) {
                maxProgress = statusProgress[key];
            }
        });

        return maxProgress;
    };

    const getCurrentStatus = () => {
        if (!data) return t("branding:ai.screens.loading.states.0");
        let currentStatusLabel: string = "branding:ai.screens.loading.states.0";

        Object.entries(data.status).forEach(([ key, value ]: [string, boolean]) => {
            if (value && statusLabels[key]) {
                currentStatusLabel = statusLabels[key];
            }
        });

        return t(currentStatusLabel);
    };

    return (
        <Box className="loading-screen-container">
            <Box className="loading-screen-content">
                <Box className="loading-screen-row">
                    <Box className="loading-screen-facts">
                        <Box className="loading-screen-facts-content">
                            <Typography variant="h5" className="loading-screen-facts-text">
                                { t("branding:ai.screens.loading.didYouKNow") }
                            </Typography>
                            <Typography
                                variant="body1"
                                align="justify"
                                className="loading-screen-facts-detail">
                                { facts[factIndex] }
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="loading-screen-placeholder">
                        <LoadingPlaceholder />
                    </Box>
                </Box>
                <Box className="loading-screen-progress">
                    <LinearProgress variant="determinate" value={ currentProgress } />
                </Box>
                <Box className="loading-screen-status">
                    { isLoading && <CircularProgress size={ 20 } className="loading-screen-status-progress" /> }
                    <Typography variant="h6">
                        { getCurrentStatus() }
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
