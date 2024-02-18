import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home';
import Display from '../Pages/Display';
import Login from '../Pages/Login';

const Stack = createNativeStackNavigator();

export default function LandingScreen () {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen 
                    name="Display" 
                    component={Display} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
