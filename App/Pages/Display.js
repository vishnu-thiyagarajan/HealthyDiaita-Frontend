import React from 'react'
import { Text, StyleSheet, Button, View } from 'react-native'

export default function Display ({navigation}) {
  const goToHome = () => navigation.navigate('Home');
    return (
        <View>
            <Text>Display Page</Text>
            <Button onPress={goToHome} title='Home'/>
        </View>
    )
}

const styles = StyleSheet.create({})
