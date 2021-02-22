/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    AppState,
    FeatureConfigInterface,
    SharedUserStoreUtils,
    getEmptyPlaceholderIllustrations
} from "../../../../features/core";
import { RealmConfigInterface } from "../../../../features/server-configurations";
import { UserListInterface } from "../../../../features/users";
import { AllUsersList } from "../components";

/**
 * Props for the all users listing page.
 */
interface AllUsersLIstPageInterface extends TestableComponentInterface {
    allUsersList: UserListInterface;
    getAllUsersList: (limit: number, offset: number, filter: string, attribute: string, domain: string) => void;
    userMetaListContent?: Map<string, string>;
    handleMetaContentChange?: () => void;
    handleAddWizardModalShow: (value: boolean) => void;
    isUserListRequestLoading: boolean;
    realmConfigs: RealmConfigInterface;
}

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 * @type {number}
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;

/**
 * Users info page.
 *
 * @param {UsersPageInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
const AllUsersPage: FunctionComponent<AllUsersLIstPageInterface> = (
    props: AllUsersLIstPageInterface
): ReactElement => {

    const {
        allUsersList,
        realmConfigs,
        getAllUsersList,
        userMetaListContent,
        handleAddWizardModalShow,
        isUserListRequestLoading,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ usersList, setUsersList ] = useState<UserListInterface>({});
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ userStoreError, setUserStoreError ] = useState(false);

    // TODO: Check this to enable guest user creation.
    // useEffect(() => {
    //     if (init.current) {
    //         init.current = false;
    //     } else {
    //         if (emailVerificationEnabled !== undefined) {
    //             setShowWizard(true);
    //         }
    //     }
    // }, [ emailVerificationEnabled ]);

    useEffect(() => {
        if (!allUsersList) {
            return;
        }

        setUsersList(allUsersList);
    }, [ allUsersList ]);

    useEffect(() => {
        SharedUserStoreUtils.getReadOnlyUserStores().then((response) => {
            setReadOnlyUserStoresList(response);
        });
    }, []);

    // TODO: Enable this once the Data table component issue is fixed.
    // /**
    //  * The following method set the list of columns selected by the user to
    //  * the state.
    //  *
    //  * @param metaColumns - string[]
    //  */
    // const handleMetaColumnChange = (metaColumns: string[]) => {
    //     metaColumns.push("profileUrl");
    //     const tempColumns = new Map<string, string>();
    //     setUserMetaColumns(metaColumns);
    //
    //     metaColumns.map((column) => {
    //         tempColumns.set(column, column);
    //     });
    //     setUserListMetaContent(tempColumns);
    //     setListUpdated(true);
    // };

    return (
        <>
            {
                userStoreError
                    ? ( <EmptyPlaceholder
                            subtitle={ [ t("console:manage.features.users.placeholders.userstoreError.subtitles.0"),
                                t("console:manage.features.users.placeholders.userstoreError.subtitles.1") ] }
                            title={ t("console:manage.features.users.placeholders.userstoreError.title") }
                            image={ getEmptyPlaceholderIllustrations().genericError }
                            imageSize="tiny"
                        />
                    ) : (
                        <AllUsersList
                            getAllUsersList={
                                (
                                    limit, offset, filter, attribute, domain
                                ) => getAllUsersList(limit, offset, filter, attribute, domain)
                            }
                            isUserListRequestLoading={ isUserListRequestLoading }
                            allUsersList={ usersList }
                            userMetaListContent={ userMetaListContent }
                            isLoading={ isUserListRequestLoading }
                            realmConfigs={ realmConfigs }
                            onEmptyListPlaceholderActionClick={ () => handleAddWizardModalShow(true) }
                            data-testid="user-mgt-user-list"
                            readOnlyUserStores={ readOnlyUserStoresList }
                            featureConfig={ featureConfig }
                        />
                    )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
AllUsersPage.defaultProps = {
    "data-testid": "asgardeo-all-users-list"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AllUsersPage;
