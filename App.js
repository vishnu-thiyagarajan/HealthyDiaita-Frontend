import 'expo-dev-client';
import 'react-native-gesture-handler';
import {LogBox} from 'react-native';
import { AuthContext } from './App/Context/AuthContext';
import { useEffect, useState } from 'react';
import LandingScreen from './App/Components/LandingScreen';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { set, get } from './App/Shared/LocalStorage';
import {GOOGLE_WEB_CLIENT_ID} from '@env';
import { getJWT } from './App/Shared/Services/Auth';
import { getMe } from './App/Shared/Services/Users';
import { apiClient } from './App/Shared/Axios';

export default function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
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
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('The login flow is cancelled!');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Sign in operation is in progress already!');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google Play services not available or outdated!');
      } if (error.code === "ERR_BAD_REQUEST") {
        alert('Your HealthyDiaita account is deactivated, Please contact the administrator!');
      } else {
        alert(`unexpected error : ${error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInAndSetRole = async () => {
    setLoading(true);
    try {
      const cache = await get('auth');
      const isSignedIn = await GoogleSignin.isSignedIn();
      if(cache && isSignedIn) {
        setUserData(cache)
      } else {
        signIn();
      }
    } catch (error) { 
      alert(`unexpected error : ${error}`);
    } finally {
      setLoading(false);
    }
  }
  
  const signOut = async () => {
    try {
        await GoogleSignin.signOut();
        setUserData(null);
        apiClient.defaults.headers.common = {'Authorization': ''}
        await set('auth', null);
    } catch (error) {
        alert(`unexpected error : ${error}`);
    }
  };
  useEffect(()=>{
    LogBox.ignoreAllLogs()
    signInAndSetRole();
  },[])

  return (
      <AuthContext.Provider value={{userData, loading, signIn, signOut}}>
        <LandingScreen />
      </AuthContext.Provider>
  );
}
