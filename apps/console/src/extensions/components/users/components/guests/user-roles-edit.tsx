/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Show, AccessControlConstants } from "@wso2is/access-control";
import { getRolesList } from "@wso2is/core/api";
import {
    AlertInterface,
    AlertLevels,
    ProfileInfoInterface,
    RolesMemberInterface,
    RolesInterface
} from "@wso2is/core/models";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    ContentLoader,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem,
    ConfirmationModal
} from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import forEachRight from "lodash-es/forEachRight";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Divider, Grid, Icon, Input, Label, Modal, Popup, Table, Form } from "semantic-ui-react";
import { UserRolePermissions } from "../../../../../features/users/components/user-role-permissions";
import { RolePermissions } from "../../../../../features/users";
import {
    AppConstants,
    AppState,
    getEmptyPlaceholderIllustrations,
    FeatureConfigInterface,
    history,
    updateResources
} from "../../../../../features/core";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "../../../../../features/roles/constants";

interface UserRolesPropsInterface {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * On alert fired callback.
     */
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
    /**
     * Enable roles and groups separation.
     */
    isGroupAndRoleSeparationEnabled?: boolean;
    /**
     * Show/ Hide domain
     */
    showDomain?: boolean;
    /**
     * Permissions to hide.
     */
    permissionsToHide?: string[];
    /**
     * Show/ Hide Application roles.
     */
    hideApplicationRoles?: boolean;
}

