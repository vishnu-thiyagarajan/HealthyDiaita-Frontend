import AsyncStorage from '@react-native-async-storage/async-storage';

export const get = async (key) => {
    try {
    const result = await AsyncStorage.getItem(key);
    return result ? JSON.parse(result) : null;
    } catch(e) {
    alert("error:" + e);
    }  
}

export const set = async (key, value) => {
    try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
    alert("error:" + e);
    }  
}

export const clear = async () => {
    try {
      await AsyncStorage.clear();
    } catch(e) {
      alert("error:" + e);
    }
}