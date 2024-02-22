import React, { useState, useEffect, useContext } from 'react'
import { Text, StyleSheet, Button, View, ActivityIndicator, FlatList } from 'react-native'
import { getFoodIntakes } from '../Shared/Services/FoodIntake';
import { AuthContext } from '../Context/AuthContext';
import { getDateAndTimeFormatted, getMealTimeFormatted } from '../Shared/Utils/utils';
import Colors from '../Shared/Colors';

const pageSize = 25;
let stopFetchMore = true;

const ListFooterComponent = () => (
  <Text
    style={{
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 5,
      marginBottom: 10,
    }}
  >
    Loading...
  </Text>
);

const formatResponse = (data) =>{
  const obj = {};
  for(let item of data){
    const {date, time}= getDateAndTimeFormatted(item?.attributes?.date);
    const dailyFood = {
      'key': item?.attributes?.createdAt,
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
    const [loadingMore, setLoadingMore] = useState(false);
    const {userData} = useContext(AuthContext);
    
    const getData = async() => {
      setLoadingMore(true);
      const resp = await getFoodIntakes(userData?.user?.email, currentPage + 1, pageSize).catch((e)=>alert(e));
      let formattedResp = formatResponse(resp?.data?.data);
      setData({...formattedResp});
      setLoadingMore(false);
      setCurrentPage(resp?.data?.meta?.pagination?.page);
      setPageCount(resp?.data?.meta?.pagination?.pageCount);
    };

    const handleOnEndReached = async () => {
      setLoadingMore(true);
      if (!stopFetchMore) {
        if (currentPage >= pageCount) return setLoadingMore(false);
        const resp = await getFoodIntakes(userData?.user?.email, currentPage + 1, pageSize).catch((e)=>alert(e));
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
      setLoadingMore(false);
    };

    useEffect(()=>{
        getData();
      },[]);
    return (
        <FlatList
        style={styles.container}
        data={Object.keys(data)}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListFooterComponent={() => loadingMore && <ListFooterComponent />}
        onEndReached={handleOnEndReached}
        renderItem={({item})=>{
          return (
            <>
            <Text style={styles.date}>{item}</Text>
              <View style={styles.itemRow}>
                  {data[item].map(meal=>{
                    return (
                      <View key={meal.key}>
                        <Text style={styles.meal}>{meal.mealtime}</Text>
                        <View style={styles.itemSubRow}>
                          <Text style={styles.meal}>{meal.food}</Text>
                          <Text style={styles.meal}>note: {meal.note}</Text>
                        </View>
                      </View>
                    )
                  })}
              </View>
            </>
          )
        }}
        />)
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
    }
  })