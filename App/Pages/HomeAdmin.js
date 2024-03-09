import React, {useState, useEffect, useContext} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Shared/Colors';
import { getClientUsers, getClientUsersCount, getRoles, searchClientUser } from '../Shared/Services/Users';
import Loader from '../Components/Loader';
import { AuthContext } from '../Context/AuthContext';
import EmptyListMessage from '../Components/EmptyListMessage';

const pageSize = 20;
let stopFetchMore = true;

const formatResp = (resp) => {
  const users = resp?.data;
  return users?.map((item) => {
      return {
          id: item.id,
          username: item.username,
          email: item.email,
      }
  })
}
function HomeAdmin() {
  const [srch, setSrch] = useState('');
  const [data, setData] = useState([]);
  const [start, setStart] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onChangeSrch = (text)=> setSrch(text)
  const {selectedUser, setSelectedUser} = useContext(AuthContext);
  const selectUser = (user)=> setSelectedUser(user);
  const [clientRoleID, setClientRoleID] = useState(null);
  const emptyText = `No Users have been registered ${srch ? 'for search term' : ''}`;
  const getClientID = async () => {
    try {
      const response = await getRoles();
      const {id} = response?.data?.roles?.find((role) => role.name === 'Client');
      setClientRoleID(id);
      return id;
    } catch (error) {
      alert(`unexpected error : ${error}`);
    }
  }
  const getData = async() => {
    try {
      setLoading(true);
      if (!srch) {
        const roleID = clientRoleID || await getClientID();
        const res = await getClientUsersCount(roleID).catch((e)=>alert(e));
        setUserCount(res?.data);
        const resp = await getClientUsers(0, pageSize).catch((e)=>alert(e));
        setStart(pageSize);
        setData(formatResp(resp));
      } else {
        if (srch.length < 3) return alert('Please type 3 characters of username');
        const resp = await searchClientUser(srch).catch((e)=>alert(e));
        setData(formatResp(resp));
      }
    } catch (e) {
        alert(e);
    } finally {
        setLoading(false);
    }
  }
  const handleOnEndReached = async () => {
    setRefreshing(true);
    try {
        if (!stopFetchMore) {
        if (start > userCount) return setRefreshing(false);
        const resp = await getClientUsers(start, pageSize).catch((e)=>alert(e));
        const formattedResp = formatResp(resp);
        setData([...data, ...formattedResp]);
        setStart(start + pageSize);
        stopFetchMore = true;
        }
    } catch (e) {
        alert(e);
    } finally {
        setRefreshing(false);
    }
  };
  useEffect(()=>{
      getData();
  },[])
  return (
    <>
    {loading && <Loader />}
    <View style={styles.container}>
      <TextInput
        placeholder="Search username ( 3 characters alteast )"
        onChangeText={onChangeSrch}
      />
      <TouchableOpacity onPress={getData}>
        <Ionicons name="search" color={Colors.primary} size={24} />
      </TouchableOpacity>
    </View>
    {!loading && <FlatList
        style={styles.list}
        ListEmptyComponent={() => <EmptyListMessage message={emptyText} />}
        data={data}
        onRefresh={srch ? null : getData}
        refreshing={srch ? false : refreshing}
        renderItem={({item}) => 
          <TouchableOpacity onPress={() => selectUser(item)}>
            <View style={styles.itemRow}>
                <Text style={styles.text}>{item.id}</Text>
                <Text style={styles.text}>{item.username}</Text>
                <Text style={styles.text}>{item.id === selectedUser?.id &&
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />}</Text>
            </View>
          </TouchableOpacity>}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0}
        onScrollBeginDrag={() => {
        if (!srch) stopFetchMore = false;
        }}
        ListHeaderComponent={()=> <View style={styles.header}>
                <Text style={styles.headerText}>User ID</Text>
                <Text style={styles.headerText}>User Name</Text>
                <Text style={styles.headerText}>Selected</Text>
            </View>}
        onEndReached={srch ? null : handleOnEndReached}
        />}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    color: Colors.lightText,
    borderRadius: 10,
  },
  list: {
    padding: 10,
  },
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
  header:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginBottom: 10,
    padding: 10,
  },
  text: {color: Colors.darkText,},
  headerText: {color: Colors.lightText,},
})
export default HomeAdmin
