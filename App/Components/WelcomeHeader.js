import React, {useContext} from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { AuthContext } from '../Context/AuthContext';

export default function WelcomeHeader () {
    const {userData} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <View>
            <Text>Hello,</Text>
            <Text><Text>{userData?.user?.name||''}</Text></Text>
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
        alignItems: 'center'
    },
    profileimg: {
        width:40,
        height:40,
        borderRadius: 100
    }
})
