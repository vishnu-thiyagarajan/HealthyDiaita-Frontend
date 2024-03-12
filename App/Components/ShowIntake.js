import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../Shared/Colors';

function ShowIntake({item, data, DeleteAlert }) {
    return (
        <>
        <Text>{item}</Text>
        <View style={styles.itemRow}>
            {data[item].map(meal=>{
                const delFunc = () => DeleteAlert(meal.key);
                return (
                <View key={meal.key}>
                    <View style={styles.section}>
                    <Text style={styles.meal}>{meal.mealtime}</Text>
                    <TouchableOpacity onPress={delFunc} activeOpacity={0.8}>
                        <Ionicons name="trash-outline" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    </View>
                    <View style={styles.itemSubRow}>
                    <Text style={styles.meal}>{meal.food}</Text>
                    {meal.note && <Text style={styles.meal}>note: {meal.note}</Text>}
                    </View>
                </View>
                )
            })}
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    itemRow:{
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: Colors.secondary,
      },
      itemSubRow:{
        padding: 10,
      },
      meal:{
        color: Colors.darkText,
      },
      section: {flex:1, flexDirection:'row', justifyContent:'space-between'},
})
export default React.memo(ShowIntake)
