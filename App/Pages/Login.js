import React, { useContext} from 'react'
import { TouchableOpacity, Image, StyleSheet, Text, View, StatusBar } from 'react-native'
import Colors from '../Shared/Colors'
import { Ionicons } from '@expo/vector-icons'
import { AuthContext } from '../Context/AuthContext';
import Loader from '../Components/Loader';

export default function Login() {
  const {loading, signIn} = useContext(AuthContext);

  return (
    <View style={{flex:1}}>
      <StatusBar style="auto"/>
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