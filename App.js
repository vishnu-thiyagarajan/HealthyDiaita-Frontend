import { GoogleSignin } from '@react-native-google-signin/google-signin';
import 'expo-dev-client';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import LandingScreen from './App/Components/LandingScreen';
import { AuthContext } from './App/Context/AuthContext';
import { apiClient } from './App/Shared/Axios';
import { get, set } from './App/Shared/LocalStorage';
import { getJWT } from './App/Shared/Services/Auth';
import { getMe } from './App/Shared/Services/Users';

export default function App() {
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    forceCodeForRefreshToken: true,
    accountName: "",
  });

  const signIn = async () => {
    try{
      setLoading(true);
      await signOut();
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      await GoogleSignin.signIn();
      const { user : gUser } = await GoogleSignin.getCurrentUser();
      const { accessToken } = await GoogleSignin.getTokens();
      const response = await getJWT(accessToken);
      apiClient.defaults.headers.common = {'Authorization': `Bearer ${response?.data?.jwt}`}
      const {data: { role }} = await getMe();
      const user = {photo: gUser?.photo, role: role?.name, name: gUser?.name, jwt: response?.data?.jwt, ...response?.data?.user};
      setUserData(user);
      await set('auth', user);
    } catch (error) {
      if (error.code === "ERR_BAD_REQUEST") {
        alert('Your HealthyDiaita account is deactivated, Please contact the administrator!');
      } else {
        alert(`unexpected error : ${error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInOnNeed = async () => {
    setLoading(true);
    try {
      const cache = await get('auth');
      const isSignedIn = await GoogleSignin.isSignedIn();
      if(cache && isSignedIn) {
        setUserData(cache)
        apiClient.defaults.headers.common = {'Authorization': `Bearer ${cache?.jwt}`}
      }
    } catch (error) { 
      alert(`unexpected error : ${error}`);
    } finally {
      setLoading(false);
    }
  }
  
  const signOut = async () => {
    setLoading(true);
    try {
        await GoogleSignin.signOut();
        setUserData(null);
        apiClient.defaults.headers.common = {'Authorization': ''}
        await set('auth', null);
        await set('clientID', null);
    } catch (error) {
        alert(`unexpected error : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    console.log(JSON.stringify(process.env))
    SplashScreen.hide();
    LogBox.ignoreAllLogs()
    signInOnNeed();
  },[])

  return (
      <AuthContext.Provider value={{selectedUser, setSelectedUser, userData, loading, signIn, signOut}}>
        <LandingScreen />
      </AuthContext.Provider>
  );
}
