import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../Shared/Colors';

function ShowPay({item}) {
    return (
    <View style={styles.itemRow}>
        <Text style={styles.text}>{item.createdAt}</Text>
        <Text style={styles.text}>₹{item.amount}</Text>
        <Text style={styles.text}>{item.status_code === 200 ?
        <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
        :
        <Ionicons name="close-circle" size={24} color={Colors.failure} />}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    itemRow:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: Colors.secondary,
    },
    text: {color: Colors.darkText,},
})

export default React.memo(ShowPay)
