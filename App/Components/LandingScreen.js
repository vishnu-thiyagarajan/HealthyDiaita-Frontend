import * as React from 'react';
import {NavigationContainer, useNavigation, DrawerActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home';
import FoodIntake from '../Pages/FoodIntake';
import Login from '../Pages/Login';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DrawerContent from './DrawerContent';
import Colors from '../Shared/Colors';
import Documents from '../Pages/Documents';
import ShowImage from '../Pages/ShowImage';
import Payments from '../Pages/Payments';
import { Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import Loader from './Loader';
import { truncate } from '../Shared/Utils/utils';

const StackNav = () => {
    const {userData, selectedUser} = React.useContext(AuthContext);
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();
    const openDrawer = ()=>navigation.dispatch(DrawerActions.openDrawer())
    const headerRight = ()=>userData.role === 'Admin' &&<Text style={{ color: Colors.darkText}}>{truncate(selectedUser?.username, 15)}</Text>
    const headerLeft = ()=>{
        return (
            <TouchableOpacity style={{padding:10}} onPress={openDrawer}>
                <Ionicons
                    name="menu" 
                    size={24}
                    color={Colors.primary}
                />
            </TouchableOpacity>
        )
    }
    return (
        <Stack.Navigator screenOptions={{
            statusBarColor: Colors.lightText,
            headerStyle: {
              backgroundColor: Colors.secondary,
            },
            headerTintColor: Colors.primary,
            headerTitleAlign: 'center',
          }}>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    headerLeft,
                    headerRight,
                }}
            />
            <Stack.Screen 
                name="FoodIntake" 
                component={FoodIntake}
                options={{
                    headerLeft,
                    headerRight,
                }} 
            />
            <Stack.Screen 
                name="Documents" 
                component={Documents}
                options={{
                    headerLeft,
                    headerRight,
                }} 
            />
            <Stack.Screen 
                name="Payments"  
                component={Payments}
                options={{
                    headerLeft,
                    headerRight,
                }}
            />
            <Stack.Screen 
                name="ShowImage"  
                component={ShowImage}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const AppDrawerNav = () => {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />} 
            screenOptions={{
                headerShown: false
        }}>
            <Drawer.Screen
                name="Land"
                component={StackNav}
            />
        </Drawer.Navigator>
    )
}

const AuthStackNav = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default function LandingScreen () {
    const {userData, loading} = React.useContext(AuthContext);
    if(loading) return <Loader/>
    return (
        <NavigationContainer>
            {userData ? <AppDrawerNav/>: <AuthStackNav/>}
        </NavigationContainer>
    )
}
