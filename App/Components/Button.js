import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../Shared/Colors';

function Button({text, onPress, icon, disabled}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} disabled={disabled}>
        {icon}
        <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        padding: 10,
        marginHorizontal: 30,
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: { 
        marginLeft: 10 ,
        fontSize: 20,
        color: Colors.secondary,
        textAlign: 'center',
        fontWeight: 'bold'
    },
})
export default React.memo(Button)
