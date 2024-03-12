import { BACKEND_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import Button from '../Components/Button';
import EmptyListMessage from '../Components/EmptyListMessage';
import ShowDoc from '../Components/ShowDoc';
import { AuthContext } from '../Context/AuthContext';
import Colors from '../Shared/Colors';
import { AlertTwoButton } from '../Shared/Components/AlertWithButton';
import Loader from '../Shared/Components/Loader';
import { deleteDocuments, deleteFile, getDocuments, postDocuments, uploadDocuments } from '../Shared/Services/Documents';

const pageSize = 18;
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
    const {userData, selectedUser} = useContext(AuthContext);

    const userID = userData.role === 'Admin' ? selectedUser?.id : userData?.id;
    const userName = userData.role === 'Admin' ? selectedUser?.username : userData?.username;

    const getData = async () => {
      setLoading(true);
        try {
        const resp = await getDocuments(userID, 1, pageSize).catch((e)=>alert(e));
        setData(formatResp(resp));
        setCurrentPage(resp?.data?.meta?.pagination?.page);
        setPageCount(resp?.data?.meta?.pagination?.pageCount);
        } catch (e) {
          alert(e);
        } finally {
          setLoading(false);
        }
    }
    const DeleteAlert = (id, fileid)=>{
      const del = async () => {
        try {
          setLoading(true);
          const res = await deleteDocuments(id).catch(err => alert(JSON.stringify(err)));
          if(res.status === 200) {
            const resp = await deleteFile(fileid).catch(err => alert(JSON.stringify(err)));
            if(resp.status === 200) {
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
          const resp = await getDocuments(userID, currentPage + 1, pageSize).catch((e)=>alert(e));
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
          presentationStyle: 'fullScreen',
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
          allowMultiSelection: false,
        });
        if(docRes.size > 10000000) {
          setLoading(false);
          return alert("File size should be less than or equal to 10MB")
        }
        const formData = new FormData();
        formData.append('files', {
          uri: docRes.uri,
          name: userName + '|' + docRes.name,
          type: docRes.type
        });
        formData.append('ref', 'api::document.document');
        formData.append('field', 'file');
        const record = await postDocuments({ data: { user: userID}});
        const refId = record?.data?.data?.id;
        if(!refId) throw new Error('Record not created');
        formData.append('refId', String(refId));
        const res = await uploadDocuments(formData);
        if(res.status === 200) {
          alert('File was uploaded successfully!');
          getData();
        } else if(res.status === 400 || res.status === 500) {
          alert('Something went wrong, please try again!');
        }
      } catch (error) {
        if(!DocumentPicker.isCancel(error))
        alert("Error while uploading file: ", error);
      } finally {
        setLoading(false);
      }
    };

    const renderDoc = useCallback(({item}) => <ShowDoc item={item} DeleteAlert={DeleteAlert} navigeTo={navigeTo} />, [data]);
    const emptyDoc = () => <EmptyListMessage message="No Files have been added" />
    const scrollStart = () => stopFetchMore = false;
    
    return (
      <>
        {loading && <Loader/>}
        <View style={styles.header}>
          <Button text="Upload Document" onPress={pickFile} disabled={loading} />
          <Text style={styles.helperText}>*Long press to delete uploaded files!</Text>
        </View>
        {!loading && <FlatList
          contentContainerStyle={styles.content}
          ListEmptyComponent={emptyDoc}
          style={styles.container}
          onRefresh={getData}
          refreshing={refreshing}
          data={data}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0}
          onScrollBeginDrag={scrollStart}
          onEndReached={handleOnEndReached}
          renderItem={renderDoc}
          />}
      </>
    )
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1
  },
  container: {
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap:'wrap',
  },
  scroll: {backgroundColor: Colors.darkText,},
  header: { marginHorizontal: 30, marginVertical: 20,},
  helperText: { fontSize: 12, color: Colors.secondary, textAlign: 'center' },
})