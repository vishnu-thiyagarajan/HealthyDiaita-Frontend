import React from 'react'
import { StyleSheet, Text } from 'react-native';

function EmptyListMessage({message}) {
  return (
    <Text style={styles.centerText}>{message}</Text>
  )
}

const styles = StyleSheet.create({
  centerText: {textAlign: "center"},
});
export default EmptyListMessage
