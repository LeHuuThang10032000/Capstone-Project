import * as React from 'react';
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    StyleProp,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedbackProps,
    View,
    ViewStyle,
} from 'react-native';
import EText from './EText';

/**
 * EButtonProps
 */
export interface EButtonProps extends ViewStyle, TouchableWithoutFeedbackProps {
    // children, only support for String at the moment
    children?: React.ReactNode;
    // variant style
    variant?: 'solid' | 'outline' | 'unstyled';
    // isLoading
    isLoading?: boolean;
    // isLoadingText, work with isLoading
    isLoadingText?: string;
    // _loading style, work with isLoading
    _loading?: ActivityIndicatorProps;
    // _loading position
    _loadingPosition?: 'left' | 'right';
    // isDisabled
    isDisabled?: boolean;
    // text style
    text?: StyleProp<TextStyle>;
    // _disabled button style
    _disabled?: StyleProp<ViewStyle>;
    // _textDisabled
    _textDisabled?: StyleProp<TextStyle>;
}

/**
 * EButton
 * @param props EButtonProps
 * @returns JSX.Element
 */
const EButton = (props: EButtonProps): JSX.Element => {
    const variant = React.useMemo(() => props.variant || 'solid', [props.variant]);
    const loadingPosition = React.useMemo(
        () => ((props?._loadingPosition || 'left') === 'left' ? 'row' : 'row-reverse'),
        [props._loadingPosition],
    );
    /**
     * makeContainerStyle
     */
    const makeContainerStyle = React.useCallback((): StyleProp<ViewStyle> => {
        // default style for button
        const styles: StyleProp<ViewStyle> = {
            height: props.height || 45,
            justifyContent: props.justifyContent || 'center',
            alignItems: props.alignItems || 'center',
            borderRadius: props.borderRadius || 8,
            ...props,
        };

        // variant is outline
        if (variant === 'outline') {
            styles.borderColor = props.borderColor || '#4285F4';
            styles.borderWidth = props.borderWidth || 1;
        }

        // variant is unstyled
        if (variant === 'unstyled') {
            styles.borderWidth = props.borderWidth || 0;
            styles.borderColor = props.borderColor || 'transparent';
            styles.borderRadius = props.borderRadius || 0;
            styles.padding = props.padding || 0;
            styles.height = props.height || 'auto';
        }

        // variant is solid
        if (variant === 'solid') {
            styles.backgroundColor = props.backgroundColor || '#4285F4';
        }

        // return styles
        return styles;
    }, [props, variant]);

    return React.useMemo(
        () => (
            <TouchableOpacity
                activeOpacity={1}
                style={[makeContainerStyle(), props.isDisabled && props._disabled]}
                disabled={props.isDisabled || props.isLoading}
                {...props}
            >
                {props.isLoading ? (
                    <View style={{ flexDirection: loadingPosition, alignItems: 'center' }}>
                        <ActivityIndicator {...props._loading} />
                        {props.isLoadingText && (
                            <EText
                                style={[
                                    styles.text,
                                    props.text,
                                    {
                                        marginLeft: loadingPosition === 'row' ? 8 : 0,
                                        marginRight: loadingPosition === 'row' ? 0 : 8,
                                    },
                                ]}
                            >
                                {props.isLoadingText}
                            </EText>
                        )}
                    </View>
                ) : (
                    <View>
                        {typeof props.children === 'string' ? (
                            <EText style={[styles.text, props.text, props.isDisabled && props._textDisabled]}>
                                {props.children}
                            </EText>
                        ) : (
                            props.children
                        )}
                    </View>
                )}
            </TouchableOpacity>
        ),
        [loadingPosition, makeContainerStyle, props],
    );
};

export default React.memo(EButton);

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Ubuntu',
        color: '#000',
    },
});
