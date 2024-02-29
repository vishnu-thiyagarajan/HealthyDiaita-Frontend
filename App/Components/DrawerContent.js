import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import WelcomeHeader from './WelcomeHeader';
import Colors from '../Shared/Colors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthContext } from '../Context/AuthContext';
import { set } from '../Shared/LocalStorage';

const DrawerList = [
  {icon: 'home-outline', label: 'Home', navigateTo: 'Home'},
  {icon: 'person-circle', label: 'Documents', navigateTo: 'Documents'},
  {icon: 'reader-outline', label: 'Food Intake', navigateTo: 'FoodIntake'},
];
const DrawerLayout = ({icon, label, navigateTo}) => {
  const navigation = useNavigation();
  return (
    <DrawerItem
      icon={({color, size}) => <Ionicons name={icon} color={Colors.primary} size={size} />}
      label={label}
      onPress={() => {
        navigation.navigate(navigateTo);
      }}
    />
  );
};

const DrawerItems = props => {
    return DrawerList.map((el, i) => {
      return (
        <DrawerLayout
          key={i}
          icon={el.icon}
          label={el.label}
          navigateTo={el.navigateTo}
        />
      );
    });
  };
function DrawerContent(props) {
    const { setUserData } = useContext(AuthContext);
    const navigation = useNavigation();
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
        <View style={styles.drawerContent}>
        <DrawerContentScrollView {...props}>
            <View>
            <TouchableOpacity activeOpacity={0.8}>
                <View style={styles.userInfoSection}>
                <WelcomeHeader/>
                </View>
            </TouchableOpacity>
            <View style={styles.drawerSection}>
                <DrawerItems />
            </View>
            </View>
        </DrawerContentScrollView>
        <View style={styles.bottomDrawerSection}>
            <DrawerItem
            icon={({color, size}) => (
                <Ionicons name="log-out" color={Colors.primary} size={size} />
            )}
            label="Sign Out"
            onPress={signOut}
            />
        </View>
        </View>
    );
}
export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    padding: 10,
    backgroundColor: Colors.secondary,
    marginTop: -5,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 13,
    lineHeight: 14,
    width: '100%',
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 10,
    borderBottomWidth: 0,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#dedede',
    borderTopWidth: 1,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});