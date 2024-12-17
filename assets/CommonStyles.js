import { StyleSheet } from 'react-native';

export const commonColors = {
    littleLemonGreen: '#495E57',
    littleLemonYellow: '#F4CE14',
    lightGrey: '#EDEFEE',
    darkGrey: '#333333',
    orange: '#EE9972',
};

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: commonColors.lightGrey,
        padding: 10,
        borderBottomWidth: 0.2
    },
    nameLogo: {
        width: 185,
        height: 40,
        alignSelf: 'center',
        marginVertical: 20
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: commonColors.orange,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10
    },
    textInput: {
        marginTop: 10,
        padding: 10,
        fontSize: 14,
        borderRadius: 10,
        borderWidth: 2,
    },
    buttonPrimary: {
        backgroundColor: commonColors.littleLemonGreen,
        borderRadius: 10,
    },
    logoutButton: {
        backgroundColor: commonColors.littleLemonYellow,
        borderRadius: 10,
    },
    buttonSecondary: {
        borderColor: commonColors.littleLemonGreen,
        borderWidth: 1
    },
    buttonDisabled: {
        backgroundColor: commonColors.lightGrey,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        padding: 40,
        paddingVertical: 10,
        textAlign: 'center',
        color: 'white',
    },
    buttonTextSecondary: {
        fontSize: 18,
        padding: 20,
        paddingVertical: 10,
        textAlign: 'center',
        color: commonColors.darkGrey,
    },
    subTitle: {
        fontSize: 32,
        color: 'white',
    },
    lead: {
        fontSize: 18,
        color: 'white',
        flex: 1
    },
});

export default commonStyles;