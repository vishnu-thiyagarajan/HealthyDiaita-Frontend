import React, { useContext, useEffect, useState} from 'react'
import { TouchableOpacity, Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import Colors from '../Shared/Colors'
import { Ionicons } from '@expo/vector-icons'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { AuthContext } from '../Context/AuthContext';
import { set, get } from '../Shared/LocalStorage';
import Loader from '../Components/Loader';

export default function Login({navigation}) {
  const {userData, setUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  GoogleSignin.configure({
    webClientId: '23129691985-odca9vqg3hogcmfahni4regvh2nfq6of.apps.googleusercontent.com',
  });

  const signIn = async () => {
      try {
        setLoading(true);
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();
        setUserData(userInfo);
        await set('auth', userInfo);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          alert('The login flow is cancelled!');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          alert('Sign in operation is in progress already!');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          alert('Google Play services not available or outdated!');
        } else {
          alert(`unexpected error : ${error}`);
        }
      }
    setLoading(false);
  };

  // const isSignedIn = async () => {
  //     const isSignedIn = await GoogleSignin.isSignedIn();
  //     return isSignedIn;
  // };

  // const getCurrentUser = async () => {
  //     const currentUser = await GoogleSignin.getCurrentUser();
  //     return currentUser;
  // };
  useEffect(()=>{
    const fetchUser = async() => {
      setLoading(true);
      const resp = await get('auth');
      if(resp) navigation.navigate('Home');
      setUserData(resp||null);
      setLoading(false);
    }
    fetchUser();
  },[]);
  
  useEffect(()=>{
    if(userData) navigation.navigate('Home');
  },[userData])

  return (
    <View style={{flex:1}}>
      <Image source={require('./../Assets/Image/login.png')} style={styles.image} />
      <View style={styles.container}>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.welcome}>to</Text>
          <Text style={styles.welcome}>Healthy Diaita</Text>
      </View>
      <Text style={styles.login} >Login/SignUp</Text>
      <TouchableOpacity onPress={signIn} style={styles.button} disabled={loading}>
          <Ionicons name="logo-google" size={24} color={Colors.secondary} />
          <Text style={styles.buttonText}>Sign In with Google</Text>
      </TouchableOpacity>
      {loading && <Loader />}
    </View>
  )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    container: {
        padding: 40,
        marginTop: -25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    welcome : { fontSize: 35, textAlign: 'center', fontWeight: 'bold' },
    login: {textAlign: 'center', fontWeight: 'bold'},
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
    buttonText: { marginLeft: 10 ,fontSize: 20, color: Colors.secondary, textAlign: 'center', fontWeight: 'bold'},
})