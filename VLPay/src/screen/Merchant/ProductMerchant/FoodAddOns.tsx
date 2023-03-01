import { t } from 'i18next';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionSheet, EButton, ECheckbox, EInput, EText, Icons } from '../../components';
import { ActionSheetContext, ActionSheetRef } from '../../components/ActionSheet';
import { AppDialogRef } from './AppDialog';
import { ECheckboxData } from '../../../components/ECheckbox';
import GlobalRef from '../../helper/globalRefs';
import Selector from './Selector';
import { MAX_FOOD_PRICE } from '../../../components/helper/constants';
import Helper from '../../../components/helpers/helper';

/**
 * GroupAddOnProps
 */
interface GroupAddOnProps extends AddOnModel {
    selectedAddOns: FoodAddOn[];
    onGroupAddOnValueChange: any;
    onChangeGroupAddOnName: any;
    onToppingMenuPress: any;
    onAddOnItemValueChange: any;
    onChangeAddOnName: any;
    onChangeAddOnPrice: any;
    onDeleteAddOnItemPress: any;
    onAddItemIntoGroupAddOnPress: () => void;
}

/**
 * GroupAddOn
 * @param props GroupAddOnProps
 * @returns JSX.Element
 */
const GroupAddOn = (props: GroupAddOnProps): JSX.Element => {
    const selectedAddOns = React.useMemo(() => props.selectedAddOns || [], [props.selectedAddOns]);
    const groupItem = React.useMemo(() => props, [props]);
    const onGroupAddOnValueChange = React.useMemo(() => props.onGroupAddOnValueChange, [props.onGroupAddOnValueChange]);
    const onChangeGroupAddOnName = React.useMemo(() => props.onChangeGroupAddOnName, [props.onChangeGroupAddOnName]);
    const onToppingMenuPress = React.useMemo(() => props.onToppingMenuPress, [props.onToppingMenuPress]);
    const onAddOnItemValueChange = React.useMemo(() => props.onAddOnItemValueChange, [props.onAddOnItemValueChange]);
    const onChangeAddOnName = React.useMemo(() => props.onChangeAddOnName, [props.onChangeAddOnName]);
    const onChangeAddOnPrice = React.useMemo(() => props.onChangeAddOnPrice, [props.onChangeAddOnPrice]);
    const onDeleteAddOnItemPress = React.useMemo(() => props.onDeleteAddOnItemPress, [props.onDeleteAddOnItemPress]);
    const onAddItemIntoGroupAddOnPress = React.useMemo(
        () => props.onAddItemIntoGroupAddOnPress,
        [props.onAddItemIntoGroupAddOnPress],
    );
    const key = React.useMemo(() => groupItem.id || groupItem.itemId, [groupItem.id, groupItem.itemId]);

    const [showChildren, setShowChildren] = React.useState(false);
    const { serviceText, appConfig } = useApp();

    /**
     * toggleChildren
     */
    const toggleChildren = React.useCallback(() => {
        setShowChildren(prev => !prev);
    }, []);

    /**
     * checkGroupIsSemi
     * @param group AddOnModel
     */
    const checkGroupIsSemi = React.useCallback(
        (group: AddOnModel) => {
            const groupLength = (group.addOns || []).length;
            const id = group.id || group.itemId;
            if (groupLength) {
                const findGroup = selectedAddOns.find(item => (item.group_id || item.group_item_id) === id);
                if (findGroup) {
                    const addOn = findGroup.add_on || [];
                    if (addOn.length === groupLength || addOn.length === 0) {
                        return false;
                    }
                    return true;
                }
            }
            return false;
        },
        [selectedAddOns],
    );

    /**
     * checkAddOnItemChecked
     * @param groupId number
     * @param itemId number
     */
    const checkAddOnItemChecked = React.useCallback(
        (groupId: number, itemId: number) => {
            const findGroup = selectedAddOns.find(item => (item.group_id || item.group_item_id) === groupId);
            if (findGroup) {
                const addOn = findGroup.add_on || [];
                return !!addOn.find(item => (item.id || item.itemId) === itemId);
            }
            return false;
        },
        [selectedAddOns],
    );

    /**
     * renderItem
     * @param item AddOnItemModel
     * @param index number
     */
    const renderItem = React.useCallback(
        (item: AddOnItemModel, index: number) => {
            return (
                <ECheckbox
                    key={`${item.id || item.itemId}`}
                    name={`${item.id || item.itemId}`}
                    value={
                        checkAddOnItemChecked(key, item.id || item.itemId) &&
                        !!item.name &&
                        (!!item.price || item?.price === 0)
                    }
                    onChange={onAddOnItemValueChange(groupItem, item)}
                    disabled={!item.name || (!item.price && item?.price !== 0)}
                    _container={{
                        height: 50,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 20,
                        borderTopWidth: index === 0 ? 0 : 1,
                        borderTopColor: '#E4E9F2',
                    }}
                    _uncheck={{
                        borderColor: '#000',
                        borderWidth: 1,
                        borderRadius: 2,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            height: '100%',
                            marginLeft: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                height: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            {item.editable ? (
                                <EInput
                                    value={item.name}
                                    onChangeText={(value: string): void => {
                                        let trimValue = Helper.removeSpaces(value);
                                        if (Helper.checkEmptyValue(value)) {
                                            trimValue = '';
                                        }
                                        onChangeAddOnName(key, item.itemId)(trimValue);
                                    }}
                                    placeholder={`Tên ${serviceText?.product_body || 'sản phẩm'}`}
                                    autoFocus={true}
                                    placeholderTextColor={'#979797'}
                                    _input={{
                                        fontSize: 16,
                                        fontWeight: '400',
                                        color: '#000',
                                    }}
                                    _disabledInput={{
                                        paddingHorizontal: 16,
                                        fontSize: 16,
                                        fontWeight: '400',
                                        color: '#000',
                                    }}
                                    _wrapper={{
                                        marginTop: 0,
                                        flex: 0.6,
                                        borderBottomWidth: 0,
                                    }}
                                    _container={{
                                        marginTop: 0,
                                        flex: 1,
                                    }}
                                    maxLength={50}
                                />
                            ) : (
                                <EText
                                    style={{
                                        flex: 1,
                                        fontWeight: '400',
                                        fontSize: 16,
                                    }}
                                >
                                    {item.name}
                                </EText>
                            )}
                            {item.editable ? (
                                <EInput
                                    placeholder={`Giá ${serviceText?.product_body || 'sản phẩm'}`}
                                    value={item.price ? Helper.formatNumber(item.price) : ''}
                                    onChangeText={onChangeAddOnPrice(key, item.itemId)}
                                    placeholderTextColor={'#979797'}
                                    keyboardType={'number-pad'}
                                    _input={{
                                        textAlign: 'right',
                                        fontSize: 16,
                                        fontWeight: '400',
                                        color: '#000',
                                        marginLeft: 4,
                                    }}
                                    maxLength={9}
                                    _disabledInput={{
                                        textAlign: 'right',
                                        fontSize: 16,
                                        fontWeight: '400',
                                        color: '#000',
                                        marginLeft: 4,
                                    }}
                                    _wrapper={{
                                        marginTop: 0,
                                        flex: 0.4,
                                        borderBottomWidth: 0,
                                    }}
                                    _container={{
                                        marginTop: 0,
                                        flex: 1,
                                    }}
                                />
                            ) : (
                                <EText
                                    style={{
                                        fontWeight: '400',
                                        fontSize: 16,
                                        color: '#000',
                                        marginTop: 4,
                                        marginLeft: 4,
                                    }}
                                >
                                    {Helper.formatNumber(item.price || 0, ',')}
                                    {appConfig.currency}
                                </EText>
                            )}
                        </View>
                        {item.deletable && (
                            <TouchableOpacity
                                onPress={onDeleteAddOnItemPress(key, item.itemId)}
                                activeOpacity={1}
                                style={{
                                    marginLeft: 8,
                                    width: 30,
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Icons.DeleteIcon width={15} height={15} />
                            </TouchableOpacity>
                        )}
                    </View>
                </ECheckbox>
            );
        },
        [
            appConfig.currency,
            checkAddOnItemChecked,
            groupItem,
            key,
            onAddOnItemValueChange,
            onChangeAddOnName,
            onChangeAddOnPrice,
            onDeleteAddOnItemPress,
            serviceText?.product_body,
        ],
    );

    return React.useMemo(
        () => (
            <View style={{ flex: 1 }}>
                <ECheckbox
                    value={
                        !!selectedAddOns.find(item => (item.group_id || item.group_item_id) === key) && !!groupItem.name
                    }
                    onChange={onGroupAddOnValueChange(groupItem)}
                    name={`${groupItem.id || groupItem.itemId}`}
                    semiCheck={checkGroupIsSemi(groupItem)}
                    disabled={!groupItem.name}
                    _container={styles.parentGroupCheckbox}
                    _uncheck={{
                        borderColor: '#000',
                        borderWidth: 1,
                        borderRadius: 2,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 20,
                            height: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {groupItem.editable ? (
                            <EInput
                                onChangeText={(value: string): void => {
                                    let trimValue = Helper.removeSpaces(value);
                                    if (Helper.checkEmptyValue(value)) {
                                        trimValue = '';
                                    }
                                    onChangeGroupAddOnName(key)(trimValue);
                                }}
                                value={groupItem.name}
                                placeholder={`Tên nhóm ${serviceText?.product_body || 'sản phẩm'} thêm`}
                                placeholderTextColor={'#979797'}
                                autoFocus={true}
                                _input={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                }}
                                _disabledInput={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    paddingHorizontal: 16,
                                }}
                                _wrapper={{
                                    marginTop: 0,
                                    flex: 1,
                                    borderBottomWidth: 0,
                                }}
                                _container={{
                                    marginTop: 0,
                                    flex: 1,
                                }}
                                maxLength={50}
                            />
                        ) : (
                            <EText
                                style={{
                                    fontWeight: '400',
                                    fontSize: 16,
                                    flex: 1,
                                }}
                            >
                                {groupItem.name}
                            </EText>
                        )}
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={onToppingMenuPress(groupItem)}
                            style={{
                                width: 32,
                                height: 32,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 4,
                            }}
                        >
                            <Icons.ThreeHorizontalDot />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleChildren}
                            activeOpacity={1}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 30,
                                width: 30,
                            }}
                        >
                            <View style={{ alignItems: 'flex-end' }}>
                                {showChildren ? <Icons.ArrowUpIcon /> : <Icons.ArrowDownIcon />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ECheckbox>
                {showChildren && (groupItem.addOns || []).map(renderItem)}
                {showChildren && (groupItem.addOns || [])?.length < 10 && (
                    <TouchableOpacity
                        onPress={onAddItemIntoGroupAddOnPress}
                        activeOpacity={1}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 50,
                            alignSelf: 'flex-start',
                            paddingHorizontal: 20,
                        }}
                    >
                        <Icons.CircleThinPlusIcon />
                        <EText
                            style={{
                                color: '#4285F4',
                                fontSize: 15,
                                fontWeight: '400',
                                marginLeft: 20,
                                paddingVertical: 10,
                            }}
                        >
                            {`Tạo ${serviceText?.product_body || 'sản phẩm'} thêm`}
                        </EText>
                    </TouchableOpacity>
                )}
            </View>
        ),
        [
            checkGroupIsSemi,
            groupItem,
            key,
            onAddItemIntoGroupAddOnPress,
            onChangeGroupAddOnName,
            onGroupAddOnValueChange,
            onToppingMenuPress,
            renderItem,
            selectedAddOns,
            serviceText?.product_body,
            showChildren,
            toggleChildren,
        ],
    );
};

