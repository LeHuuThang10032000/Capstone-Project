import { t } from 'i18next';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { EText } from '../../components';

interface SelectorProps {
    value?: number;
    onChange?: (value: number) => void;
}

const Selector = (props: SelectorProps): JSX.Element => {
    const [selected, setSelected] = React.useState(props.value || 0);

    React.useEffect(() => {
        setSelected(props.value || 0);
    }, [props.value]);

    /**
     * onItemPress
     */
    const onItemPress = React.useCallback(
        (item: number) => (): void => {
            setSelected(item);
            props?.onChange?.(item);
        },
        [props],
    );

    return (
        <View style={styles.container}>
            {[0, 1].map((item, index) => {
                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        key={index}
                        style={[
                            styles.item,
                            {
                                backgroundColor: selected === item ? '#4285F4' : '#fff',
                            },
                        ]}
                        onPress={onItemPress(item)}
                    >
                        <EText
                            style={[
                                styles.text,
                                {
                                    color: selected === item ? '#fff' : '#4285F4',
                                },
                            ]}
                        >
                            {t(`food:${item}`)}
                        </EText>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default Selector;

const styles = StyleSheet.create({
    container: {
        height: 30,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#4285F4',
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        paddingHorizontal: 8,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    text: {
        fontSize: 12,
        fontWeight: '400',
    },
});
