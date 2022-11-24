import {StyleProp, ViewStyle} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function KeyboardInputScrollView(props: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      style={props.style}
      contentContainerStyle={props.contentContainerStyle}>
      {props.children}
    </KeyboardAwareScrollView>
  );
}
