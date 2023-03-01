import * as React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

/**
 * EText
 * @returns JSX.Element
 */
const EText = (props: TextProps): JSX.Element => {
    return (
        <Text
            {...props}
            allowFontScaling={false}
            style={StyleSheet.flatten([styles.text, props.style])}
            adjustsFontSizeToFit={false}
        >
            {props.children}
        </Text>
    );
};

export default React.memo(EText);

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Ubuntu',
        color: '#000000',
    },
});
