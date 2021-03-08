/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, GenericIconProps, Heading, Text } from "@wso2is/react-components";
import isEmpty from "lodash/isEmpty";
import kebabCase from "lodash/kebabCase";
import React, { ReactElement, ReactNode } from "react";
import { Card, Divider } from "semantic-ui-react";

/**
 * Proptypes for the Technology Selection component.
 */
interface TechnologySelectionPropsInterface<T> extends TestableComponentInterface {
    onSelectedTechnologyChange: (technology: T) => void;
    technologies: TechnologyInterface<T>[];
}

interface TechnologyInterface<T> extends TestableComponentInterface {
    className?: string;
    type: T;
    logo: ReactNode | GenericIconProps;
    displayName: string;
}

/**
 * Technology Selection component.
 * TODO: Add localization support. (https://github.com/wso2-enterprise/asgardeo-product/issues/209)
 *
 * @param {TechnologySelectionPropsInterface<T>} props
 * @return {React.ReactElement}
 * @constructor
 */
export const TechnologySelection: <T>(props: TechnologySelectionPropsInterface<T>) => ReactElement = <
    T extends unknown
    >(
        props: TechnologySelectionPropsInterface<T>
): ReactElement => {

    const {
        onSelectedTechnologyChange,
        technologies,
        [ "data-testid" ]: testId
    } = props;

    return (
        <div data-testid={ testId }>
            <Heading as="h2" className="mb-1" compact>Which technology are you using?</Heading>
            <Text muted>
                We will guide you through setting up login for an application step by step.
            </Text>
            <Divider hidden/>
            {
                (!isEmpty(technologies) && Array.isArray(technologies) && technologies.length > 0) && (
                    <Card.Group
                        centered
                        className="tech-selection-cards mt-3"
                        itemsPerRow={ 9 }
                    >
                        {
                            technologies.map((technology: TechnologyInterface<T>, index: number) => (
                                <Card
                                    key={ index }
                                    raised={ false }
                                    data-testid={
                                        technology[ "data-testid" ]
                                            ?? `technology-card-${ kebabCase(technology.displayName) }`
                                    }
                                    className="basic-card tech-selection"
                                    onClick={ () => onSelectedTechnologyChange(technology.type) }
                                >
                                    <Card.Content textAlign="center">
                                        <GenericIcon
                                            transparent
                                            size="x50"
                                            className="mb-2"
                                            icon={ technology.logo }
                                        />
                                        <Card.Description>
                                            { technology.displayName }
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Card.Group>
                )
            }
        </div>
    );
};
