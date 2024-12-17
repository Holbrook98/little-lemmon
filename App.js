import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Profile from './screens/Profile';
import Home from './screens/Home';
import Onboarding from './screens/Onboarding';
import { useEffect, useState } from 'react';

const Stack = createStackNavigator();

export default function App() {

  const [Onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    (async () => {
        const storedOnboarded = await AsyncStorage.getItem("Onboarded");
        setOnboarded(storedOnboarded === null ? false : true);
    })
  })

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={Onboarded ? 'Home' : 'Onboarding'}
      >
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

