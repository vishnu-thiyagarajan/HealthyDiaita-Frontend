import React, { useState, useEffect, useContext } from 'react'
import { Text, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native'
import { getFoodIntakes, deleteFoodIntakes } from '../Shared/Services/FoodIntake';
import { AuthContext } from '../Context/AuthContext';
import { getDateAndTimeFormatted, getMealTimeFormatted } from '../Shared/Utils/utils';
import Colors from '../Shared/Colors';
import { Ionicons } from '@expo/vector-icons';
import { AlertTwoButton } from '../Shared/Components/AlertWithButton';
import Loader from '../Components/Loader';
import EmptyListMessage from '../Components/EmptyListMessage';

const pageSize = 25;
let stopFetchMore = true;

const formatResponse = (data) =>{
  const obj = {};
  for(let item of data){
    const {date, time}= getDateAndTimeFormatted(item?.attributes?.date);
    const dailyFood = {
      'key': item?.id,
      'mealtime': getMealTimeFormatted(time),
      'food': item?.attributes?.food,
      'note': item?.attributes?.note
    };
    if (obj[date]) {
      obj[date].push(dailyFood)
    } else {
      obj[date]=[dailyFood]
    }
  }
  return obj;
}
export default function FoodIntake () {
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const {userData, selectedUser} = useContext(AuthContext);
    const userID = userData?.role === 'Admin' ? selectedUser?.id : userData?.id;
    const getData = async() => {
      try {
        setLoading(true);
        const resp = await getFoodIntakes(userID, 1, pageSize).catch((e)=>alert(e));
        let formattedResp = formatResponse(resp?.data?.data);
        setData({...formattedResp});
        setCurrentPage(resp?.data?.meta?.pagination?.page);
        setPageCount(resp?.data?.meta?.pagination?.pageCount);
      } catch (e) {
        alert(e);
      } finally {
        setLoading(false);
      }
    };

    const DeleteAlert = (id)=>{
      const del = async () => {
        try {
          setLoading(true);
          const res = await deleteFoodIntakes(id).catch(err => alert(err.message));
          if(res.status === 200) {
            alert('Data was deleted successfully!');
            getData();
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
          const resp = await getFoodIntakes(userID, currentPage + 1, pageSize).catch((e)=>alert(e));
          let formattedResp = formatResponse(resp?.data?.data);
          //data merging
          const dataKeys = Object.keys(data);
          const lastKey = dataKeys[dataKeys.length - 1];
          if(data[lastKey] && formattedResp[lastKey]) {
            formattedResp[lastKey] = [...data[lastKey], ...formattedResp[lastKey]];
          }

          setData({...data, ...formattedResp});
          setCurrentPage(resp?.data?.meta?.pagination?.page);
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
      },[]);
    return (
      <>
        {loading && <Loader />}
        {!loading && <FlatList
        ListEmptyComponent={() => <EmptyListMessage message="No FoodIntake have been added"/>}
        onRefresh={getData}
        refreshing={refreshing}
        style={styles.container}
        data={Object.keys(data)}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        onEndReached={handleOnEndReached}
        renderItem={({item})=>{
          return (
            <>
            <Text style={styles.date}>{item}</Text>
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
        }}
      />}
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      padding: 10,
    },
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