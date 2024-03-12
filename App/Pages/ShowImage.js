import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { ZoomImg } from '../Components/ZoomImg';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default function ShowImage (props){
    const {url, ext} = props?.route?.params;
    if(ext !== '.pdf') return (<ZoomImg url={url}/>)
    return(
      <View style={styles.container}>
        {url && <Pdf 
          source={{uri: url, cache: true}}
          trustAllCerts={false}
          style={styles.pdf}
        />}
      </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1},
  pdf: { 
    flex:1, 
    width: deviceWidth, 
    height: deviceHeight
  },
})