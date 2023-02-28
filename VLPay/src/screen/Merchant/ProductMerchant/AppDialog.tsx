import { BlurView } from '@react-native-community/blur';
import _ from 'lodash';
import * as React from 'react';
import { Modal, SafeAreaView, StyleProp, StyleSheet, TextStyle, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';
import EButton, { EButtonProps } from '../../../components/EButton';
import EText from '../../../components/EText';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../components/helper/constants';
import Icons from '../../../components/Icons';

interface AppDialogProps {
    icon?: string | React.ReactNode;
    iconProps?: SvgProps;
    title?: string | React.ReactNode;
    titleStyle?: StyleProp<TextStyle>;
    message?: string | React.ReactNode;
    messageStyle?: StyleProp<TextStyle>;
    actions?: React.ReactNode[];
    actionsInTs?: EButtonProps[];
    actionsDirection?: 'row' | 'column';
    dismissable?: boolean;
}

export interface AppDialogRef {
    show?: (props?: AppDialogProps) => void;
    close?: (cb?: () => void) => void;
}

/**
 * AppDialog
 * @param props AppDialogProps
 * @returns
 */
const AppDialog = React.forwardRef((props: AppDialogProps, ref: React.ForwardedRef<AppDialogRef>) => {
    const [dialogProps, setDialogProps] = React.useState<AppDialogProps>(props);
    const title = React.useMemo(() => dialogProps.title, [dialogProps.title]);
    const message = React.useMemo(() => dialogProps.message, [dialogProps.message]);
    const actionsDirection = React.useMemo(
        () => (['row', 'column'].includes(dialogProps.actionsDirection || '') ? dialogProps.actionsDirection : 'row'),
        [dialogProps.actionsDirection],
    );
    const [visible, setVisible] = React.useState(false);

    // animation variables
    const animatedValue = useSharedValue(0);

    const modalAnimation = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(animatedValue.value, [0, 1], [0.75, 1]),
                },
            ],
            opacity: interpolate(animatedValue.value, [0, 1], [0, 1]),
        };
    });

    const backdropAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animatedValue.value, [0, 1], [0, 1]),
        };
    });

    /**
     * show modal
     */
    const show = React.useCallback(
        (props?: AppDialogProps) => {
            'worklet';
            if (props) {
                setDialogProps(props);
            }
            setVisible(true);
            animatedValue.value = withTiming(1);
        },
        [animatedValue],
    );

    /**
     * show modal
     */
    const close = React.useCallback(
        (cb?: () => void) => {
            'worklet';
            animatedValue.value = withTiming(0, {}, finished => {
                'worklet';
                if (finished) {
                    ('worklet');
                    runOnJS(setVisible)(false);
                    ('worklet');
                    cb && runOnJS(cb)();
                }
            });
        },
        [animatedValue],
    );

    /**
     * onBackdropPress
     */
    const onBackdropPress = React.useCallback(() => {
        'worklet';
        if (_.isNil(dialogProps.dismissable) || Boolean(dialogProps.dismissable) === true) {
            // otherwise, call close function
            close();
        }
    }, [close, dialogProps.dismissable]);

    React.useImperativeHandle(
        ref,
        () => ({
            show,
            close,
        }),
        [close, show],
    );

    // Icon
    const Icon = React.useMemo(() => {
        if (dialogProps.icon) {
            const type = typeof dialogProps.icon;
            if (type === 'string') {
                const Icon = (Icons as any)[dialogProps.icon as string];
                return (
                    <View style={styles.iconView}>
                        <Icon {...dialogProps.iconProps} />
                    </View>
                );
            }
            return <View style={styles.iconView}>{dialogProps.icon}</View>;
        }
        return <></>;
    }, [dialogProps.icon, dialogProps.iconProps]);

    return React.useMemo(
        () => (
            <View style={[styles.modal, { display: visible ? 'flex' : 'none' }]}>
                {visible && (
                    <Modal
                        visible={visible}
                        transparent
                        onDismiss={(): void => {
                            setVisible(false);
                        }}
                        statusBarTranslucent
                    >
                        <SafeAreaView style={styles.container}>
                            <TouchableWithoutFeedback onPress={onBackdropPress}>
                                <Animated.View style={[StyleSheet.absoluteFill, backdropAnimation]}>
                                    <BlurView
                                        style={[StyleSheet.absoluteFill]}
                                        blurType="dark"
                                        blurAmount={1}
                                        reducedTransparencyFallbackColor="white"
                                    />
                                </Animated.View>
                            </TouchableWithoutFeedback>
                            <Animated.View style={[styles.mainContainer, modalAnimation]}>
                                {Icon}
                                <View style={{ paddingHorizontal: 15 }}>
                                    {typeof title === 'string' ? (
                                        <EText
                                            style={[StyleSheet.flatten([styles.titleStyle, dialogProps.titleStyle])]}
                                        >
                                            {title}
                                        </EText>
                                    ) : (
                                        title
                                    )}

                                    {typeof message === 'string' ? (
                                        <EText
                                            style={[
                                                StyleSheet.flatten([styles.messageStyle, dialogProps.messageStyle]),
                                            ]}
                                        >
                                            {message}
                                        </EText>
                                    ) : (
                                        message
                                    )}
                                </View>

                                {(dialogProps.actions || [])?.length > 0 && (
                                    <View style={[styles.actions, { flexDirection: actionsDirection }]}>
                                        {dialogProps.actions?.map((item, index: number) => {
                                            return (
                                                <View
                                                    key={index}
                                                    style={{ flex: actionsDirection === 'row' ? 1 : undefined }}
                                                >
                                                    {item}
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}

                                {(dialogProps.actionsInTs || [])?.length > 0 && (
                                    <View style={[styles.actions, { flexDirection: actionsDirection }]}>
                                        {dialogProps.actionsInTs?.map((item, index: number) => {
                                            return (
                                                <View
                                                    key={index}
                                                    style={{ flex: actionsDirection === 'row' ? 1 : undefined }}
                                                >
                                                    <EButton {...item}>{item.children}</EButton>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </Animated.View>
                        </SafeAreaView>
                    </Modal>
                )}
            </View>
        ),
        [
            Icon,
            actionsDirection,
            backdropAnimation,
            dialogProps.actions,
            dialogProps.actionsInTs,
            dialogProps.messageStyle,
            dialogProps.titleStyle,
            message,
            modalAnimation,
            onBackdropPress,
            title,
            visible,
        ],
    );
});

AppDialog.displayName = 'AppDialog';

export default React.memo(AppDialog);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    mainContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: 'column',
        width: SCREEN_WIDTH - 60,
        alignContent: 'center',
        opacity: 0,
        transform: [
            {
                scale: 0.75,
            },
        ],
    },
    iconView: {
        marginVertical: 28,
        alignItems: 'center',
    },
    titleStyle: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
    },
    messageStyle: {
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 24,
        marginTop: 10,
    },
    actions: {
        paddingHorizontal: 9,
        marginTop: 30,
        marginBottom: 18,
    },
});
