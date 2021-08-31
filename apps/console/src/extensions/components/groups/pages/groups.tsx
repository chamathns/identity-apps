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

import { AlertInterface, AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EmptyPlaceholder,
    GridLayout,
    ListLayout,
    PageLayout,
    PrimaryButton,
} from "@wso2is/react-components";
import find from "lodash-es/find";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    AppUtils,
    FeatureConfigInterface,
    SharedUserStoreUtils,
    UIConstants,
    getEmptyPlaceholderIllustrations,
} from "../../../../features/core";
import {
    deleteGroupById,
    getGroupListExcludingMembers,
    searchGroupList,
    GroupsInterface,
    SearchGroupInterface
} from "../../../../features/groups";
import { GroupList } from "../groups-list";
import { CreateGroupWizard } from "../wizard";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import { StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { CONSUMER_USERSTORE } from "../../../../features/userstores";
import { EventPublisher } from "../../../../features/core/utils";

const GROUPS_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

/**
 * React component to list User Groups.
 *
 * @return {ReactElement}
 */
const GroupsPage: FunctionComponent<any> = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ isGroupsListRequestLoading, setGroupsListRequestLoading ] = useState<boolean>(false);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ groupsError, setGroupsError ] = useState<boolean>(false);

    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>([]);
    const [ paginatedGroups, setPaginatedGroups ] = useState<GroupsInterface[]>([]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(GROUPS_SORTING_OPTIONS[ 0 ]);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (isListUpdated) {
            getGroups();
            setListUpdated(false);
        }
    }, [ isListUpdated ]);

    useEffect(() => {
        getGroups();
    }, [ userStore ]);

    useEffect(() => {
        SharedUserStoreUtils.getReadOnlyUserStores().then((response) => {
            setReadOnlyUserStoresList(response);
        });
    }, [ userStore ]);

    const getGroups = () => {
        setGroupsListRequestLoading(true);

        getGroupListExcludingMembers(userStore)
            .then((response) => {
                if (response.status === 200) {
                    const groupResources = response.data.Resources;
                    if (groupResources && groupResources instanceof Array && groupResources.length !== 0) {
                        const updatedResources = groupResources.filter((role: GroupsInterface) => {
                            return role.displayName.includes(CONSUMER_USERSTORE + "/");
                        });
                        response.data.Resources = updatedResources;
                        setGroupsList(updatedResources);
                        setGroupsPage(0, listItemLimit, updatedResources);
                    } else {
                        setPaginatedGroups([]);
                    }
                    setGroupsError(false);
                } else {
                    dispatch(addAlert({
                        description: t("console:manage.features.groups.notifications." +
                            "fetchGroups.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
                    }));
                    setGroupsError(true);
                    setGroupsList([]);
                    setPaginatedGroups([]);
                }
            }).catch((error) => {
            dispatch(addAlert({
                description: error?.response?.data?.description ?? error?.response?.data?.detail
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.response?.data?.message
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
            }));
            setGroupsError(true);
            setGroupsList([]);
            setPaginatedGroups([]);
        })
            .finally(() => {
                setGroupsListRequestLoading(false);
                setLoading(false);
            });
    };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(find(GROUPS_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    const searchRoleListHandler = (searchQuery: string) => {
        const searchData: SearchGroupInterface = {
            filter: searchQuery,
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1
        };

        setSearchQuery(searchQuery);

        searchGroupList(searchData).then(response => {
            if (response.status === 200) {
                const results = response.data.Resources;
                let updatedResults = [];
                if (results) {
                    updatedResults = results.filter((role: RolesInterface) => {
                        return role.displayName.includes(CONSUMER_USERSTORE + "/");
                    });
                }
                setGroupsList(updatedResults);
                setPaginatedGroups(updatedResults);
            }
        });
    };

    /**
     * Util method to paginate retrieved email template type list.
     *
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     * @param list - Role list.
     */
    const setGroupsPage = (offsetValue: number, itemLimit: number, list: GroupsInterface[]) => {
        setPaginatedGroups(list?.slice(offsetValue, itemLimit + offsetValue));
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setGroupsPage(offsetValue, listItemLimit, groupList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setGroupsPage(listOffset, data.value as number, groupList);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     *
     * @param role - Role which needs to be deleted
     */
    const handleOnDelete = (role: RolesInterface): void => {
        deleteGroupById(role.id).then(() => {
            handleAlerts({
                description: t(
                    "console:manage.features.groups.notifications.deleteGroup.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.groups.notifications.deleteGroup.success.message"
                )
            });
            setListUpdated(true);
        }).catch(() => {
            handleAlerts({
                description: t(
                    "console:manage.features.groups.notifications.deleteGroup.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.groups.notifications.deleteGroup.error.message"
                )
            });
        });
    };

    /**
     * Handles the `onFilter` callback action from the
     * roles search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === null || query === "displayName sw ") {
            getGroups();
            return;
        }

        searchRoleListHandler(query);
    };

    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            data-testid="group-mgt-groups-list-advanced-search"
            onFilter={ handleUserFilter  }
            filterAttributeOptions={ [
                {
                    key: 0,
                    text: "Name",
                    value: "displayName"
                }
            ] }
            filterAttributePlaceholder={
                t("console:manage.features.groups.advancedSearch.form.inputs.filterAttribute.placeholder")
            }
            filterConditionsPlaceholder={
                t("console:manage.features.groups.advancedSearch.form.inputs.filterCondition" +
                    ".placeholder")
            }
            filterValuePlaceholder={
                t("console:manage.features.groups.advancedSearch.form.inputs.filterValue" +
                    ".placeholder")
            }
            placeholder={ t("console:manage.features.groups.advancedSearch.placeholder") }
            defaultSearchAttribute="displayName"
            defaultSearchOperator="co"
            triggerClearQuery={ triggerClearQuery }
        />
    );

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        getGroups();
    };

    return (
        <PageLayout
            action={
                !isLoading && ((isGroupsListRequestLoading || !(!searchQuery && paginatedGroups?.length <= 0)) && 
                    hasRequiredScopes(featureConfig?.groups, featureConfig?.groups?.scopes?.create, allowedScopes))
                && (
                    <PrimaryButton
                        loading={ isGroupsListRequestLoading }
                        disabled={ isGroupsListRequestLoading }
                        data-testid="group-mgt-groups-list-add-button"
                        onClick={ () => {
                            eventPublisher.publish("manage-groups-click-create-new-group");
                            setShowWizard(true);
                        } }
                    >
                        <Icon name="add"/>
                        { t("console:manage.features.roles.list.buttons.addButton", { type: "Group" }) }
                    </PrimaryButton>
                )
            }
            title="Groups"
            description="Group your customers and collectively manage access rights."
        >
            <GridLayout
                isLoading={ isLoading }
                showTopActionPanel={ false }
            >
                <ListLayout
                    advancedSearch={ advancedSearchFilter() }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleListSortingStrategyOnChange }
                    sortStrategy={ listSortingStrategy }
                    showPagination={ paginatedGroups.length > 0  }
                    showTopActionPanel={ isGroupsListRequestLoading
                    || !(!searchQuery
                        && !groupsError
                        && userStoreOptions.length < 3
                        && paginatedGroups?.length <= 0) }
                    totalPages={ Math.ceil(groupList?.length / listItemLimit) }
                    totalListSize={ groupList?.length }
                >
                    { groupsError
                        ? <EmptyPlaceholder
                            subtitle={ [ t("console:manage.features.groups.placeholders.groupsError.subtitles.0"),
                                t("console:manage.features.groups.placeholders.groupsError.subtitles.1") ] }
                            title={ t("console:manage.features.groups.placeholders.groupsError.title") }
                            image={ getEmptyPlaceholderIllustrations().genericError }
                            imageSize="tiny"
                        /> :
                        <GroupList
                            advancedSearch={ advancedSearchFilter() }
                            data-testid="group-mgt-groups-list"
                            handleGroupDelete={ handleOnDelete }
                            isLoading={ isGroupsListRequestLoading }
                            onEmptyListPlaceholderActionClick={ () => {
                                eventPublisher.publish("manage-groups-click-create-new-group");
                                setShowWizard(true);
                            } }
                            onSearchQueryClear={ handleSearchQueryClear }
                            groupList={ paginatedGroups }
                            searchQuery={ searchQuery }
                            readOnlyUserStores={ readOnlyUserStoresList }
                            featureConfig={ featureConfig }
                        />
                    }
                </ListLayout>
            </GridLayout>
            {
                showWizard && (
                    <CreateGroupWizard
                        data-testid="group-mgt-create-group-wizard"
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
                        requiredSteps={ [ "BasicDetails" ] }
                        submitStep={ "BasicDetails" }
                    />
                )
            }
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GroupsPage;
