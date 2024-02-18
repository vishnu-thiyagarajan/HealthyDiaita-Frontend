import React, {useContext} from 'react'
import { TouchableOpacity, Text, StyleSheet, View, Button } from 'react-native'

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../Shared/Colors';
import { AuthContext } from '../Context/AuthContext';
import { set } from '../Shared/LocalStorage';
import WelcomeHeader from '../Components/WelcomeHeader';

export default function Home ({navigation}){
  const {userData, setUserData} = useContext(AuthContext);
  const goToDisplay = () => navigation.navigate('Display');
  GoogleSignin.configure({
      webClientId: '23129691985-odca9vqg3hogcmfahni4regvh2nfq6of.apps.googleusercontent.com',
    });
  const signOut = async () => {
      try {
        await GoogleSignin.signOut();
        setUserData(null);
        await set('auth', null);
        navigation.navigate('Login');
      } catch (error) {
        alert(`unexpected error : ${error}`);
      }
  };
  return (
    <View style={{padding:20}}>
      <WelcomeHeader/>
      <Button onPress={goToDisplay} title='Display'/>
      <TouchableOpacity onPress={signOut} style={styles.button}>
        <Ionicons name="logo-google" size={24} color={Colors.secondary} />
        <Text style={styles.buttonText}>Sign Out with Google</Text>
    </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        padding: 10,
        margin: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: { 
        marginLeft: 10,
        fontSize: 20,
        color: Colors.secondary,
        textAlign: 'center',
        fontWeight: 'bold'
    },
})
