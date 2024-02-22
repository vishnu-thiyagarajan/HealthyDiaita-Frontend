import 'expo-dev-client';
import 'react-native-gesture-handler';
import { AuthContext } from './App/Context/AuthContext';
import { useState } from 'react';
import LandingScreen from './App/Components/LandingScreen';

export default function App() {
  const [userData, setUserData] = useState(null);
  return (
      <AuthContext.Provider value={{userData, setUserData}}>
        <LandingScreen />
      </AuthContext.Provider>
  );
}
