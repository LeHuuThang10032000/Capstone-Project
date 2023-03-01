import _ from 'lodash';
import { Button } from 'native-base';
import * as React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import EText from './EText';
import Icons from './Icons';

export interface ECheckboxData {
    [key: string]: any;
}

/**
 * ECheckboxProps
 */

interface ECheckboxProps {
    /**
     * name of checkbox
     */
    name: string;
    /**
     * default checked
     */
    defaultChecked?: boolean;
    /**
     * value. Default false
     */
    value?: boolean;
    /**
     * disabled checkbox
     */
    disabled?: boolean;
    /**
     * checkbox uncheck style
     */
    _uncheck?: StyleProp<ViewStyle>;
    /**
     * checkbox checked style
     */
    _checked?: StyleProp<ViewStyle>;
    /**
     * children
     */
    children?: React.ReactNode;
    /**
     * container style. A view wrap checkbox and children
     */
    _container?: StyleProp<ViewStyle>;
    /**
     * onChange
     */
    onChange?: (data: ECheckboxData) => void;
    /**
     * semi check
     */
    semiCheck?: boolean;
}

/**
 * ECheckbox
 * @param props ECheckboxProps
 * @returns JSX.Element
 */
const ECheckbox = (props: ECheckboxProps): JSX.Element => {
    const [checked, setChecked] = React.useState(props.defaultChecked);

    React.useEffect(() => {
        setChecked(props.value);
    }, [props.value]);

    /**
     * onCheckboxChange
     */
    const onCheckboxChange = React.useCallback(() => {
        setChecked(prev => !prev);
        props?.onChange?.({ [props.name]: !checked });
    }, [checked, props]);

    return React.useMemo(
        () => (
            <View style={[props._container]}>
                <TouchableWithoutFeedback onPress={onCheckboxChange} disabled={props.disabled || false}>
                    <View
                        style={[
                            StyleSheet.flatten([styles.uncheck, props._uncheck]),
                            props.semiCheck
                                ? StyleSheet.flatten([styles.semi, props._checked])
                                : checked && StyleSheet.flatten([styles.checked, props._checked]),
                        ]}
                    >
                        {!props.semiCheck ? (
                            checked && <Icons.PrimaryChecked fill={'#ffffff'} width={'100%'} height={'100%'} />
                        ) : (
                            <View style={styles.semiStyle} />
                        )}
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={onCheckboxChange} disabled={props.disabled || false}>
                    {typeof props.children === 'string' ? <EText>{props.children}</EText> : props.children}
                </TouchableWithoutFeedback>
            </View>
        ),
        [
            checked,
            onCheckboxChange,
            props._checked,
            props._uncheck,
            props.children,
            props._container,
            props.disabled,
            props.semiCheck,
        ],
    );
};

export default ECheckbox;

/**
 * ECheckboxGroupProps
 */
interface ECheckboxGroupProps {
    /**
     * group name
     */
    name: string;
    /**
     * group children
     */
    children?: React.ReactElement<ECheckboxProps> | React.ReactElement<ECheckboxProps>[];
    /**
     * group parent
     */
    parent?: React.ReactElement<ECheckboxProps>;
    /**
     * container style, a View wrap parent Checkbox and children
     */
    _container?: StyleProp<ViewStyle>;
    /**
     * children container style, a View wrap all children
     */
    _childContainer?: StyleProp<ViewStyle>;
    /**
     * group change value event
     */
    onChange?: (value?: ECheckboxData) => void;
    /**
     * showToggleButton
     */
    showToggleButton?: boolean;
    /**
     * toggleComponent
     */
    toggleComponent?: React.ElementType;
    /**
     * footerComponent
     */
    footerComponent?: React.ReactNode;
}

/**
 * ECheckboxGroup
 * @param props ECheckboxGroupProps
 * @returns JSX.Element
 */
