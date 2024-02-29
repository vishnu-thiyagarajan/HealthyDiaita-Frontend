import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Dimensions, Pressable, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { AuthContext } from '../Context/AuthContext';
import { getDocuments, deleteDocuments, uploadDocuments, postDocuments } from '../Shared/Services/Documents';
import { baseURL } from '../Shared/Axios';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Shared/Colors';
import { AlertTwoButton } from '../Shared/Components/AlertWithButton';
import { ListFooterComponent } from '../Components/ListFooterComponent'
import DocumentPicker from 'react-native-document-picker'
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const pageSize = 20;
let stopFetchMore = true;

const formatResp = (resp) => {
    const files = resp?.data?.data;
    return files?.map((item) => {
        const file = item.attributes?.file?.data?.attributes;
        return {
            id: item.id,
            name: file?.name,
            url: baseURL + file?.url,
            ext:  file?.ext,
            thumbnail: baseURL + file?.formats?.thumbnail?.url,
        }
    })
}
export default function Documents (){
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const {userData} = useContext(AuthContext);

    const getData = async () => {
        setLoadingMore(true);
        const resp = await getDocuments(userData?.user?.email, 1, pageSize).catch((e)=>alert(e));
        setData(formatResp(resp));
        setLoadingMore(false);
        setCurrentPage(resp?.data?.meta?.pagination?.page);
        setPageCount(resp?.data?.meta?.pagination?.pageCount);
    }
    const DeleteAlert = (id)=>{
      const del = async () => {
        const res = await deleteDocuments(id).catch(err => alert(err.message));
        if(res.status === 200) {
          alert('Data was deleted successfully!');
          getData();
        }
      }
      return AlertTwoButton('Deleting...', 'Are you sure you want to delete?', null, del);
    }
    const handleOnEndReached = async () => {
      setLoadingMore(true);
      if (!stopFetchMore) {
        if (currentPage >= pageCount) return setLoadingMore(false);
        const resp = await getDocuments(userData?.user?.email, currentPage + 1, pageSize).catch((e)=>alert(e));
        const formattedResp = formatResp(resp);
        setData([...data, ...formattedResp]);
        setCurrentPage(resp?.data?.meta?.pagination?.page);
        stopFetchMore = true;
      }
      setLoadingMore(false);
    };
    const navigeTo = (item)=>{
      navigation.navigate('ShowImage', item);
    }
    useEffect(() => {
        getData();
    },[])

    const pickFile = async () => {
      try {
        setLoadingMore(true);
        const docRes = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf]
        });
        const formData = new FormData();
        formData.append('files', {
          uri: docRes.uri,
          name: docRes.name,
          type: docRes.type
        });
        formData.append('ref', 'api::document.document');
        formData.append('field', 'file');
        const record = await postDocuments({ data: { email: userData?.user?.email}});
        const refId = record?.data?.data?.id;
        if(!refId) throw new Error('Record not created');
        formData.append('refId', String(refId));
        const res = await uploadDocuments(formData);
        setLoadingMore(false);
        if(res.status === 200) {
          alert('File was uploaded successfully!');
          getData();
        }
      } catch (error) {
        if(!DocumentPicker.isCancel(error))
        alert("Error while uploading file: ", error);
      }
    };

    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickFile} style={styles.button} disabled={loadingMore}>
            <Text style={styles.buttonText}>Upload Documents</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>*Long press to delete uploaded files!</Text>
        </View>
        <FlatList
          style={styles.container}
          data={data}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0}
          onScrollBeginDrag={() => {
            stopFetchMore = false;
          }}
          ListFooterComponent={() => loadingMore && <ListFooterComponent />}
          onEndReached={handleOnEndReached}
          renderItem={({item})=>{
            const delFunc = () => DeleteAlert(item.id);
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
          }}
          />
      </>
    )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap:'wrap',
  },
  scroll: {backgroundColor: Colors.darkText,},
  docs: { 
    justifyContent:'center', 
    alignItems: 'center', 
    width: deviceWidth/3 -6, 
    height: deviceHeight/5,
    borderRadius: 10, 
    margin:2, 
    borderWidth: 1,
    borderColor: Colors.primary, 
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: { 
    marginLeft: 10,
    fontSize: 20, 
    color: Colors.secondary, 
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  header: { marginHorizontal: 30, marginVertical: 20,},
  helperText: { fontSize: 12, color: Colors.secondary, textAlign: 'center' },
})