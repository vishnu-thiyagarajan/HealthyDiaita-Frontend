import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default function Loader() {
  return (
    <View style={ [StyleSheet.absoluteFillObject, styles.container]}>
        <Image source={require('./../Assets/loader.gif')} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1,
    },
});