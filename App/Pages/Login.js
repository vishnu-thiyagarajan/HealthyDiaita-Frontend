import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import Button from '../Components/Button';
import { AuthContext } from '../Context/AuthContext';
import Colors from '../Shared/Colors';
import Loader from '../Shared/Components/Loader';

export default function Login() {
  const {loading, signIn} = useContext(AuthContext);

  return (
    <View style={{flex:1}}>
      <StatusBar style="auto"/>
      {loading && <Loader />}
      <Image source={require('./../Assets/Image/login.png')} style={styles.image} />
      <View style={styles.container}>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.welcome}>to</Text>
          <Text style={styles.welcome}>Healthy Diaita</Text>
      </View>
      <Text style={styles.login}>Login/SignUp</Text>
      <Button 
        text="Sign In with Google" 
        onPress={signIn} icon={<Ionicons name="logo-google" size={24} color={Colors.secondary} />} 
        disabled={loading}
      />
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
})