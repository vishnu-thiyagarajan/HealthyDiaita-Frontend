import React, {useContext} from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { AuthContext } from '../Context/AuthContext';
import Colors from '../Shared/Colors';

export default function WelcomeHeader () {
    const {userData} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <View>
            <Text style={{color: Colors.darkText}}>Hello,</Text>
            <Text style={{color: Colors.darkText}}>{userData?.user?.name||''}</Text>
            </View>
            <Image source={userData?.user?.photo ? {uri: userData.user.photo} : require('./../Assets/Image/default-profile-image.png')} style={styles.profileimg}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileimg: {
        width:40,
        height:40,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: Colors.darkText,
        marginRight: 15,
    }
})
