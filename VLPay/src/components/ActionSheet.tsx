import { BlurView } from '@react-native-community/blur';
import * as React from 'react';
import { Keyboard, LayoutChangeEvent, Modal, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN_HEIGHT } from './helper/constants';

// ActionSheetContext
export const ActionSheetContext = React.createContext({});

/**
 * ActionSheet
 */
interface ActionSheet {
    /**
     * children
     */
    children?: React.ReactNode;
    /**
     * onBackdropPress
     */
    onBackdropPress?: (data?: any) => void;
    /**
     * options
     */
    options?: {
        /**
         * blur view backdrop, default 4
         */
        blurAmount?: number;
    };
}

/**
 * ActionSheetRef
 */
export interface ActionSheetRef {
    /**
     * open
     */
    open?: (props?: any) => void;
    /**
     * close
     * @param cb callback function, execute after action sheet closed
     */
    close?: (cb?: () => void, keepProps?: boolean) => void;
}

/**
 * ActionSheet (Using Modal)
 */
const ActionSheet = React.forwardRef((props: ActionSheet, ref: React.ForwardedRef<ActionSheetRef>) => {
    const [actionSheetProps, setActionSheetProps] = React.useState<any>(undefined);
    const { top } = useSafeAreaInsets();

    // calc spacing for android
    const spacing = React.useMemo(
        () =>
            Platform.select({
                ios: 0,
                android: top,
            }),
        [top],
    );

    // modal visible
    const [modalVisible, setModalVisible] = React.useState(false);

    // content height
    const contentHeight = useSharedValue(0);

    // animated value
    const animatedValue = useSharedValue(0);

    // content translate animation
    const translateAnimation = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        animatedValue.value,
                        [0, 1],
                        [SCREEN_HEIGHT, SCREEN_HEIGHT - contentHeight.value - (spacing || 0)],
                    ),
                },
            ],
        };
    });

    // backdrop opacity animation
    const opacityAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animatedValue.value, [0, 1], [0, 1]),
        };
    });

    /**
     * open action sheet
     * @param props pass props to child inside ActionSheet
     */
    const open = React.useCallback((props?: any) => {
        'worklet';
        // set props, it will be pass into action sheet child
        setActionSheetProps(props);
        setModalVisible(true);
    }, []);

    /**
     * close action sheet
     */
    const close = React.useCallback(
        (cb?: () => void, keepProps?: boolean) => {
            'worklet';
            // dismiss keyboard
            Keyboard.dismiss();

            // run animation
            animatedValue.value = withTiming(0, { duration: 350 }, finished => {
                'worklet';
                if (finished) {
                    ('worklet');
                    // if keepProps is true
                    if (!keepProps) {
                        // default clear action sheet props
                        runOnJS(setActionSheetProps)(undefined);
                    }
                    ('worklet');
                    runOnJS(setModalVisible)(false);
                    ('worklet');
                    cb && runOnJS(cb)();
                }
            });
        },
        [animatedValue],
    );

    React.useImperativeHandle(
        ref,
        () => ({
            open,
            close,
        }),
        [close, open],
    );

    /**
     * onLayout
     * get layout of content
     */
    const onLayout = React.useCallback(
        (evt: LayoutChangeEvent) => {
            'worklet';
            // update to content height
            contentHeight.value = evt.nativeEvent.layout.height;

            // update value for animated to run animation
            animatedValue.value = withTiming(1, { duration: 350 });
        },
        [animatedValue, contentHeight],
    );

    /**
     * onModalDismiss
     */
    const onModalDismiss = React.useCallback(() => {
        'worklet';
        animatedValue.value = 0;
        setModalVisible(false);
    }, [animatedValue]);

    /**
     * onBackdropPress
     */
    const onBackdropPress = React.useCallback(() => {
        'worklet';
        // if onBackdropPress available
        if (props?.onBackdropPress) {
            // execute it
            props?.onBackdropPress();
        } else {
            // otherwise, call close function
            close();
        }
    }, [close, props]);

    return React.useMemo(
        () => (
            <View style={[StyleSheet.absoluteFill, styles.root, { display: modalVisible ? 'flex' : 'none' }]}>
                <Modal visible={modalVisible} transparent statusBarTranslucent onDismiss={onModalDismiss}>
                    <TouchableWithoutFeedback onPress={onBackdropPress}>
                        <Animated.View style={[StyleSheet.absoluteFill, opacityAnimation]}>
                            <BlurView
                                style={[StyleSheet.absoluteFill]}
                                blurType="dark"
                                blurAmount={props?.options?.blurAmount || 4}
                                reducedTransparencyFallbackColor="white"
                            />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                    <Animated.View style={[translateAnimation]}>
                        <ActionSheetContext.Provider value={actionSheetProps}>
                            <View onLayout={onLayout}>{props.children}</View>
                        </ActionSheetContext.Provider>
                    </Animated.View>
                </Modal>
            </View>
        ),
        [
            actionSheetProps,
            modalVisible,
            onBackdropPress,
            onLayout,
            onModalDismiss,
            opacityAnimation,
            props.children,
            props?.options?.blurAmount,
            translateAnimation,
        ],
    );
});

// Update displayName
ActionSheet.displayName = 'ActionSheet';

export default React.memo(ActionSheet);

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
