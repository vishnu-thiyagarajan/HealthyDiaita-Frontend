import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import EmptyListMessage from '../Components/EmptyListMessage';
import ListHeader from '../Components/ListHeader';
import ShowUser from '../Components/ShowUser';
import Colors from '../Shared/Colors';
import Loader from '../Shared/Components/Loader';
import { get, set } from '../Shared/LocalStorage';
import { getClientUsers, getClientUsersCount, getRoles, searchClientUser } from '../Shared/Services/Users';

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
  const onChangeSrch = (text)=> setSrch(text);
  const [clientRoleID, setClientRoleID] = useState(null);
  const emptyText = `No Users have been registered ${srch ? 'for search term' : ''}`;
  const getClientID = async () => {
    try {
      const cache = await get('clientID');
      if (cache) return cache;
      const response = await getRoles();
      const {id} = response?.data?.roles?.find((role) => role.name === 'Client');
      setClientRoleID(id);
      await set('clientID', id);
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
  };
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

  const userHeader = () => <ListHeader columns={['User ID', 'User Name', 'Selected']} />
  const emptyUser = () => <EmptyListMessage message={emptyText} />
  const renderUser = useCallback(({item}) => <ShowUser item={item} />, [data]);
  const scrollStart = () => {
    if (!srch) stopFetchMore = false;
  }
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
        ListEmptyComponent={emptyUser}
        data={data}
        onRefresh={srch ? null : getData}
        refreshing={srch ? false : refreshing}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0}
        onScrollBeginDrag={scrollStart}
        ListHeaderComponent={userHeader}
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
})
export default HomeAdmin
