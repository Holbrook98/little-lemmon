import React from 'react';
import { View, Image, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../assets/CommonStyles';
import { Formik } from 'formik';
import * as yup from 'yup';

function Onboarding({ navigation }) {

  const onboardingValidationSchema = yup.object().shape({
    firstName: yup
      .string()
      .matches(/^[A-Za-z]+$/, 'Please enter a valid First Name (only letters).')
      .required('First Name is required.'),
    email: yup
      .string()
      .email('Please enter a valid email.')
      .required('Email is required.')
  });

  const saveChanges = (values) => {
    const userData = {
      firstName: values.firstName,
      lastName: '',
      email: values.email,
      phone: '',
      imagePath: ''
    };
    const preferences = {
      orderStatus: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
    };

    AsyncStorage.setItem('userData', JSON.stringify(userData));
    AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
    AsyncStorage.setItem('Onboarded', 'true');
    
    alert('Successfully signed up!');
    navigation.push('Home');
  };

  const renderForm = ({ handleChange, handleSubmit, values, errors, isValid }) => (
    <>
      <View style={styles.headerContainer}>
        <Text style={commonStyles.sectionTitle}>Let us get to know you</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={commonStyles.textInput}
          value={values.firstName}
          onChangeText={handleChange('firstName')}
          maxLength={100}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={commonStyles.textInput}
          value={values.email}
          onChangeText={handleChange('email')}
          maxLength={50}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <Pressable
        style={isValid ? commonStyles.buttonPrimary : commonStyles.buttonDisabled}
        disabled={!isValid}
        onPressIn={handleSubmit}
      >
        <Text style={commonStyles.buttonText}>Next</Text>
      </Pressable>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
    >
      <Image
        style={commonStyles.nameLogo}
        source={require('../assets/nameLogo.png')}
        resizeMode="contain"
        accessible={true}
        accessibilityLabel="Little Lemon Logo"
      />

      <Formik
        initialValues={{ firstName: '', email: '' }}
        validationSchema={onboardingValidationSchema}
        onSubmit={saveChanges}
      >
        {renderForm}
      </Formik>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 75
  },
  inputContainer: {
    marginVertical: 20
  },
  label: {
    fontSize: 20
  },
  errorText: {
    color: 'red'
  }
});

export default Onboarding;
