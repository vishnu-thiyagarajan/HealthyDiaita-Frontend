import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import Colors from '../Shared/Colors';
import { capitalizeFirstLetter } from '../Shared/Utils/utils';

function WelcomeHeader () {
    const {userData} = useContext(AuthContext);
    const formatedName = capitalizeFirstLetter(userData?.name);
    return (
        <View style={styles.container}>
            <View>
            <Text style={styles.text}>Hello,</Text>
            <Text style={styles.text}>{formatedName||'Balance Biter'}</Text>
            </View>
            <Image source={userData?.photo ? {uri: userData.photo} : require('./../Assets/Image/default-profile-image.png')} style={styles.profileimg}/>
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
    },
    text: {
        color: Colors.darkText
    }
})

export default React.memo(WelcomeHeader);