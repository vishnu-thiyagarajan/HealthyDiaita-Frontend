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
import { TouchableOpacity } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import Loader from './Loader';

const StackNav = () => {
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();
    const openDrawer = ()=>navigation.dispatch(DrawerActions.openDrawer())
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
                    headerLeft: ()=>{
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
                }}
            />
            <Stack.Screen 
                name="FoodIntake" 
                component={FoodIntake} 
            />
            <Stack.Screen 
                name="Documents" 
                component={Documents} 
            />
            <Stack.Screen 
                name="ShowImage"  
                component={ShowImage}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="Payments"  
                component={Payments}
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
