import React from 'react'
import { Text, StyleSheet } from 'react-native'

export const ListFooterComponent = () => (
    <Text style={styles.text}>
      Loading...
    </Text>
  );

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    marginBottom: 10,
  }
});