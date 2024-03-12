import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../Shared/Colors';

const {height, width } = Dimensions.get('window');

function ShowDoc({item, DeleteAlert, navigeTo}) {
    const delFunc = () => DeleteAlert(item.id, item.fileid);
    const openFunc = ()=> navigeTo(item);
    return( 
        <Pressable key={item.id} onPress={item.name ? openFunc : null} onLongPress={delFunc}>
        {item.ext === '.pdf' || !item.name ?
        <View style={styles.docs}>
            <Text>{item.name|| "File Not Uploaded"}</Text>
        </View>
        :
        <Image
            source={{ uri: item.thumbnail }}
            style={styles.docs}
        />
        }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    docs: { 
      justifyContent:'center', 
      alignItems: 'center', 
      width: width/3 -6, 
      height: height/5,
      borderRadius: 10, 
      margin:2, 
      borderWidth: 1,
      borderColor: Colors.primary, 
    },
});
export default React.memo(ShowDoc)
