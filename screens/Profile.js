import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { calculateImageText } from '../utils/CommonFunction';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import commonStyles, { commonColors } from '../assets/CommonStyles';
import Header from '../components/Header';
import { ProfileImage } from '../components/ProfileImage';
import { Formik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Profile({ navigation }) {
    const [imagePath, setImagePath] = React.useState('');
    const [imageText, setImageText] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [storedUserData, setStoredUserData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        imagePath: ''
    });

    const [preferences, setPreferences] = React.useState({
        orderStatus: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
    });

    // Yup validations for the form fields.
    const profileValidationSchema = yup.object().shape({
        firstName: yup
            .string("")
            .matches(/^[A-Za-z]+$/, 'Please enter a valid First Name (only letters).')
            .required("First Name is required."),
        lastName: yup
            .string("")
            .matches(/^[A-Za-z]+$/, 'Please enter a valid Last Name (only letters).')
            .required("Last Name is required."),
        email: yup
          .string()
          .email("Please enter valid email.")
          .required('Email is required.'),
        phone: yup
            .string()
            .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits.')
            .required('Phone number is required.'),
    })

    const updateState = (key) => () =>
        setPreferences((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));

    React.useEffect(() => {
        (async () => {
            try {
                let storedUserData = await AsyncStorage.getItem("userData");
                if (storedUserData != null) {
                    storedUserData = JSON.parse(storedUserData);
                    if (storedUserData.imagePath) setImagePath(storedUserData.imagePath);
                    if (storedUserData.firstName) setFirstName(storedUserData.firstName);
                    if (storedUserData.lastName) setLastName(storedUserData.lastName);
                    if (storedUserData.email) setEmail(storedUserData.email);
                    if (storedUserData.phone) setPhone(storedUserData.phone);
                    setStoredUserData({
                        firstName: storedUserData.firstName,
                        lastName: storedUserData.lastName,
                        email: storedUserData.email,
                        phone: storedUserData.phone,
                        imagePath: storedUserData.imagePath
                    });
                    setImageText(calculateImageText(storedUserData.lastName, storedUserData.firstName));
                    const preferences = await AsyncStorage.getItem("userPreferences");
                    setPreferences(preferences != null ? JSON.parse(preferences) : []);
                }
            }
            catch (err) { console.log(err); }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImagePath(result.assets[0].uri);
        }
    };

    const removeImage = async () => {
        setImagePath('');
        setImageText(calculateImageText(lastName, firstName));
        alert("Successfully removed profile image!")
    }

    const cancelChanges = () => {
        navigation.push('Home');
        return (alert("Updates successfully discarded!"));
    }

    const logout = async () => {    
        await AsyncStorage.clear();
        navigation.push('Onboarding');
        return (alert("Successfully logged out!"));
    }

    function goToProfile() {
        //Do nothing.
    }

    function goToHome() {
        navigation.push('Home');
    }

    const saveChanges = async (values) => {
        try {
            let userData = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                imagePath: imagePath,
                
            };
            const savedPref = JSON.stringify(preferences)
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
            await AsyncStorage.setItem("userPreferences", savedPref);
            setStoredUserData(userData);
            navigation.push('Home');
            return (alert("Updates successfully Saved!"));
        }
        catch (err) {
            return (alert("There was an error processing your updates. Please try again."));
        }
    }

    return (
        <View style={commonStyles.container}>
            <Header imagePath={storedUserData.imagePath} imageText={imageText} goToProfile={goToProfile} goToHome={goToHome} hideBack={false} />
            <ScrollView style={{ flex: 1 }}>
                <Formik
                    enableReinitialize={true}
                    validationSchema={profileValidationSchema}
                    initialValues={{
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone,
                    }}
                    onSubmit={values => saveChanges(values)}
                >
                    {({ 
                        handleChange, 
                        handleSubmit, 
                        values, 
                        errors, 
                        isValid 
                    }) => (
                    <>
                        <View style={{ marginVertical: 22 }}>
                            <Text style={commonStyles.sectionTitle}>Personal Information</Text>
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ fontSize: 18 }}>Profile Image</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 12
                                    }}>
                                    <ProfileImage path={imagePath} text={imageText} />
                                    <Pressable style={commonStyles.buttonPrimary} onPress={pickImage}>
                                        <Text style={commonStyles.buttonText}>Change</Text>
                                    </Pressable>
                                    <Pressable style={commonStyles.buttonSecondary} onPress={removeImage}>
                                        <Text style={commonStyles.buttonTextSecondary}>Remove</Text>
                                    </Pressable>
                                </View>
                            </View>
                            <View style={{ marginTop: 22 }}>
                                <Text style={{ fontSize: 18 }}>First Name</Text>
                                <TextInput
                                    style={commonStyles.textInput}
                                    value={values.firstName}
                                    onChangeText={handleChange('firstName')}
                                    maxLength={100}
                                />
                                {errors.firstName &&
                                  <Text style={{ color: 'red' }}>{errors.firstName}</Text>
                                }
                            </View>
                            <View style={{ marginTop: 22 }}>
                                <Text style={{ fontSize: 18 }}>Last Name</Text>
                                <TextInput
                                    style={commonStyles.textInput}
                                    value={values.lastName}
                                    onChangeText={handleChange('lastName')}
                                    maxLength={100}
                                />
                                {errors.lastName &&
                                  <Text style={{ color: 'red' }}>{errors.lastName}</Text>
                                }
                            </View>
                            <View style={{ marginTop: 22 }}>
                                <Text style={{ fontSize: 18 }}>Email</Text>
                                <TextInput
                                    style={commonStyles.textInput}
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    maxLength={50}
                                    keyboardType='email-address' 
                                />
                                {errors.email &&
                                  <Text style={{ color: 'red' }}>{errors.email}</Text>
                                }
                            </View>
                            <View style={{ marginTop: 22 }}>
                                <Text style={{ fontSize: 18 }}>Phone Number</Text>
                                <TextInput
                                    style={commonStyles.textInput}
                                    value={values.phone}
                                    onChangeText={handleChange('phone')}
                                    maxLength={10}
                                    keyboardType='number-pad'
                                />
                                {errors.phone &&
                                  <Text style={{ color: 'red' }}>{errors.phone}</Text>
                                }
                            </View>
                        </View>
                        <View style={{ marginBottom: 25 }}>
                            <Text style={commonStyles.sectionTitle}>Email Notifications</Text>
                            <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPressIn={updateState('orderStatus')}>
                                <Checkbox
                                    color={commonColors.littleLemonGreen}
                                    value={preferences.orderStatus}
                                    onValueChange={updateState('orderStatus')}
                                />
                                <Text style={{ fontSize: 18, paddingHorizontal: 10 }}>Order statuses</Text>
                            </Pressable>
                            <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPressIn={updateState('passwordChanges')}>
                                <Checkbox
                                    color={commonColors.littleLemonGreen}
                                    value={preferences.passwordChanges}
                                    onValueChange={updateState('passwordChanges')}
                                />
                                <Text style={{ fontSize: 18, paddingHorizontal: 10 }}>Password Changes</Text>
                            </Pressable>
                            <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPressIn={updateState('specialOffers')}>
                                <Checkbox
                                    color={commonColors.littleLemonGreen}
                                    value={preferences.specialOffers}
                                    onValueChange={updateState('specialOffers')}
                                />
                                <Text style={{ fontSize: 18, paddingHorizontal: 10 }}>Special Offers</Text>
                            </Pressable>
                            <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPressIn={updateState('newsletter')}>
                                <Checkbox
                                    color={commonColors.littleLemonGreen}
                                    value={preferences.newsletter}
                                    onValueChange={updateState('newsletter')}
                                />
                                <Text style={{ fontSize: 18, paddingHorizontal: 10 }}>Newsletter</Text>
                            </Pressable>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <Pressable
                                style={commonStyles.buttonSecondary}
                                onPressIn={cancelChanges}>
                                <Text style={commonStyles.buttonTextSecondary}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={isValid ? commonStyles.buttonPrimary : commonStyles.buttonDisabled}
                                disabled={!isValid}
                                onPressIn={handleSubmit}>
                                <Text style={commonStyles.buttonText}>Save</Text>
                            </Pressable>
                        </View>
                        <View style={{ marginVertical: 22 }}>
                            <Pressable
                                style={commonStyles.logoutButton}
                                onPressIn={logout}>
                                <Text style={commonStyles.buttonTextSecondary}>Log Out</Text>
                            </Pressable>
                        </View>
                    </>
                    )}
                </Formik>
            </ScrollView>
        </View>
    )
}

export default Profile;