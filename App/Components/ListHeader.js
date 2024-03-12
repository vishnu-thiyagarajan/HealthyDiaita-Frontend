import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../Shared/Colors';

function ListHeader({columns}) {
  return (
    <View style={styles.header}>
        {columns.map((name)=><Text key={name} style={styles.headerText}>{name}</Text>)}
    </View>
  )
}

const styles = StyleSheet.create({
    header:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginBottom: 10,
        padding: 10,
    },
    headerText: {color: Colors.lightText,},
});
export default React.memo(ListHeader);
