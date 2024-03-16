import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../Context/AuthContext';
import Colors from '../Shared/Colors';
import WelcomeHeader from './WelcomeHeader';

const DrawerList = [
  {icon: 'home', label: 'Home', navigateTo: 'Home'},
  {icon: 'restaurant', label: 'Food Intake', navigateTo: 'FoodIntake'},
  {icon: 'document', label: 'Documents', navigateTo: 'Documents'},
  {icon: 'card', label: 'Payments', navigateTo: 'Payments'},
];
const DrawerLayout = ({icon, label, navigateTo}) => {
  const { userData, selectedUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const moveTo = () => {
    if (userData?.role === 'Admin' && !selectedUser) return alert('Please select a user');
    navigation.navigate(navigateTo);
  }
  return (
    <DrawerItem
      icon={({color, size}) => <Ionicons name={icon} color={Colors.primary} size={size} />}
      label={label}
      onPress={moveTo}
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
    const { signOut } = useContext(AuthContext);
    
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
export default React.memo(DrawerContent);

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