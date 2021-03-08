/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    Heading,
    Hint,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import _ from "lodash";
import React, {
    Dispatch,
    FormEvent,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Header } from "semantic-ui-react";
import { GroupBasics } from "./group-basics";
import { UIConstants, UserBasicInterface, getUsersList } from "../../../../features/core";
import { GroupsMemberInterface } from "../../../../features/groups/models";

/**
 * Proptypes for the application consents list component.
 */
interface AddGroupUserProps extends TestableComponentInterface {
    triggerSubmit?: boolean;
    onSubmit?: ({ basic, users }: { basic: any; users: UserBasicInterface[] }) => void;
    assignedUsers?: GroupsMemberInterface[];
    isEdit: boolean;
    userStore?: string;
    initialValues?: { basic: any; users: UserBasicInterface[] };
    onUserFetchRequestFinish?: () => void;
}

export const AddGroupUsers: FunctionComponent<AddGroupUserProps> = (props: AddGroupUserProps): ReactElement => {
    const {
        triggerSubmit,
        onSubmit,
        assignedUsers,
        initialValues,
        userStore,
        onUserFetchRequestFinish,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ initialUserList, setInitialUserList ] = useState<UserBasicInterface[]>([]);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ isUsersFetchRequestLoading, setIsUsersFetchRequestLoading ] = useState<boolean>(true);

    const [ isSelectAllAssignedUsers, setIsSelectAllAssignedUsers ] = useState<boolean>(false);

    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);

    useEffect(() => {
        if (isSelectAllAssignedUsers) {
            setCheckedAssignedListItems(usersList);
        } else {
            setCheckedAssignedListItems([]);
        }
    }, [ isSelectAllAssignedUsers ]);

    /**
     * Select all assigned users
     */
    const selectAllAssignedList = () => {
        setIsSelectAllAssignedUsers(!isSelectAllAssignedUsers);
    };

    const getList = (limit: number, offset: number, filter: string, attribute: string, userStore: string) => {

        setIsUsersFetchRequestLoading(true);

        getUsersList(limit, offset, filter, attribute, userStore)
            .then((response) => {
                const responseUsers = response.Resources;
                responseUsers.sort((userObject, comparedUserObject) =>
                    userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                );
                setUsersList(responseUsers);
                setInitialUserList(responseUsers);

                if (assignedUsers && assignedUsers.length !== 0) {
                    const selectedUserList: UserBasicInterface[] = [];
                    if (responseUsers && responseUsers instanceof Array ) {
                        responseUsers.slice().reverse().forEach(user => {
                            assignedUsers.forEach(assignedUser => {
                                if (user.id === assignedUser.value) {
                                    selectedUserList.push(user);
                                    responseUsers.splice(responseUsers.indexOf(user), 1);
                                }
                            });
                        });
                        selectedUserList.sort((userObject, comparedUserObject) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                        );
                    }
                }

                if (initialValues && initialValues.users && initialValues.users instanceof Array) {
                    const selectedUserList: UserBasicInterface[] = [];
                    if (responseUsers && responseUsers instanceof Array ) {
                        responseUsers.forEach(user => {
                            initialValues.users.forEach(assignedUser => {
                                if (user.id === assignedUser.id) {
                                    selectedUserList.push(user);
                                }
                            });
                        });
                        selectedUserList.sort((userObject, comparedUserObject) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                        );
                        setUsersList(responseUsers.filter(function(user) {
                            return selectedUserList.indexOf(user) == -1;
                        }));
                    }
                }
            })
            .finally(() => {
                setIsUsersFetchRequestLoading(false);
                onUserFetchRequestFinish();
            });
    };

    useEffect(() => {
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        setUserListMetaContent(new Map<string, string>([
            ["name", "name"],
            ["emails", "emails"],
            ["name", "name"],
            ["userName", "userName"],
            ["id", ""],
            ["profileUrl", "profileUrl"],
            ["meta.lastModified", "meta.lastModified"],
            ["meta.created", ""]
        ]));
    }, []);

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @return string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray = [];
        const iterator1 = attributeMap[Symbol.iterator]();

        for (const attribute of iterator1) {
            if (attribute !== "") {
                attArray.push(attribute);
            }
        }

        return attArray.toString();
    };

    useEffect(() => {
        if (userListMetaContent) {
            const attributes = generateAttributesString(userListMetaContent.values());
            getList(listItemLimit, listOffset, null, attributes, userStore);
        }
    }, [ listOffset, listItemLimit ]);

    const handleSearchFieldChange = (e: FormEvent<HTMLInputElement>, query: string, list: UserBasicInterface[],
                                     stateAction: Dispatch<SetStateAction<any>>) => {

        let isMatch: boolean = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!_.isEmpty(query)) {
            const regExp = new RegExp(_.escapeRegExp(query), "i");

            list && list.map((user: UserBasicInterface) => {
                isMatch = regExp.test(user.userName);

                if (isMatch) {
                    filteredRoleList.push(user);
                }
            });

            stateAction(filteredRoleList);

            return;
        }

        stateAction(list);

        return;
    };

    const handleAssignedItemCheckboxChange = (role) => {
        const checkedGroups = [ ...checkedAssignedListItems ];

        if (checkedGroups.includes(role)) {
            checkedGroups.splice(checkedGroups.indexOf(role), 1);
            setCheckedAssignedListItems(checkedGroups);
        } else {
            checkedGroups.push(role);
            setCheckedAssignedListItems(checkedGroups);
        }
    };

    return (
        <>
            <GroupBasics
                data-testid="add-group-form"
                triggerSubmit={ triggerSubmit }
                initialValues={ initialValues?.basic }
                onSubmit={ (values) => {
                    onSubmit({
                        basic: values,
                        users: checkedAssignedListItems
                    });
                } }
            />
            <Heading as="h5" className="mt-3">Add Users</Heading>
            <Hint>
                { t("console:manage.features.roles.addRoleWizard.users.assignUserModal.hint") }
            </Hint>
            <TransferComponent
                compact
                basic
                bordered
                className="one-column-selection"
                selectionComponent
                searchPlaceholder={
                    t("console:manage.features.roles.addRoleWizard.users.assignUserModal.list" +
                        ".searchPlaceholder")
                }
                isLoading={ isUsersFetchRequestLoading }
                handleHeaderCheckboxChange={ selectAllAssignedList }
                isHeaderCheckboxChecked={ isSelectAllAssignedUsers }
                handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                    handleSearchFieldChange(e, value, initialUserList, setUsersList);
                } }
                showSelectAllCheckbox={ !isUsersFetchRequestLoading && usersList?.length > 0 }
                data-testid={ `${ testId }-transfer-component` }
            >
                <TransferList
                    selectionComponent
                    isListEmpty={ !isUsersFetchRequestLoading && usersList?.length < 1 }
                    isLoading={ isUsersFetchRequestLoading }
                    listType="unselected"
                    selectAllCheckboxLabel="Select all users"
                    emptyPlaceholderContent="There are no available users that can be assigned to this group at the moment."
                    data-testid={ `${ testId }-unselected-transfer-list` }
                >
                    {
                        usersList?.map((user: UserBasicInterface, index: number) => {
                            const resolvedGivenName: string = (user.name && user.name.givenName !== undefined)
                                ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                                : undefined;

                            const resolvedUsername: string = user.userName.split("/")?.length > 1
                                ? user.userName.split("/")[ 1 ]
                                : user.userName.split("/")[ 0 ];

                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleAssignedItemCheckboxChange(user) }
                                    key={ index }
                                    listItem={ resolvedGivenName ?? resolvedUsername }
                                    listItemId={ user.id }
                                    listItemIndex={ index }
                                    isItemChecked={ checkedAssignedListItems.includes(user) }
                                    showSecondaryActions={ false }
                                    showListSubItem={ true }
                                    listSubItem={ resolvedGivenName && (
                                        <Header as="h6">
                                            <Header.Content>
                                                <Header.Subheader data-testid={ `${ testId }-item-sub-heading` }>
                                                    { resolvedUsername }
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    ) }
                                    data-testid={ `${ testId }-unselected-transfer-list-item-${ index }` }
                                />
                            );
                        })
                    }
                </TransferList>
            </TransferComponent>
        </>
    );
};