/**
 * FoodAddOns
 * @param props FoodAddOnsProps
 * @returns JSX.Element
 */
const FoodAddOns = (): JSX.Element => {
    const { food } = useFood();
    const viewRef = React.useRef<View>(null);
    const { addOns, deleteAddon } = useMenu();
    const { foodCreationUpdater } = useFood();

    const [selectedAddOns, setSelectedAddOns] = React.useState<FoodAddOn[]>(food.add_ons || []);
    const [listAddOn, setListAddOns] = React.useState(addOns?.data || []);
    const addOnGroupItemMenuRef = React.useRef<ActionSheetRef>(null);
    const dialogRef = React.useRef<AppDialogRef>(GlobalRef.appDialogRef.current);
    const { bottom } = useSafeAreaInsets();
    const { serviceText, configServiceText } = useApp();

    /**
     * onToppingMenuPress
     */
    const onToppingMenuPress = React.useCallback(
        (group: AddOnModel) => () => {
            addOnGroupItemMenuRef?.current?.open?.(group);
        },
        [],
    );

    /**
     * onChangeGroupAddOnsSelectModePress
     */
    const onChangeGroupAddOnsSelectModePress = React.useCallback(
        (group: AddOnModel) => (value: number) => {
            setListAddOns(prev => {
                return prev.map(item => {
                    if ((item.id || item.itemId) === (group.id || group.itemId)) {
                        return {
                            ...item,
                            multi_select: value,
                        };
                    }
                    return item;
                });
            });
        },
        [],
    );

    /**
     * onConfirmDeleteGroupAddOn
     * @param group AddOnModel
     */
    const onConfirmDeleteGroupAddOn = React.useCallback(
        (group: AddOnModel) => () => {
            dialogRef.current?.close?.(() => {
                if (group) {
                    if (group.id) {
                        deleteAddon({
                            group_id: group.id,
                        });
                        setListAddOns(prev => {
                            return prev.filter(item => (item.id || item.itemId) !== (group.id || group.itemId));
                        });

                        setSelectedAddOns(prev => {
                            return prev.filter(
                                item => (item.group_id || item.group_item_id) !== (group.id || group.itemId),
                            );
                        });

                        return;
                    }

                    if (group.itemId) {
                        setListAddOns(prev => {
                            return prev.filter(item => (item.id || item.itemId) !== (group.id || group.itemId));
                        });

                        setSelectedAddOns(prev => {
                            return prev.filter(
                                item => (item.group_id || item.group_item_id) !== (group.id || group.itemId),
                            );
                        });
                    }
                }
            });
        },
        [deleteAddon],
    );

    /**
     * onCloseGroupAddOnMenu
     */
    const onCloseGroupAddOnMenu = React.useCallback(() => {
        addOnGroupItemMenuRef?.current?.close?.();
    }, []);

    /**
     * onCloseConfirmDelete
     */
    const onCloseConfirmDelete = React.useCallback(() => {
        dialogRef?.current?.close?.();
    }, []);

    /**
     * onDeleteGroupAddOnsPress
     * @param group AddOnModel
     */
    const onDeleteGroupAddOnsPress = React.useCallback(
        (group: AddOnModel) => () => {
            if (group) {
                addOnGroupItemMenuRef?.current?.close?.(() => {
                    if ((group.addOns || []).length > 0) {
                        dialogRef?.current?.show?.({
                            icon: <Icons.DangerIcon />,
                            title: configServiceText(t<string>('food:add_on:delete_add_on:title')),
                            titleStyle: {
                                textAlign: 'center',
                            },
                            message: configServiceText(t<string>('food:add_on:delete_add_on:message')),
                            messageStyle: {
                                textAlign: 'center',
                            },
                            actionsInTs: [
                                {
                                    children: 'Xóa',
                                    variant: 'outline',
                                    borderColor: '#ff0000',
                                    text: {
                                        color: '#ff0000',
                                        fontWeight: '400',
                                    },
                                    marginHorizontal: 8,
                                    onPress: onConfirmDeleteGroupAddOn(group),
                                },
                                {
                                    children: 'Hủy',
                                    text: {
                                        color: '#fff',
                                        fontWeight: '700',
                                        fontSize: 16,
                                    },
                                    marginHorizontal: 8,
                                    onPress: onCloseConfirmDelete,
                                },
                            ],
                        });
                    } else {
                        onConfirmDeleteGroupAddOn(group)();
                    }
                });
            }
        },
        [configServiceText, onCloseConfirmDelete, onConfirmDeleteGroupAddOn],
    );

    /**
     * onAddGroupAddOnPress
     */
    const onAddGroupAddOnPress = React.useCallback(() => {
        if (listAddOn.length < 10) {
            const item: AddOnModel = {
                itemId: Date.now(),
                id: null,
                name: '',
                addOns: [],
                editable: true,
                deletable: true,
                multi_select: 0,
            };
            setListAddOns(prev => [...prev, item]);
        }
    }, [listAddOn.length]);

    /**
     * onChangeGroupAddOnName
     * @param groupId number
     * @param text string
     */
    const onChangeGroupAddOnName = React.useCallback(
        (groupId: number) => (text: string) => {
            setListAddOns(prev => {
                return prev.map(item => {
                    if (item.itemId === groupId) {
                        item.name = text;
                    }
                    return item;
                });
            });
        },
        [],
    );

    /**
     * onAddItemIntoGroupAddOnPress
     * @param group AddOnModel
     */
    const onAddItemIntoGroupAddOnPress = React.useCallback(
        (group: AddOnModel) => () => {
            const key = group.id || group.itemId;
            const newAddOn: AddOnItemModel = {
                itemId: Date.now(),
                id: null,
                name: '',
                price: '',
                editable: true,
                deletable: true,
            };

            setListAddOns(prev =>
                prev.map(i => {
                    if ((i.id || i.itemId) === key) {
                        const item: AddOnModel = {
                            ...i,
                            addOns: [...(i.addOns || []), newAddOn],
                        };
                        return item;
                    } else {
                        return i;
                    }
                }),
            );
        },
        [],
    );

    /**
     * onDeleteAddOnItemPress
     * @param group AddOnModel
     */
    const onDeleteAddOnItemPress = React.useCallback(
        (groupId: number, itemId: number) => () => {
            setListAddOns(prev =>
                prev.map(i => {
                    if ((i.id || i.itemId) === groupId) {
                        const item: AddOnModel = {
                            ...i,
                            addOns: i.addOns?.filter(item => (item.id || item.itemId) !== itemId),
                        };
                        return item;
                    }
                    return i;
                }),
            );

            setSelectedAddOns(prev => {
                const result = prev.map(i => {
                    if ((i.group_id || i.group_item_id) === groupId) {
                        const item: FoodAddOn = {
                            ...i,
                            add_on: (i.add_on || []).filter(item => item.itemId !== itemId),
                        };
                        return item;
                    }
                    return i;
                });

                return result.filter(item => (item.add_on || []).length > 0);
            });
        },
        [],
    );

    /**
     * onChangeAddOnPrice
     * @param groupId number
     * @param itemId number
     * @param text string
     */
    const onChangeAddOnName = React.useCallback(
        (groupId: number, itemId: number) => (text: string) => {
            setListAddOns(prev => {
                return prev.map(item => {
                    const key = item.id || item.itemId;
                    if (key === groupId) {
                        const newItem = {
                            ...item,
                            addOns: [...(item.addOns || [])].map(addOn => {
                                if (addOn.itemId === itemId) {
                                    addOn.name = text;
                                }
                                return addOn;
                            }),
                        };
                        return newItem;
                    }
                    return item;
                });
            });
        },
        [],
    );

    /**
     * onChangeAddOnPrice
     * @param groupId number
     * @param itemId number
     * @param text string
     */
    const onChangeAddOnPrice = React.useCallback(
        (groupId: number, itemId: number) => (text: string) => {
            setListAddOns(prev => {
                return prev.map(item => {
                    const key = item.id || item.itemId;
                    if (key === groupId) {
                        const newItem = {
                            ...item,
                            addOns: (item.addOns || []).map(addOn => {
                                if (addOn.itemId === itemId) {
                                    let extracted = Helper.removeNotDigit(text);
                                    if (extracted.length > 0) {
                                        // if price greater than MAX_FOOD_PRICE (2.000.000)
                                        if (Number(extracted) > MAX_FOOD_PRICE) {
                                            // set MAX_FOOD_PRICE for value
                                            extracted = String(MAX_FOOD_PRICE);
                                        }
                                    }
                                    addOn.price = extracted;
                                }
                                return addOn;
                            }),
                        };
                        return newItem;
                    }

                    return item;
                });
            });
        },
        [],
    );

    /**
     * onGroupAddOnValueChange
     * @param group AddOnModel
     * @param value ECheckboxData
     */
    const onGroupAddOnValueChange = React.useCallback(
        (group: AddOnModel) => (value: ECheckboxData) => {
            const key = group.id || group.itemId;
            if (value[`${key}`]) {
                const groupItem: FoodAddOn = {
                    group_item_id: group.itemId,
                    group_id: group.id,
                    add_on: group.addOns || [],
                    multi_select: group.multi_select,
                };
                setSelectedAddOns(prev => [...prev, groupItem]);
            } else {
                setSelectedAddOns(prev => prev.filter(item => (item.group_id || item.group_item_id) !== key));
            }
        },
        [],
    );

    /**
     * onAddOnItemValueChange
     * @param group AddOnModel
     * @param item AddOnItemModel
     * @param value ECheckboxData
     */
    const onAddOnItemValueChange = React.useCallback(
        (group: AddOnModel, item: AddOnItemModel) => (value: ECheckboxData) => {
            const findGroup = selectedAddOns.find(
                item => (item.group_id || item.group_item_id) === (group.id || group.itemId),
            );
            if (findGroup) {
                const addOnList = findGroup.add_on || [];
                const itemValue = value[`${item.id || item.itemId}`];
                if (itemValue) {
                    const groupItem: FoodAddOn = {
                        group_item_id: group.itemId,
                        group_id: group.id,
                        add_on: [...addOnList, item],
                    };
                    setSelectedAddOns(prev => {
                        const rs = prev.filter(
                            item => (item.group_id || item.group_item_id) !== (group.id || group.itemId),
                        );

                        return [...rs, groupItem];
                    });
                } else {
                    const addOn = addOnList.filter(i => (i.id || i.itemId) !== (item.id || item.itemId));
                    const groupItem: FoodAddOn = {
                        group_item_id: group.itemId,
                        group_id: group.id,
                        add_on: addOn,
                    };
                    setSelectedAddOns(prev =>
                        prev.filter(i => (i.group_id || i.group_item_id) !== (group.id || group.itemId)),
                    );
                    if (addOn.length > 0) {
                        setSelectedAddOns(prev => [...prev, groupItem]);
                    }
                }
            } else {
                const groupItem: FoodAddOn = {
                    group_item_id: group.itemId,
                    group_id: group.id,
                    add_on: [item],
                };
                setSelectedAddOns(prev => [...prev, groupItem]);
            }
        },
        [selectedAddOns],
    );

    /**
     * renderGroupItem
     * @param groupItem AddOnModel
     */
    const renderGroupItem = React.useCallback(
        (groupItem: AddOnModel) => {
            const key = groupItem.id || groupItem.itemId;
            return (
                <GroupAddOn
                    key={key}
                    {...groupItem}
                    selectedAddOns={selectedAddOns}
                    onAddItemIntoGroupAddOnPress={onAddItemIntoGroupAddOnPress(groupItem)}
                    onAddOnItemValueChange={onAddOnItemValueChange}
                    onChangeAddOnName={onChangeAddOnName}
                    onChangeAddOnPrice={onChangeAddOnPrice}
                    onChangeGroupAddOnName={onChangeGroupAddOnName}
                    onDeleteAddOnItemPress={onDeleteAddOnItemPress}
                    onGroupAddOnValueChange={onGroupAddOnValueChange}
                    onToppingMenuPress={onToppingMenuPress}
                />
            );
        },
        [
            selectedAddOns,
            onAddItemIntoGroupAddOnPress,
            onAddOnItemValueChange,
            onChangeAddOnName,
            onChangeAddOnPrice,
            onChangeGroupAddOnName,
            onDeleteAddOnItemPress,
            onGroupAddOnValueChange,
            onToppingMenuPress,
        ],
    );

    /**
     * filterAddOnsData
     */
    const filterAddOnsData = React.useCallback(() => {
        const data = selectedAddOns.map(item => {
            const listAddOnIds = (item.add_on || []).map(a => a.id || a.itemId);
            const findGroup = listAddOn.find(i => (i.id || i.itemId) === (item.group_id || item.group_item_id));

            const newAddOns = (findGroup?.addOns || []).filter(f => listAddOnIds.includes(f.id || f.itemId)) || [];

            const rs: FoodAddOn = {
                group_id: item.group_id,
                group_item_id: item.group_item_id,
                group_name: findGroup?.name,
                multi_select: findGroup?.multi_select || 0,
                add_on: newAddOns,
            };
            return rs;
        });

        foodCreationUpdater({
            add_ons: data,
        });
    }, [foodCreationUpdater, listAddOn, selectedAddOns]);

    React.useEffect(() => {
        filterAddOnsData();
    }, [filterAddOnsData]);

    return React.useMemo(
        () => (
            <View ref={viewRef} style={styles.container}>
                <View style={styles.titleContainer}>
                    <EText style={styles.titleText}>{`Chọn nhóm ${serviceText?.product_body || 'sản phẩm'
                        } thêm`}</EText>
                </View>
                <View style={styles.listContainer}>
                    {listAddOn.map(renderGroupItem)}
                    {listAddOn.length < 10 && (
                        <TouchableOpacity
                            onPress={onAddGroupAddOnPress}
                            activeOpacity={1}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: 50,
                                alignSelf: 'flex-start',
                            }}
                        >
                            <Icons.CircleThinPlusIcon />
                            <EText
                                style={{
                                    color: '#4285F4',
                                    fontSize: 15,
                                    fontWeight: '400',
                                    marginLeft: 20,
                                    paddingVertical: 10,
                                }}
                            >
                                {`Tạo nhóm ${serviceText?.product_body || 'sản phẩm'} thêm`}
                            </EText>
                        </TouchableOpacity>
                    )}
                </View>
                {/* {ContentMenu} */}
                <ActionSheet ref={addOnGroupItemMenuRef}>
                    <View style={[styles.actionSheetContainer, { paddingBottom: 16 + bottom }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <EText style={styles.asHeaderText}>
                                {`Cài đặt Nhóm ${serviceText?.product_body || 'sản phẩm'} thêm`}
                            </EText>
                            <TouchableOpacity onPress={onCloseGroupAddOnMenu}>
                                <Icons.CloseIcon />
                            </TouchableOpacity>
                        </View>
                        <AddOnContentMenu
                            onChangeGroupAddOnsSelectModePress={onChangeGroupAddOnsSelectModePress}
                            onDeleteGroupAddOnsPress={onDeleteGroupAddOnsPress}
                        />
                    </View>
                </ActionSheet>
            </View>
        ),
        [
            bottom,
            listAddOn,
            onAddGroupAddOnPress,
            onChangeGroupAddOnsSelectModePress,
            onCloseGroupAddOnMenu,
            onDeleteGroupAddOnsPress,
            renderGroupItem,
            serviceText?.product_body,
        ],
    );
};

