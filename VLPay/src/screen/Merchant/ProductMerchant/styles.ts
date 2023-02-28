import { StyleSheet } from "react-native";
import { SCREEN_WIDTH } from "../../../components/helper/constants";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    banner: {
        height: SCREEN_WIDTH * (2 / 3),
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeBanner: {
        position: 'absolute',
        bottom: 20,
        right: 15,
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    require: {
        fontWeight: '400',
        fontSize: 15,
        color: '#FF0000',
    },
    bottomContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    buttonTextStyle: {
        fontWeight: '700',
        fontSize: 18,
        color: '#fff',
        textTransform: 'capitalize',
    },
    btnWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});