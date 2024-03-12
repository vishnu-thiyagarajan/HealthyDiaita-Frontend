import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import Documents from '../Pages/Documents';
import FoodIntake from '../Pages/FoodIntake';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Payments from '../Pages/Payments';
import ShowImage from '../Pages/ShowImage';
import Colors from '../Shared/Colors';
import Loader from '../Shared/Components/Loader';
import { truncate } from '../Shared/Utils/utils';
import DrawerContent from './DrawerContent';

const StackNav = () => {
    const {userData, selectedUser} = React.useContext(AuthContext);
    const formatedName = truncate(selectedUser?.username, 15);
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();
    const openDrawer = ()=>navigation.dispatch(DrawerActions.openDrawer())
    const headerRight = ()=>userData.role === 'Admin' &&<Text style={{ color: Colors.darkText}}>{formatedName}</Text>
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