interface AddOnContentMenuProps {
    onChangeGroupAddOnsSelectModePress: any;
    onDeleteGroupAddOnsPress: any;
}

/**
 * AddOnContentMenu
 * @param props AddOnContentMenuProps
 * @returns JSX.Element
 */
const AddOnContentMenu = (props: AddOnContentMenuProps): JSX.Element => {
    const context = React.useContext(ActionSheetContext);
    const contentMenu = React.useMemo(() => context as AddOnModel, [context]);
    const { serviceText } = useApp();

    return React.useMemo(
        () => (
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                        borderWidth: 1,
                        borderRadius: 12,
                        borderColor: '#E4E9F2',
                        marginVertical: 16,
                    }}
                >
                    <EText
                        style={{
                            flex: 1,
                            fontWeight: '400',
                            fontSize: 16,
                        }}
                    >
                        Cho phép khách hàng chọn:
                    </EText>
                    <Selector
                        value={contentMenu?.multi_select}
                        onChange={props?.onChangeGroupAddOnsSelectModePress(contentMenu)}
                    />
                </View>
                <View
                    style={{
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignSelf: 'center',
                        marginTop: 4,
                    }}
                >
                    <EButton
                        onPress={props?.onDeleteGroupAddOnsPress(contentMenu)}
                        height={40}
                        variant="outline"
                        borderColor={'#ff0000'}
                        minWidth={50}
                        text={{
                            fontWeight: '600',
                            color: '#ff0000',
                            fontSize: 14,
                        }}
                        paddingHorizontal={32}
                    >
                        {`Xóa Nhóm ${serviceText?.product_body || 'sản phẩm'} thêm`}
                    </EButton>
                </View>
            </View>
        ),
        [contentMenu, props, serviceText?.product_body],
    );
};

export default FoodAddOns;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: 8,
        position: 'relative',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    titleText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#010F07',
        flex: 1,
    },
    listContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    parentGroupCheckbox: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentMenu: {
        position: 'absolute',
        right: 16,
        borderTopWidth: 2,
        borderTopColor: '#4285F4',
        backgroundColor: '#fff',
        padding: 16,
        paddingHorizontal: 20,
        shadowColor: '#979797',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 3.84,
        elevation: 5,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    actionSheetContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    actionSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    asHeaderText: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
    },
});