export const ECheckboxGroup = React.memo((props: ECheckboxGroupProps): JSX.Element => {
    const children = React.useMemo(
        () => (props.children ? (Array.isArray(props.children) ? props.children : [props.children]) : []),
        [props.children],
    );
    const groupName = React.useMemo(() => props.name, [props.name]);
    const [groupValue, setGroupValue] = React.useState<{ [key: string]: boolean }>({});
    const [showChildren, setShowChildren] = React.useState(false);

    /**
     * onInitGroup
     */
    const onInitGroup = React.useCallback(() => {
        const items = children.reduce((result, item) => {
            return {
                ...result,
                [item.props.name]: item.props.defaultChecked,
                [item.props.name]: item.props.value,
            };
        }, {});

        setGroupValue({ ...items });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children]);

    React.useEffect(() => {
        onInitGroup();
    }, [onInitGroup]);

    /**
     * onParentValueChange
     */
    const onParentValueChange = React.useCallback(
        (value: ECheckboxData) => {
            if (_.isEmpty(groupValue)) {
                // emit
                props.onChange?.(value);
            } else {
                const newValue = Object.keys(groupValue).reduce((result, item) => {
                    return {
                        ...result,
                        [item]: value[groupName],
                    };
                }, {});
                setGroupValue({ ...newValue });
            }
        },
        [groupName, groupValue, props],
    );

    /**
     * onChildValueChange
     * @param data ECheckboxData
     */
    const onChildValueChange = React.useCallback(
        (value: ECheckboxData) => {
            // merge child's value into current group value
            const merged = _.merge(groupValue, value);

            // update current group value
            setGroupValue({ ...merged });

            // emit
            props.onChange?.({ [props.name]: { ...merged } });
        },
        [groupValue, props],
    );

    // check parent group is semi check
    const isSemiCheck = React.useMemo(() => {
        // all checkbox are checked
        const allChecked = Object.values(groupValue).every(item => item === true);

        // some checkbox are checked
        const someChecked = Object.values(groupValue).some(item => item === true);

        // return true if all checkbox are checked === false and some checkbox are check === true
        return !allChecked && someChecked;
    }, [groupValue]);

    // is parent checked
    const isParentChecked = React.useMemo(() => {
        if (_.isEmpty(groupValue)) {
            return false;
        } else {
            const check = Object.values(groupValue).every(item => item && item === true);
            const uncheck = Object.values(groupValue).every(item => item === false);
            if (check || uncheck) {
                props.onChange?.({ [props.name]: check ? true : false });
            }
            return check;
        }
    }, [groupValue, props]);

    /**
     * toggleList
     */
    const toggleList = React.useCallback(() => {
        setShowChildren(prev => !prev);
    }, []);

    const ToggleElement = props.toggleComponent;

    return React.useMemo(() => {
        return (
            <View style={props._container}>
                {props.parent && (
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        {React.cloneElement(props.parent, {
                            onChange: onParentValueChange,
                            semiCheck: isSemiCheck,
                            value: !!isParentChecked,
                        })}
                        {props.showToggleButton &&
                            (ToggleElement ? (
                                <TouchableOpacity activeOpacity={1} onPress={toggleList}>
                                    <ToggleElement toggleValue={showChildren} />
                                </TouchableOpacity>
                            ) : (
                                <Button onPress={toggleList} variant={'unstyled'} padding={0}>
                                    {showChildren ? <Icons.ArrowUpIcon /> : <Icons.ArrowDownIcon />}
                                </Button>
                            ))}
                    </View>
                )}
                {showChildren && (
                    <View style={props._childContainer}>
                        {children.length > 0 &&
                            React.Children.map(children, child =>
                                React.cloneElement(child, {
                                    onChange: onChildValueChange,
                                    value: groupValue[child.props.name],
                                }),
                            )}
                        {props.footerComponent && props.footerComponent}
                    </View>
                )}
            </View>
        );
    }, [
        props._container,
        props.parent,
        props.showToggleButton,
        props._childContainer,
        props.footerComponent,
        onParentValueChange,
        isSemiCheck,
        isParentChecked,
        ToggleElement,
        toggleList,
        showChildren,
        children,
        onChildValueChange,
        groupValue,
    ]);
});

ECheckboxGroup.displayName = 'ECheckboxGroup';

const styles = StyleSheet.create({
    uncheck: {
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#242A3769',
        backgroundColor: '#fff',
        borderRadius: 3,
        position: 'relative',
        width: 20,
        height: 20,
    },
    checked: {
        overflow: 'hidden',
        borderWidth: 0,
        padding: 3,
        borderColor: '#4285F4',
        backgroundColor: '#4285F4',
    },
    semi: {
        borderColor: '#4285F4',
        padding: 2,
    },
    semiStyle: {
        backgroundColor: '#4285F4',
        flex: 1,
        borderRadius: 1,
    },
});
