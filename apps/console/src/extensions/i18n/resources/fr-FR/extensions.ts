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
    common: {
        help: {
            docSiteLink: "Aller à la documentation",
            helpCenterLink: "Contactez le support"
        }
    },
    console: {
        application: {
            quickStart: {
                technologySelectionWrapper: {
                    subHeading: "Vous pouvez trouver les détails du point de terminaison du serveur dans la " +
                        "<1>section Info</1> pour configurer votre application."
                },
                addUserOption:{
                    description: "Vous avez besoin d'un compte <1>utilisateur client</1> pour vous connecter " +
                        "à l'application.",
                    hint: "Si vous n'avez pas de compte utilisateur client, cliquez sur le bouton ci-dessous pour en " +
                        "ajouter un. Vous pouvez également ajouter manuellement un utilisateur client en accédant à " +
                        "la <1>gestion des utilisateurs</1>.",
                    message: "Si vous n'avez pas encore de compte d'utilisateur client, contactez l'administrateur " +
                        "de votre organisation."
                }
            }
        }
    },
    develop: {
        applications: {
            edit: {
                sections: {
                    signInMethod: {
                        sections: {
                            authenticationFlow: {
                                sections: {
                                    stepBased: {
                                        secondFactorDisabled: "Les authentificateurs de deuxième facteur ne peuvent " +
                                            "être utilisés que si <1>Nom d'utilisateur et mot de passe</1> ou un " +
                                            "<3>Connexion sociale</3> est présent lors d'une étape précédente."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        identityProviders: {
            emailOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter un e-mail OTP",
                        subHeading: "Sélectionnez une application pour configurer la connexion OTP par e-mail."
                    },
                    connectApp: {
                        description: "Ajoutez l'<1>Email OTP</1> à l'<3>Étape 2</3> dans la section <5>Méthode de " +
                            "connexion </5> de votre <7>application</7>."
                    },
                    heading: "Ajouter un e-mail OTP",
                    subHeading: "Email OTP est maintenant prêt à être utilisé comme option de connexion pour vos " +
                        "applications."
                }
            },
            facebook: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion Facebook",
                        subHeading: "Sélectionnez une application pour configurer la connexion Facebook."
                    },
                    connectApp: {
                        description: "Ajouter l'authentificateur <1>Facebook</1> à l'<3>Étape 1</3> de la <5>" +
                            "Méthode de connexion</5> section de votre <7>candidature</7>."
                    },
                    heading: "Ajouter une connexion Facebook",
                    subHeading: "Le fournisseur d'identité Facebook est maintenant prêt à être utilisé comme " +
                        "option de connexion pour votre applications."
                }
            },
            github: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion GitHub",
                        subHeading: "Sélectionnez une application pour configurer la connexion GitHub."
                    },
                    connectApp: {
                        description: "Ajouter l'authentificateur <1>GitHub</1> à l'<3>Étape 1</3> de la <5>" +
                            "Méthode de connexion</5> section de votre <7>candidature</7>."
                    },
                    heading: "Ajouter une connexion GitHub",
                    subHeading: "Le fournisseur d'identité GitHub est maintenant prêt à être utilisé comme " +
                        "option de connexion pour votre applications."
                }
            },
            google: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion Google",
                        subHeading: "Sélectionnez une application pour configurer la connexion Google."
                    },
                    connectApp: {
                        description: "Ajouter l'authentificateur <1>Google</1> à l'<3>Étape 1</3> de la <5>" +
                            "Méthode de connexion</5> section de votre <7>candidature</7>."
                    },
                    heading: "Ajouter une connexion Google",
                    subHeading: "Le fournisseur d'identité Google est maintenant prêt à être utilisé comme " +
                        "option de connexion pour votre applications."
                }
            },
            totp: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter TOTP",
                        subHeading: "Sélectionnez une application pour configurer la connexion TOTP."
                    }
                }
            },
        }
    },
    manage: {
        attributes: {
            attributes: {
                description: "Afficher et gérer les attributs"
            },
            displayNameHint: "Le nom d'affichage sera utilisé dans le profil de l'utilisateur pour reconnaître "
                +"l'attribut, donc soyez prudent lors de sa sélection.",
            generatedAttributeMapping: {
                title: "Mappages de protocoles",
                OIDCProtocol: "OpenID Connect",
                SCIMProtocol: "SCIM 2.0",
                description: "Nous simplifions le processus pour vous et ajoutons les mappages requis pour "
                    +"les protocoles suivants."
            }
        },
        features: {
            tenant: {
                header: {
                    tenantSwitchHeader: "Changer d'organisation",
                    tenantAddHeader: "Nouvelle organisation",
                    tenantDefaultButton: "Défaut",
                    tenantMakeDefaultButton: "Faire défaut",
                    backButton: "Retourner",
                    tenantSearch: {
                        placeholder: "Rechercher une organisation",
                        emptyResultMessage: "Aucune organisation trouvée"
                    }
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
                                        duplicate:
                                            "Une organisation portant le nom {{ tenantName }} existe déjà." +
                                            " Veuillez essayer un autre nom.",
                                        invalid:
                                            "Le nom que vous avez entré contient des caractères non autorisés." +
                                            " Il peut contenir jusqu'à {{ characterLimit }} caractères, ne peut être" +
                                            " composé que de minuscules alphanumériques et doit toujours commencer" +
                                            " par un caractère alphabétique.",
                                        invalidLength: "Le nom que vous avez entré comporte moins de" +
                                            " {{ characterLowerLimit }} caractères. Il peut contenir jusqu'à" +
                                            " {{ characterLimit }} caractères, ne peut être composé que de lettres" +
                                            " alphanumériques minuscules et doit toujours commencer par un" +
                                            " caractère alphabétique."
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: "Validation du nouveau nom de l'organisation...",
                                tenantCreate: "Créer la nouvelle organisation...",
                                tenantSwitch:
                                    "Veuillez patienter pendant que nous vous redirigeons vers la nouvelle" +
                                    "organisation..."
                            },
                            messages: {
                                info:
                                    "Pensez à un bon nom d'organisation unique pour votre nouvel espace de travail" +
                                    " Asgardeo car vous ne pourrez pas le modifier plus tard!"
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
                        limitReachError: {
                            description: "Le nombre maximum d'organisations autorisées a été atteint.",
                            message: "Erreur lors de la création de l'organisation"
                        },
                        success: {
                            description: "Organisation {{ tenantName }} créée avec succès.",
                            message: "Organisation créée"
                        }
                    },
                    defaultTenant: {
                        genericError: {
                            description:
                                "Une erreur s'est produite lors de la mise à jour de votre organisation par défaut.",
                            message: "Erreur lors de la mise à jour de l'organisation"
                        },
                        success: {
                            description: "Vous avez bien défini {{ tenantName }} votre organisation par défaut.",
                            message: "Organisation par défaut mise à jour"
                        }
                    },
                    missingClaims: {
                        message: "Certaines informations personnelles sont manquantes",
                        description:
                            "Veuillez visiter l'application MyAccount et assurez-vous que votre prénom," +
                            " nomet adresse e-mail principale ont été définis dans la section Informations personnelles."
                    },
                    getTenants: {
                        message: "Impossible de récupérer vos organisations",
                        description: "Une erreur s'est produite lors de la récupération de vos organisations."
                    }
                }
            }
        },
        groups: {
            edit: {
                users: {
                    heading: "Utilisateurs du groupe",
                    description: "Ajoutez ou supprimez des utilisateurs appartenant à ce groupe."
                }
            }
        },
        serverConfigurations: {
            accountManagement: {
                accountRecovery: {
                    heading: "Password Recovery",
                    subHeading: "Configurez les paramètres de récupération de mot de passe en libre-service pour " +
                        "permettre aux utilisateurs de réinitialiser leur mot de passe à l'aide d'un e-mail.",
                    toggleName: "Activer la récupération de mot de passe"
                }
            },
            accountRecovery: {
                backButton: "Revenir à la récupération de compte",
                heading: "Account Recovery",
                passwordRecovery: {
                    form: {
                        fields: {
                            enable: {
                                hint: "L'activation de cette option permettra aux utilisateurs professionnels de " +
                                    "réinitialiser leur mot de passe à l'aide d'un e-mail.",
                                label: "Activer"
                            },
                            expiryTime: {
                                label: "Délai d'expiration du lien de récupération en minutes",
                                placeholder: "Entrez l'heure d'expiration",
                                validations: {
                                    invalid: "Le délai d'expiration du lien de récupération ne peut pas être égal à 0.",
                                    required: "L'heure d'expiration du lien de récupération est un champ obligatoire.",
                                    empty: "L'heure d'expiration du lien de récupération ne peut pas être nulle."
                                }
                            },
                            notifySuccess: {
                                hint: "Ceci spécifie s'il faut notifier l'utilisateur par e-mail lorsque la " +
                                    "récupération du mot de passe est réussie.",
                                label: "Notifier la récupération réussie"
                            }
                        }
                    },
                    connectorDescription: "Activer l'option de récupération de mot de passe en libre-service pour " +
                        "les utilisateurs professionnels sur la page de connexion. ",
                    heading: "Password Recovery",
                    notification: {
                        error: {
                            description: "Erreur lors de la mise à jour de la configuration de récupération de mot " +
                                "de passe.",
                            message: "Erreur de mise à jour de la configuration"
                        },
                        success: {
                            description: "La configuration de récupération de mot de passe a été mise à jour avec " +
                                "succès.",
                            message: "Mise à jour réussie"
                        }
                    },
                    subHeading: "Activez l'option de récupération de mot de passe en libre-service pour les " +
                        "utilisateurs professionnels sur la page de connexion."
                },
                subHeading: "Configurer les paramètres liés à la récupération du mot de passe et à la " +
                    "récupération du nom d'utilisateur."
            },
            accountSecurity: {
                backButton: "Revenir à la sécurité du compte",
                heading: "Sécurité du compte",
                botDetection: {
                    form: {
                        fields: {
                            enable: {
                                hint: "L'activation de cette option appliquera reCaptcha pour la connexion et " +
                                    "la récupération.",
                                label: "Activer"
                            }
                        }
                    },
                    info: {
                        heading: "Cela appliquera la validation reCAPTCHA dans les interfaces utilisateur " +
                            "respectives des flux suivants.",
                        subSection1: "Connectez-vous aux applications d'entreprise",
                        subSection2: "Récupérer le mot de passe d'un utilisateur client",
                        subSection3: "Auto-inscription pour les utilisateurs clients"
                    },
                    connectorDescription: "Activer reCAPTCHA pour l'organisation.",
                    heading: "Détection de Bot",
                    notification: {
                        error: {
                            description: "Erreur lors de la mise à jour de la configuration de détection de bot.",
                            message: "Erreur de mise à jour de la configuration"
                        },
                        success: {
                            description: "La configuration de détection de bot a été mise à jour avec succès.",
                            message: "Mise à jour réussie"
                        }
                    },
                    subHeading: "Activer recaptcha pour la connexion à l'application métier et la récupération de " +
                        "compte pour l'organisation."
                },
                loginAttemptSecurity: {
                    form: {
                        fields: {
                            accountLockIncrementFactor: {
                                hint: "Ceci spécifie le facteur par lequel la durée de verrouillage du compte " +
                                    "doit être incrémentée lors d'autres tentatives de connexion infructueuses " +
                                    "après le verrouillage du compte. Ex : Durée initiale : 5mins ; " +
                                    "Facteur d'incrémentation : 2 ; Durée du prochain verrouillage : " +
                                    "5 x 2 = 10 min.",
                                label: "Facteur d'incrément de la durée du verrouillage du compte",
                                placeholder: "Entrez le facteur d'incrément de la durée de verrouillage",
                                validations: {
                                    invalid: "Le facteur d'incrément de la durée du verrouillage du compte ne peut " +
                                        "pas être égal à 0."
                                }
                            },
                            accountLockTime: {
                                hint: "Cela spécifie la durée initiale pendant laquelle le compte sera verrouillé. " +
                                    "Le compte sera automatiquement déverrouillé après cette période.",
                                label: "Durée de verrouillage du compte en minutes",
                                placeholder: "Entrer la durée de verrouillage",
                                validations: {
                                    invalid: "La durée de verrouillage du compte ne peut pas être 0.",
                                    required: "La durée de verrouillage du compte est un champ obligatoire."
                                }
                            },
                            enable: {
                                hint: "Le verrouillage du compte entraînera l'envoi d'un courrier à l'utilisateur " +
                                    "indiquant que le compte a été verrouillé.",
                                label: "Activer"
                            },
                            maxFailedAttempts: {
                                hint: "Ceci spécifie le nombre de tentatives de connexion infructueuses autorisées " +
                                    "avant que le compte ne soit verrouillé.",
                                label: "Nombre de tentatives de connexion infructueuses avant le verrouillage du " +
                                    "compte",
                                placeholder: "Saisissez le nombre maximal de tentatives infructueuses",
                                validations: {
                                    invalid: "Le nombre maximal de tentatives infructueuses ne peut pas être égal à 0.",
                                    required: "Le nombre maximal de tentatives échouées est un champ obligatoire."
                                }
                            }
                        }
                    },
                    info: "Une fois le compte verrouillé, le propriétaire du compte en sera informé par e-mail. " +
                        "Le compte sera automatiquement activé après la durée de verrouillage du compte.",
                    connectorDescription: "Protégez les comptes contre les attaques par force brute de mot " +
                        "de passe en verrouillant le compte lors de tentatives de connexion infructueuses " +
                        "consécutives.",
                    heading: "Tentatives de connexion Sécurité",
                    notification: {
                        error: {
                            description: "Erreur lors de la mise à jour de la configuration de sécurité des " +
                                "tentatives de connexion.",
                            message: "Erreur lors de la mise à jour de la configuration"
                        },
                        success: {
                            description: "La configuration de sécurité des tentatives de connexion a été mise à " +
                                "jour avec succès.",
                            message: "Mise à jour réussie"
                        }
                    },
                    subHeading: "Activer le verrouillage du compte en cas d'échec des tentatives de connexion pour " +
                        "la connexion à l'application métier de l'organisation."
                },
                subHeading: "Configurer les paramètres liés à la sécurité du compte tels que les politiques " +
                    "de connexion et la détection de bots."
            },
            additionalSettings: "Paramètres additionnels",
            generalBackButton: "Retourner",
            generalDisabledLabel: "désactivé",
            generalEnabledLabel: "activé",
            userOnboarding: {
                backButton: "Revenir à l'intégration des utilisateurs",
                heading: "Intégration des utilisateurs",
                selfRegistration: {
                    form: {
                        fields: {
                            enable: {
                                hint: "Autoriser les utilisateurs particuliers à s'inscrire eux-mêmes pour cette " +
                                    "organisation. Lorsqu'il est activé, les utilisateurs verront un lien pour " +
                                    "créer un compte sur l'écran de connexion.",
                                label: "Activer"
                            },
                            expiryTime: {
                                hint: "L'heure d'expiration du lien de vérification du compte.",
                                label: "Heure d'expiration du lien de vérification du compte",
                                placeholder: "Entrez l'heure d'expiration",
                                validations: {
                                    invalid: "L'heure d'expiration ne peut pas être 0.",
                                    empty: "L'heure d'expiration ne peut pas être nulle."
                                }
                            },
                            signUpConfirmation: {
                                recommendationMsg:"Il est recommandé d'activer la vérification du compte pour " +
                                    "l'auto-enregistrement.",
                                botMsg: " Sinon, activez au moins la détection des bots.",
                                accountLockMsg: "La vérification du compte permet la vérification de l'e-mail " +
                                    "lors de l'auto-inscription. Le nouveau compte n'est activé qu'une fois " +
                                    "que l'utilisateur a vérifié l'e-mail",
                                hint: "Cela désactivera la vérification par e-mail lors de l'auto-enregistrement.",
                                label: "Vérification de compte"
                            }
                        }
                    },
                    connectorDescription: "Activer l'auto-inscription pour les utilisateurs clients de l'organisation.",
                    heading: "Auto-inscription",
                    notification: {
                        error: {
                            description: "Erreur lors de la mise à jour de la configuration d'auto-enregistrement.",
                            message: "Erreur de mise à jour de la configuration"
                        },
                        success: {
                            description: "Mise à jour réussie de la configuration d'auto-enregistrement.",
                            message: "Mise à jour réussie"
                        }
                    },
                    subHeading: "Lorsque l'auto-inscription est activée, les utilisateurs peuvent s'inscrire via le " +
                        "lien <1>Créer un compte</1> sur la page de connexion de l'application. " +
                        "Cela crée un nouveau compte <3>client</3> dans l'organisation."
                },
                subHeading: "Configurations liées à l'intégration des utilisateurs"
            }
        },
        users: {
            editUserProfile: {
                userId: "Identifiant d'utilisateur",
                disclaimerMessage: "Ce profil utilisateur appartient à un collaborateur ou à un propriétaire" +
                    " d'organisation. Seul le propriétaire du compte peut gérer le profil via l'application Compte.",
                accountLock: {
                    title: "Désactiver l'utilisateur",
                    description: "Une fois le compte désactivé, l'utilisateur ne peut plus se connecter au système. " +
                        "S'il vous plaît soyez certain."
                }
            },
            list: {
                columns: {
                    user: "utilisateur",
                    accountType: "Type de compte",
                    idpType: "Dirigé par",
                    userStore: "Magasin d'utilisateurs"
                },
                popups: {
                    content: {
                        AccountTypeContent: "Relation de l'utilisateur avec cette organisation.",
                        sourceContent: "Où l'utilisateur est géré."
                    }
                }
            },
            descriptions: {
                learnMore: "Apprendre encore plus",
                allUser: "Ce sont tous les utilisateurs de votre organisation.",
                consumerUser: "Ces utilisateurs (clients) peuvent accéder aux applications de l'organisation. Les " +
                    "administrateurs peuvent intégrer des clients à l'organisation ou les clients peuvent " +
                    "s'inscrire si l'auto-inscription est activée.",
                guestUser: "Ces utilisateurs (collaborateurs) ont accès aux opérations administratives de votre " +
                    "organisation (Par exemple, intégration des applications, gestion des utilisateurs). " +
                    "Les administrateurs peuvent inviter des utilisateurs en tant que collaborateurs dans " +
                    "l'organisation et leur attribuer des autorisations.",
                consumerAppInfo: "Partagez ce lien avec vos clients pour autoriser l'accès à My Account et gérer leurs comptes."
            },
            notifications: {
                addUser: {
                    customerUser: {
                        limitReachError: {
                            description: "Le nombre maximum d'utilisateurs clients autorisés a été atteint.",
                            message: "Erreur lors de l'ajout du nouvel utilisateur"
                        }
                    }
                }
            }
        },
        invite: {
            notifications: {
                sendInvite: {
                    limitReachError: {
                        description: "Le nombre maximal d'utilisateurs collaborateurs autorisés a été atteint.",
                        message: "Erreur lors de l'envoi de l'invitation"
                    }
                }
            }
        },
        guest: {
            deleteUser: {
                confirmationModal: {
                    content: "Cependant, le compte de l'utilisateur n'est pas définitivement " +
                        "supprimé d'Asgardeo et il pourra toujours accéder aux autres organisations auxquelles " +
                        "il est associé.",
                    message: "Cette action est irréversible et supprimera l'association de l'utilisateur avec " +
                        "cette organisation."
                }
            }
        },
        sidePanel: {
            categories: {
                attributeManagement: "Gestion des attributs",
                AccountManagement: "Gestion de compte",
                userManagement: "Gestion des utilisateurs"
            }
        }
    }
};
