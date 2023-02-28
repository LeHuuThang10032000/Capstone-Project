import * as React from 'react';
import { LegacyRef } from 'react';
import {
    NativeSyntheticEvent,
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputFocusEventData,
    TextInputProps,
    TextStyle,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';
import EText from './EText';

/**
 * EInputProps extends from TextInputProps
 */
interface EInputProps extends Omit<TextInputProps, 'style'> {
    /**
     * variant
     */
    variant?: 'standard' | 'outline';
    /**
     * label
     */
    label?: string;
    /**
     * custom label style
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * error message
     */
    error?: string;
    /**
     * custom style for label error message
     */
    errorStyle?: StyleProp<TextStyle>;
    /**
     * left component
     */
    leftComponent?: React.ReactNode;
    /**
     * hide left component
     */
    hideLeftComponent?: boolean;
    /**
     * right component
     */
    rightComponent?: React.ReactNode;
    /**
     * hide right component
     */
    hideRightComponent?: boolean;
    /**
     * disable input
     */
    disabledInput?: boolean;
    /**
     * disabled pressable on input
     */
    disabledPress?: boolean;
    /**
     * make field require
     */
    require?: boolean;
    /**
     * custom container style
     */
    _container?: StyleProp<ViewStyle>;
    /**
     * custom wrapper style. An View wrap input
     */
    _wrapper?: StyleProp<ViewStyle>;
    /**
     * custom wrapper style. An View wrap input
     */
    _focused?: StyleProp<ViewStyle>;
    /**
     * custom input style
     */
    _input?: StyleProp<TextStyle>;
    /**
     * disabled input
     */
    _disabledInput?: StyleProp<TextStyle>;
    /**
     * custom error style for wrapper
     */
    _wrapperError?: {
        borderColor?: string;
        borderBottomColor?: string;
    };
    /**
     * onPress
     */
    onPress?: () => void;
}

/**
 * EInput
 * @param props EInputProps
 * @returns JSX.Element
 */
const EInput = React.forwardRef((props: EInputProps, ref: LegacyRef<TextInput>) => {
    const [isFocused, setFocused] = React.useState(false);

    /**
     * handleFocus
     * @param e NativeSyntheticEvent<TextInputFocusEventData>
     */
    const handleFocus = React.useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setFocused(true);
            props?.onFocus?.(e);
        },
        [props],
    );

    /**
     * handleBlur
     * @param e NativeSyntheticEvent<TextInputFocusEventData>
     */
    const handleBlur = React.useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setFocused(false);
            props?.onBlur?.(e);
        },
        [props],
    );

    return React.useMemo(
        () => (
            <View style={[StyleSheet.flatten([styles.container, props._container])]}>
                {props.label && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <EText style={[StyleSheet.flatten([styles.labelStyle, props.labelStyle])]}>{props.label}</EText>
                        {props.require && <EText style={styles.require}>*</EText>}
                    </View>
                )}
                <TouchableWithoutFeedback disabled={props.disabledPress} onPress={props.onPress}>
                    <View
                        style={[
                            StyleSheet.flatten([
                                props.variant === 'outline' ? styles.outline : styles.standard,
                                StyleSheet.flatten([props._wrapper, isFocused && props._focused]),
                                props.error ? props._wrapperError : {},
                            ]),
                        ]}
                    >
                        {!props.hideLeftComponent && props?.leftComponent}
                        {!props.disabledInput ? (
                            <TextInput
                                disableFullscreenUI={true}
                                placeholderTextColor={props.placeholderTextColor || '#8F9BB3'}
                                underlineColorAndroid={'transparent'}
                                style={StyleSheet.flatten([styles.input, props._input])}
                                ref={ref}
                                {...props}
                                keyboardAppearance={'default'}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                allowFontScaling={false}
                            />
                        ) : (
                            <View style={styles.disabledInput}>
                                {props.value ? (
                                    <EText
                                        style={[
                                            StyleSheet.flatten([styles.disabledInputTextStyle, props._disabledInput]),
                                        ]}
                                    >
                                        {props.value}
                                    </EText>
                                ) : (
                                    <EText
                                        style={[
                                            StyleSheet.flatten([styles.disabledInputTextStyle, props._disabledInput]),
                                            { color: props.placeholderTextColor },
                                        ]}
                                    >
                                        {props.placeholder}
                                    </EText>
                                )}
                            </View>
                        )}
                        {!props.hideRightComponent && props?.rightComponent}
                    </View>
                </TouchableWithoutFeedback>
                {props.error && <EText style={[styles.error, props.errorStyle]}>{props.error}</EText>}
            </View>
        ),
        [handleBlur, handleFocus, isFocused, props, ref],
    );
});

EInput.displayName = 'EInput';

export default React.memo(EInput);

const styles = StyleSheet.create({
    outline: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        flexDirection: 'row',
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
    },
    standard: {
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E9F2',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
    },
    container: {
        position: 'relative',
    },
    labelStyle: {
        fontFamily: 'Ubuntu',
        fontSize: 13,
        fontWeight: '700',
        color: '#222B45',
    },
    input: {
        padding: 0,
        height: 45,
        flex: 1,
        fontFamily: 'Ubuntu',
        fontWeight: '300',
        fontSize: 15,
        color: '#000',
    },
    disabledInput: {
        minHeight: 45,
        justifyContent: 'center',
        flex: 1,
    },
    disabledInputTextStyle: {
        fontFamily: 'Ubuntu',
        fontWeight: '300',
        fontSize: 15,
        color: '#000',
    },
    error: {
        color: '#FF0000',
        fontFamily: 'Ubuntu',
        fontWeight: '400',
        fontSize: 11,
        position: 'absolute',
        bottom: -17,
        right: 0,
        fontStyle: 'italic',
    },
    require: {
        color: '#FF0000',
        fontFamily: 'Ubuntu',
        fontWeight: '400',
        fontSize: 15,
        marginLeft: 4,
    },
});
