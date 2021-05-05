/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Extensions } from "../../models";
export const extensions: Extensions = {
    manage: {
        attributes: {
            attributes: {
                description: "ගුණාංග බලන්න සහ කළමනාකරණය කරන්න"
            }
        },
        features: {
            tenant: {
                header: {
                    tenantSwitchHeader: "සංවිධානය මාරු කරන්න",
                    tenantAddHeader: "නව සංවිධානය",
                    tenantDefaultButton: "පෙරනිමිය",
                    tenantMakeDefaultButton: "පෙරනිමිය කරන්න"
                },
                wizards: {
                    addTenant: {
                        heading: "නව සංවිධානයක් එක් කරන්න",
                        forms: {
                            fields: {
                                tenantName: {
                                    label: "සංවිධානයේ නම",
                                    placeholder: "සංවිධානයේ නම (E.g., myorg)",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි.",
                                        duplicate: "{{ tenantName }} යන නම සහිත සංවිධානයක් දැනටමත් පවතී. කරුණාකර" +
                                            " වෙනත් නමක් උත්සාහ කරන්න.",
                                        invalid: "ඔබ ඇතුළත් කළ නමට අවසර නැති අක්ෂර අඩංගු වේ. එහි අක්ෂර " +
                                            "{{ characterLimit }} ක් දක්වා අඩංගු විය හැකි අතර, කුඩා අකුරු සංඛ්‍යා" +
                                            " වලින් පමණක් සමන්විත විය හැකි අතර එය සැමවිටම අක්ෂර අක්ෂරයකින්" +
                                            " ආරම්භ විය යුතුය."
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: "නව සංවිධානයේ නම වලංගු කිරීම...",
                                tenantCreate: "නව සංවිධානය නිර්මාණය කිරීම...",
                                tenantSwitch: "අපි ඔබව නව සංවිධානය වෙත හරවා යවන තෙක් කරුණාකර රැඳී සිටින්න..."
                            }
                        },
                        tooltips: {
                            message: "නව සංවිධානයට ප්‍රවේශ වීමට ඔබ මෙම URL භාවිතා කරනු ඇත."
                        }
                    }
                },
                notifications: {
                    addTenant: {
                        error: {
                            description: "{{ description }}",
                            message: "සංවිධානය නිර්මාණය කිරීමේදී දෝෂයකි"
                        },
                        genericError: {
                            description: "සංවිධානය නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "සංවිධානය නිර්මාණය කිරීමේදී දෝෂයකි"
                        },
                        success: {
                            description: "{{ tenantName }} සංවිධානය සාර්ථකව නිර්මාණය කරන ලදි.",
                            message: "සංවිධානය නිර්මාණය කරන ලදි"
                        }
                    },
                    defaultTenant: {
                        genericError: {
                            description: "ඔබගේ සුපුරුදු සංවිධානය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "සංවිධානය යාවත්කාලීන කිරීමේ දෝෂයකි"
                        },
                        success: {
                            description: "ඔබේ පෙරනිමි සංවිධානය වන {{ tenantName }} සාර්ථකව සකසන්න.",
                            message: "යාවත්කාලීන කළ පෙරනිමි සංවිධානය"
                        }
                    }
                }
            }
        }
    }
};
