import { t } from 'i18next';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import EButton from '../../../components/EButton';
import ECheckbox from '../../../components/ECheckbox';
import EInput from '../../../components/EInput';
import EText from '../../../components/EText';
import Icons from '../../../components/Icons';

/**
 * AddCategory
 * @returns JSX.Element
 */
const AddCategory = (): JSX.Element => {
    const [isAdding, setAdding] = React.useState(false);
    const [category, setCategory] = React.useState<string>();
    const [error, setError] = React.useState<string>();

    /**
     * onAddDeletePress handler
     * add/remove new item
     */
    const onAddDeletePress = React.useCallback(() => {
        setCategory('');
        setError('');
        setAdding(prev => !prev);
    }, []);

    /**
     * onAddPress handler
     */
    const onAddPress = React.useCallback(() => {
        if ((category || '').trim().length <= 0) {
            setError(t<string>('food:invalid_new_category_name'));
            return;
        }
        if (category) {
            // call add new category
            // reset add category
            onAddDeletePress();
        }
    }, [category, onAddDeletePress]);

    return React.useMemo(
        () => (
            <>
                {isAdding ? (
                    <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                        <ECheckbox
                            name="popular"
                            disabled={true}
                            _container={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: 50,
                            }}
                            _uncheck={{
                                borderRadius: 1,
                                borderColor: '#000',
                                borderWidth: 1,
                            }}
                        >
                            <View />
                        </ECheckbox>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <EInput
                                    variant="outline"
                                    placeholder="Nhập tên cho danh sách mới"
                                    autoFocus={true}
                                    value={category}
                                    onChangeText={setCategory}
                                    _container={{
                                        height: 30,
                                    }}
                                    maxLength={100}
                                    _wrapper={{
                                        flex: 1,
                                        marginTop: 0,
                                        borderRadius: 1,
                                        marginLeft: 20,
                                        borderColor: '#4285F4',
                                    }}
                                    _input={{
                                        flex: 1,
                                        height: 30,
                                        paddingHorizontal: 8,
                                    }}
                                    error={error}
                                />
                            </View>
                            <EButton
                                onPress={onAddPress}
                                variant="unstyled"
                                paddingHorizontal={12}
                                text={{
                                    color: '#4285F4',
                                }}
                            >
                                {t('food:add')}
                            </EButton>
                            <EButton
                                onPress={onAddDeletePress}
                                variant="unstyled"
                                paddingHorizontal={12}
                                text={{
                                    color: '#FF0000',
                                }}
                            >
                                {t('food:delete')}
                            </EButton>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onAddDeletePress}
                        style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}
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
                            Thêm danh sách mới
                        </EText>
                    </TouchableOpacity>
                )}
            </>
        ),
        [category, error, isAdding, onAddDeletePress, onAddPress],
    );
};

export default React.memo(AddCategory);
