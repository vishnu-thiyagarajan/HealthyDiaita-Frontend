import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Dimensions, Pressable, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { AuthContext } from '../Context/AuthContext';
import { getDocuments, deleteDocuments, uploadDocuments, postDocuments, deleteFile } from '../Shared/Services/Documents';
import { BACKEND_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Shared/Colors';
import { AlertTwoButton } from '../Shared/Components/AlertWithButton';
import DocumentPicker from 'react-native-document-picker'
import Loader from '../Components/Loader';

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
            fileid: item.attributes?.file?.data?.id,
            name: file?.name,
            url: BACKEND_URL + file?.url,
            ext:  file?.ext,
            thumbnail: BACKEND_URL + file?.formats?.thumbnail?.url,
        }
    })
}
export default function Documents (){
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const {userData} = useContext(AuthContext);

    const getData = async () => {
        setRefreshing(true);
        try {
        const resp = await getDocuments(userData?.id, 1, pageSize).catch((e)=>alert(e));
        setData(formatResp(resp));
        setCurrentPage(resp?.data?.meta?.pagination?.page);
        setPageCount(resp?.data?.meta?.pagination?.pageCount);
        } catch (e) {
          alert(e);
        } finally {
          setRefreshing(false);
        }
    }
    const DeleteAlert = (id, fileid)=>{
      const del = async () => {
        try {
          setLoading(true);
          const resp = await deleteFile(fileid).catch(err => alert(JSON.stringify(err)));
          if(resp.status === 200) {
            const res = await deleteDocuments(id).catch(err => alert(JSON.stringify(err)));
            if(res.status === 200) {
              alert('Data was deleted successfully!');
              getData();
            }
          }
        } catch (e) {
          alert(e);
        } finally {
          setLoading(false);
        }
      }
      return AlertTwoButton('Deleting...', 'Are you sure you want to delete?', null, del);
    }
    const handleOnEndReached = async () => {
      setRefreshing(true);
      try {
        if (!stopFetchMore) {
          if (currentPage >= pageCount) return setRefreshing(false);
          const resp = await getDocuments(userData?.id, currentPage + 1, pageSize).catch((e)=>alert(e));
          const formattedResp = formatResp(resp);
          setData([...data, ...formattedResp]);
          setCurrentPage(resp?.data?.meta?.pagination?.page);
          stopFetchMore = true;
        }
      } catch (e) {
        alert(e);
      } finally {
        setRefreshing(false);
      }
    };
    const navigeTo = (item)=>{
      navigation.navigate('ShowImage', item);
    }
    useEffect(() => {
        getData();
    },[])

    const pickFile = async () => {
      setLoading(true);
      try {
        const docRes = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf]
        });
        if(docRes.size > 10000000) {
          setLoading(false);
          return alert("File size should be less than or equal to 10MB")
        }
        const formData = new FormData();
        formData.append('files', {
          uri: docRes.uri,
          name: docRes.name,
          type: docRes.type
        });
        formData.append('ref', 'api::document.document');
        formData.append('field', 'file');
        const record = await postDocuments({ data: { users_permissions_user: userData?.id}});
        const refId = record?.data?.data?.id;
        if(!refId) throw new Error('Record not created');
        formData.append('refId', String(refId));
        const res = await uploadDocuments(formData);
        if(res.status === 200) {
          alert('File was uploaded successfully!');
          getData();
        }
      } catch (error) {
        if(!DocumentPicker.isCancel(error))
        alert("Error while uploading file: ", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        {loading && <Loader/>}
        <View style={styles.header}>
          <TouchableOpacity onPress={pickFile} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>Upload Documents</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>*Long press to delete uploaded files!</Text>
        </View>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={() => refreshing ? <Loader/> : <Text style={styles.centerText}>No Files have been added</Text>}
          style={styles.container}
          onRefresh={getData}
          refreshing={refreshing}
          data={data}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0}
          onScrollBeginDrag={() => {
            stopFetchMore = false;
          }}
          onEndReached={handleOnEndReached}
          renderItem={({item})=>{
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
  centerText: {textAlign: "center"},
})