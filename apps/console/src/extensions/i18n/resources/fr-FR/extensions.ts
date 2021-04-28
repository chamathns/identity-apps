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
                description: "Afficher et gérer les attributs"
            }
        },
        features: {
            tenant: {
                header: {
                    tenantSwitchHeader: "Changer d'organisation",
                    tenantAddHeader: "Nouvelle organisation",
                    tenantDefaultButton: "Défaut",
                    tenantMakeDefaultButton: "Faire défaut"
                },
                wizards: {
                    addTenant: {
                        heading: "Ajouter une nouvelle organisation",
                        forms: {
                            fields: {
                                tenantName: {
                                    label: "Nom de l'organisation",
                                    placeholder: "Nom de l'organisation (E.g., myorg)",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire.",
                                        duplicate: "Une organisation portant le nom {{ tenantName }} existe déjà." +
                                            " Veuillez essayer un autre nom.",
                                        invalid: "Le nom que vous avez entré contient des caractères non autorisés." +
                                            " Il peut contenir jusqu'à {{ characterLimit }} caractères, ne peut être" +
                                            " composé que de minuscules alphanumériques et doit toujours commencer" +
                                            " par un caractère alphabétique."
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: "Validation du nouveau nom de l'organisation...",
                                tenantCreate: "Créer la nouvelle organisation...",
                                tenantSwitch: "Veuillez patienter pendant que nous vous redirigeons vers la nouvelle" +
                                    "organisation..."
                            }
                        },
                        tooltips: {
                            message: "Vous utiliserez cette URL pour accéder à la nouvelle organisation."
                        }
                    }
                },
                notifications: {
                    addTenant: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur lors de la création de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la création de l'organisation.",
                            message: "Erreur lors de la création de l'organisation"
                        },
                        success: {
                            description: "Organisation {{ tenantName }} créée avec succès.",
                            message: "Organisation créée"
                        }
                    },
                    defaultTenant: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour de votre organisation par défaut.",
                            message: "Erreur lors de la mise à jour de l'organisation"
                        },
                        success: {
                            description: "Vous avez bien défini {{ tenantName }} votre organisation par défaut.",
                            message: "Organisation par défaut mise à jour"
                        }
                    }
                }
            }
        }
    }
};
