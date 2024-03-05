import 'expo-dev-client';
import 'react-native-gesture-handler';
import {LogBox} from 'react-native';
import { AuthContext } from './App/Context/AuthContext';
import { useEffect, useState } from 'react';
import LandingScreen from './App/Components/LandingScreen';

export default function App() {
  const [userData, setUserData] = useState(null);
  useEffect(()=>LogBox.ignoreAllLogs(),[])
  return (
      <AuthContext.Provider value={{userData, setUserData}}>
        <LandingScreen />
      </AuthContext.Provider>
  );
}
