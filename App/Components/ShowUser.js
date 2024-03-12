import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import Colors from '../Shared/Colors';

function ShowUser({item}) {
    const {selectedUser, setSelectedUser} = useContext(AuthContext);
    const selectUser = () => setSelectedUser(item);

    return (
    <TouchableOpacity onPress={selectUser}>
      <View style={styles.itemRow}>
          <Text style={styles.text}>{item.id}</Text>
          <Text style={styles.text}>{item.username}</Text>
          <Text style={styles.text}>{item.id === selectedUser?.id &&
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />}</Text>
      </View>
    </TouchableOpacity>
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
        borderWidth: 3,
        borderColor: Colors.primary,
        backgroundColor: Colors.secondary,
      },
    text: {color: Colors.darkText,},
}) 

export default React.memo(ShowUser)