export const UserRolesList: FunctionComponent<UserRolesPropsInterface> = (
    props: UserRolesPropsInterface
): ReactElement => {
    const {
        onAlertFired,
        user,
        handleUserUpdate,
        isReadOnly,
        isGroupAndRoleSeparationEnabled,
        showDomain,
        permissionsToHide,
        hideApplicationRoles
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ roleList, setRoleList ] = useState<any>([]);
    const [ selectedRoleList, setSelectedRoleList ] = useState([]);
    const [ initialRoleList, setInitialRoleList ] = useState([]);
    const [ primaryRoles, setPrimaryRoles ] = useState(undefined);

    // The following constant holds the state of role already assigned roles.
    const [ primaryRolesList, setPrimaryRolesList ] = useState(undefined);

    const [ isSelectAllRolesChecked, setIsSelectAllRolesChecked ] = useState(false);
    const [ showRolePermissionModal, setRolePermissionModal ] = useState(false);
    const [ selectedRoleId, setSelectedRoleId ] = useState<string>("");
    const [ isRoleSelected, setRoleSelection ] = useState(false);

    // The following constant are used to persist the state of the unassigned roles permissions.
    const [ viewRolePermissions, setViewRolePermissions ] = useState(false);
    const [ roleId, setRoleId ] = useState();
    const [ isSelected, setSelection ] = useState(false);

    // The following constant is used to persist the state whether user's assigned roles are still loading or finished.
    const [ isPrimaryRolesLoading, setPrimaryRolesLoading ] = useState<boolean>(false);

    const [ assignedRoles, setAssignedRoles ] = useState([]);
    const [ displayedRoles, setDisplayedRoles ] = useState([]);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedRoleId) {
            return;
        }

        if (isRoleSelected) {
            handleOpenRolePermissionModal();
        }
    }, [ isRoleSelected ]);

    useEffect(() => {
        if (!roleId) {
            return;
        }

        if (isSelected) {
            setViewRolePermissions(true);
        }
    }, [ isSelected ]);

    useEffect(() => {
        setAssignedRoles(displayedRoles);
    }, [ displayedRoles ]);

    /**
     * The following useEffect will be triggered when the roles are updated.
     */
    useEffect(() => {
        if (!user) {
            return;
        }
        if (!hideApplicationRoles) {
            setDisplayedRoles(user.roles);
            mapUserRoles();
            resolveUserRoles();
            return;
        }
        setDisplayedRoles(
            user.roles.filter(
                (role) => role.display?.split("/").length !== 2 && role.display?.split("/")[ 0 ] !== "Application"
            )
        );
        mapUserRoles();
        resolveUserRoles();
    }, [ user ]);

    useEffect(() => {
        if (!user) {
            return;
        }
        setInitialLists();
    }, [ user.roles && primaryRoles ]);

    useEffect(() => {
        setPrimaryRolesLoading(true);
        getRolesList(null)
            .then((response) => {
                const roleResources = response.data.Resources;
                if (hideApplicationRoles) {
                    if (roleResources && roleResources instanceof Array) {
                        response.data.Resources = roleResources.filter((role: RolesInterface) => {
                            if (role.displayName?.includes(APPLICATION_DOMAIN)) {
                                return false;
                            }
                            return role;
                        });
                    }
                }
                setPrimaryRoles(response.data.Resources);
            })
            .finally(() => {
                setPrimaryRolesLoading(false);
            });
    }, []);

    /**
     * Resolves user roles depending on whether the separation is enabled.
     */
    const resolveUserRoles = (): void => {
        if (isGroupAndRoleSeparationEnabled) {
            setAssignedRoles(hideApplicationRoles ? displayedRoles : user?.roles);
        } else {
            const userRoles = [];

            user?.groups?.map((group) => {
                const displayName = group?.display?.split("/");

                if (
                    displayName?.length > 1 &&
                    (displayName[ 0 ] == APPLICATION_DOMAIN || displayName[ 0 ] == INTERNAL_DOMAIN)
                ) {
                    if (hideApplicationRoles && group[ 0 ] === "Application" && group.length === 2) {
                        return;
                    }
                    userRoles.push(group);
                }
            });
            setDisplayedRoles(userRoles);
            setAssignedRoles(userRoles);
        }
    };

    const setInitialLists = () => {
        const roleListCopy = primaryRoles ? [ ...primaryRoles ] : [];
        const addedRoles = [];

        if (roleListCopy && primaryRolesList) {
            const primaryRolesValues = Array.from(primaryRolesList?.values());

            forEachRight(roleListCopy, (role) => {
                if (primaryRolesValues?.includes(role.id)) {
                    addedRoles.push(role);
                }
            });
        }
        setSelectedRoleList(addedRoles);
        setRoleList(roleListCopy);
        setInitialRoleList(roleListCopy);
        setIsSelectAllRolesChecked(roleListCopy.length === addedRoles.length);
    };

    /**
     * The following function maps the role list of the user
     * the role map available. This is required as the format of the role
     * object differs from Users endpoint to Groups endpoint.
     */
    const mapUserRoles = () => {
        const rolesMap = new Map<string, string>();

        if (!isGroupAndRoleSeparationEnabled) {
            const groupsMap = new Map<string, string>();

            if (user.groups && user.groups instanceof Array) {
                forEachRight(user.groups, (group) => {
                    const groupName = group?.display?.split("/");

                    if (groupName?.length >= 1) {
                        if (hideApplicationRoles && group[ 0 ] === "Application" && group.length === 2) {
                            return;
                        }
                        groupsMap?.set(group.display, group.value);
                    }
                });
                setPrimaryRolesList(groupsMap);
            }

            return;
        }

        if (user.roles && user.roles instanceof Array) {
            forEachRight(user.roles, (roles) => {
                const role = roles?.display?.split("/");

                if (role?.length >= 1 && roles?.value) {
                    if (hideApplicationRoles && role[ 0 ] === "Application" && role.length === 2) {
                        return;
                    }
                    rolesMap.set(roles?.display, roles?.value);
                }
            });
            setPrimaryRolesList(rolesMap);
        }
    };

    const handelAddNewRoleModalClose = () => {
        setAddNewRoleModalView(false);
    };

    /**
     * This function handles updating the roles of the user.
     */
    const updateUserRole = (user: any, roles: any) => {
        const roleIds = [];

        roles.map((role) => {
            roleIds.push(role.id);
        });

        const bulkData: any = {
            Operations: [],
            failOnErrors: 1,
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ]
        };

        let removeOperation = {
            data: {
                Operations: [
                    {
                        op: "remove",
                        path: "users[value eq " + user.id + "]"
                    }
                ],
                schemas: [ "urn:ietf:params:scim:schemas:core:2.0:Role" ]
            },
            method: "PATCH"
        };

        let addOperation = {
            data: {
                Operations: [
                    {
                        op: "add",
                        value: {
                            users: [
                                {
                                    value: user.id
                                }
                            ]
                        }
                    }
                ],
                schemas: [ "urn:ietf:params:scim:schemas:core:2.0:Role" ]
            },
            method: "PATCH"
        };

        const removeOperations = [];
        const addOperations = [];
        let removedIds = [];
        const addedIds = [];

        if (primaryRolesList) {
            removedIds = [ ...primaryRolesList.values() ];
        }

        if (roleIds?.length > 0) {
            roleIds.map((roleId) => {
                if (removedIds?.includes(roleId)) {
                    removedIds.splice(removedIds.indexOf(roleId), 1);
                } else {
                    addedIds.push(roleId);
                }
            });
        }

        if (removedIds && removedIds?.length > 0) {
            removedIds.map((id) => {
                removeOperation = {
                    ...removeOperation,
                    ...{ path: "/Roles/" + id }
                };
                removeOperations.push(removeOperation);
            });

            removeOperations.map((operation) => {
                bulkData.Operations.push(operation);
            });
        }

        if (addedIds && addedIds?.length > 0) {
            addedIds.map((id) => {
                addOperation = {
                    ...addOperation,
                    ...{ path: "/Roles/" + id }
                };
                addOperations.push(addOperation);
            });

            addOperations.map((operation) => {
                bulkData.Operations.push(operation);
            });
        }

        updateResources(bulkData)
            .then((response) => {
                let description: string = null;

                try {
                    description = JSON.parse(response.data.Operations[1].response).scimType;
                }
                catch (e) {
                    description =  t(
                        "console:manage.features.user.updateUser.roles.notifications.updateUserRoles." +
                        "error.message"
                    )
                }
                if (response?.data?.Operations[0]?.status.code === 400 &&
                    response?.data?.Operations[1]?.status.code === 400
                ) {
                    onAlertFired({
                        description: description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.user.updateUser.roles.notifications.updateUserRoles." +
                            "error.message"
                        )
                    });
                    setInitialLists();
                } else if (response?.data?.Operations[0]?.status.code === 400 ||
                    response?.data?.Operations[1]?.status.code === 400
                ) {
                    onAlertFired({
                        description: description,
                        level: AlertLevels.WARNING,
                        message: t(
                            "console:manage.features.user.updateUser.roles.notifications.updateUserRoles." +
                            "error.message"
                        )
                    });
                    setInitialLists();
                } else {
                    onAlertFired({
                        description: t(
                            "console:manage.features.user.updateUser.roles.notifications.updateUserRoles." +
                            "success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.user.updateUser.roles.notifications.updateUserRoles." +
                            "success.message"
                        )
                    });
                    handelAddNewRoleModalClose();
                    handleUserUpdate(user.id);
                }
            })
            .catch((error) => {
                if (error?.response?.status === 404) {
                    return;
                }

                if (error?.response && error?.response?.data && error?.response?.data?.description) {
                    onAlertFired({
                        description: error.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.user.updateUser.roles.notifications.updateUserRoles." +
                            "error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "console:manage.features.user.updateUser.roles.notifications.updateUserRoles." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.user.updateUser.roles.notifications.updateUserRoles." +
                        "genericError.message"
                    )
                });
            });
    };

    const handleUnselectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

            roleList &&
                roleList.map((role) => {
                    isMatch = re.test(role.displayName);
                    if (!showDomain && role.displayName.split("/").length > 1) {
                        isMatch = re.test(role.displayName.split("/")[ 1 ]);
                    }
                    if (isMatch) {
                        filteredRoleList.push(role);
                        setRoleList(filteredRoleList);
                    }
                });
        } else {
            setRoleList(initialRoleList);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (role) => {
        const checkedRoles = [];

        checkedRoles.push(role);
        setSelectedRoleList(checkedRoles);
    };

    // Commented to temporarily remove the Select All option in roles selection.
    // Uncomment when the Select All option needs to be re-enabled.
    // /**
    //  * The following function enables the user to select all the roles at once.
    //  */
    // const selectAllRoles = () => {
    //     if (!isSelectAllRolesChecked) {
    //         setSelectedRoleList(roleList);
    //     } else {
    //         setSelectedRoleList([]);
    //     }
    //     setIsSelectAllRolesChecked(!isSelectAllRolesChecked);
    // };

    const handleOpenAddNewGroupModal = () => {
        setInitialLists();
        setAddNewRoleModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        setIsSelectAllRolesChecked(false);
        setAddNewRoleModalView(false);
    };

    /**
     * The following method handles creating a label for the list item.
     *
     * @param roleName: string
     */
    const createItemLabel = (roleName: string) => {
        const role = roleName?.split("/");
        if (role?.length > 0) {
            if (role[ 0 ] == "Application") {
                return {
                    labelColor: null,
                    labelText: "Application",
                    name: "application-label"
                };
            } else {
                return {
                    labelColor: null,
                    labelText: "Internal",
                    name: "internal-label"
                };
            }
        }
    };

    const handleViewRolePermission = () => {
        setViewRolePermissions(!viewRolePermissions);
        setSelection(false);
    };

    const handleRoleIdSet = (roleId) => {
        setRoleId(roleId);
        setSelection(true);
    };

    const addNewGroupModal = () => (
        <Modal data-testid="user-mgt-update-roles-modal" open={ showAddNewRoleModal } size="small" className="user-roles">
            <Modal.Header>
                { t("console:manage.features.user.updateUser.roles.addRolesModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("console:manage.features.user.updateUser.roles.addRolesModal.subHeading") }
                </Heading>
            </Modal.Header>
            { viewRolePermissions && (
                <>
                    <Modal.Content>
                        <RolePermissions
                            data-testid="user-mgt-update-roles-modal-unselected-role-permissions"
                            handleNavigateBack={ handleViewRolePermission }
                            roleId={ roleId }
                        />
                    </Modal.Content>
                    <Divider hidden />
                </>
            ) }
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid="user-mgt-update-roles-modal-cancel-button"
                                floated="left"
                                onClick={ handleCloseAddNewGroupModal }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }></Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    const handleAssignedRoleListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

            assignedRoles &&
                assignedRoles?.map((role) => {
                    const groupName = role?.display?.split("/");
                    if (groupName?.length >= 1) {
                        isMatch = re.test(role.display);
                        if (!showDomain && groupName?.length > 1) {
                            isMatch = re.test(groupName[ 1 ]);
                        }
                        if (isMatch) {
                            filteredRoleList.push(role);
                            setAssignedRoles(filteredRoleList);
                        }
                    }
                });
        } else {
            setAssignedRoles(displayedRoles);
        }
    };

    const handleCloseRolePermissionModal = () => {
        setRolePermissionModal(false);
        setRoleSelection(false);
    };

    const handleOpenRolePermissionModal = () => {
        setRolePermissionModal(true);
    };

    const handleSetSelectedId = (roleId: string) => {
        setSelectedRoleId(roleId);
        setRoleSelection(true);
    };

    const viewRolesPermissionModal = () => {
        return (
            <UserRolePermissions
                data-testid="user-mgt-roles-list-roles-permission-modal"
                openRolePermissionModal={ showRolePermissionModal }
                handleCloseRolePermissionModal={ handleCloseRolePermissionModal }
                roleId={ selectedRoleId }
                permissionsToHide={ permissionsToHide }
            />
        );
    };

    /**
     * This method checks whether there are roles selected for the user.
     */
    const checkRolesSelected = (): void => {
        if (selectedRoleList?.length > 1) {
            updateUserRole(user, selectedRoleList);
        } else {
            setShowDeleteConfirmationModal(true);
        }
    };

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            <EmphasizedSegment
                                clearing
                                data-testid="user-mgt-roles-list"
                                className="user-role-edit-header-segment"
                                padded="very"
                            >
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Heading as="h4">
                                                { t("console:manage.features.user.updateUser.roles.editRoles.heading") }
                                            </Heading>
                                            <Heading subHeading ellipsis as="h6">
                                                Add or remove the roles assigned to this user to control the user&apos;s
                                                access to different functionalities of the Console application.
                                            </Heading>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={ 10 } tablet={ 16 } mobile={ 16 }>
                                            { !isPrimaryRolesLoading ? (
                                                <EmphasizedSegment>
                                                    <Form.Group>
                                                        <Divider hidden />
                                                        {
                                                            roleList?.map((role, index) => {
                                                                const roleName: string[]
                                                                    = role?.displayName?.split("/");
                                                                if (
                                                                    roleName?.length >= 1 &&
                                                                    !roleName.includes("everyone") &&
                                                                    !roleName.includes("system") &&
                                                                    !roleName.includes("selfsignup")
                                                                ) {
                                                                    return (
                                                                        <>
                                                                            <Form.Radio
                                                                                onChange={ () =>
                                                                                    handleUnassignedItemCheckboxChange(
                                                                                        role)
                                                                                }
                                                                                key={ index }
                                                                                label={
                                                                                    roleName?.length > 1
                                                                                        ? roleName[ 1 ]
                                                                                        : roleName[ 0 ]
                                                                                }
                                                                                checked={
                                                                                    selectedRoleList.includes(role) }
                                                                                data-testid={
                                                                                    "user-mgt-update-roles-" +
                                                                                    "modal-unselected-roles"
                                                                                }
                                                                                readOnly={
                                                                                    !hasRequiredScopes(
                                                                                        featureConfig?.users,
                                                                                        featureConfig?.users
                                                                                            ?.scopes?.update,
                                                                                        allowedScopes
                                                                                    )
                                                                                }
                                                                            />
                                                                            <Divider hidden />
                                                                        </>
                                                                    );
                                                                }
                                                            })
                                                        }
                                                    </Form.Group>
                                                </EmphasizedSegment>
                                            ) : (
                                                    <ContentLoader />
                                                ) }
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Show when={ AccessControlConstants.USER_WRITE }>
                                                <PrimaryButton
                                                    data-testid="user-mgt-update-roles-modal-save-button"
                                                    floated="left"
                                                    onClick={ () => checkRolesSelected() }
                                                >
                                                    { t("common:update") }
                                                </PrimaryButton>
                                            </Show>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </EmphasizedSegment>
                        }
                    </Grid.Column>
                </Grid.Row>
                { viewRolesPermissionModal() }
                { addNewGroupModal() }
            </Grid>
            { showDeleteConfirmationModal && (
                <ConfirmationModal
                    data-testid="user-mgt-update-roles-confirmation-modal"
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="warning"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t(
                        "console:manage.features.user.updateUser.roles.editRoles" + ".confirmationModal.assertionHint"
                    ) }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => {
                        updateUserRole(user, selectedRoleList);
                        setShowDeleteConfirmationModal(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-testid="user-mgt-update-roles-confirmation-modal-header">
                        { t("console:manage.features.user.updateUser.roles.editRoles.confirmationModal" + ".header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        data-testid="user-mgt-update-roles-confirmation-modal-message"
                        attached
                        warning
                    >
                        { t("console:manage.features.user.updateUser.roles.editRoles.confirmationModal" + ".message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-testid="user-mgt-update-roles-confirmation-modal-content">
                        { t("console:manage.features.user.updateUser.roles.editRoles.confirmationModal" + ".content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

/**
 * Default props for the component.
 */
UserRolesList.defaultProps = {
    hideApplicationRoles: false,
    showDomain: true
};
