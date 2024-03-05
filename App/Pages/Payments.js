import React, {useContext, useEffect, useState} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList } from 'react-native'
import RazorpayCheckout from 'react-native-razorpay';
import Colors from '../Shared/Colors';
import { AuthContext } from '../Context/AuthContext';
import { makeOrder, postPayments, getPayments } from '../Shared/Services/Payments';
import { paymentOptions } from '../Shared/Utils/Constants';
import { verifySignature } from '../Shared/Utils/utils';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../Components/Loader';

const pageSize = 25;
let stopFetchMore = true;

const formatResp = (resp) => {
    const transactions = resp?.data?.data;
    return transactions?.map((item) => {
        const record = item?.attributes;
        return {
            id: item.id,
            createdAt: new Date(record.createdAt).toLocaleString(),
            amount: record.amount,
            status_code: record.status_code,
        }
    })
}
export default function Payments (){
    const { userData } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(true);
    const onChangeAmount = (text)=>{
        if(Number(text)||!text) setAmount(text)
    };
    const getHistory = async() => {
        setLoadingMore(true);
        const resp = await getPayments(userData?.user?.email, 1, pageSize).catch((e)=>alert(e));
        setHistory(formatResp(resp));
        setLoadingMore(false);
        setCurrentPage(resp?.data?.meta?.pagination?.page);
        setPageCount(resp?.data?.meta?.pagination?.pageCount);
    }
    const handleOnEndReached = async () => {
        setLoadingMore(true);
        if (!stopFetchMore) {
          if (currentPage >= pageCount) return setLoadingMore(false);
          const resp = await getPayments(userData?.user?.email, currentPage + 1, pageSize).catch((e)=>alert(e));
          const formattedResp = formatResp(resp);
          setHistory([...history, ...formattedResp]);
          setCurrentPage(resp?.data?.meta?.pagination?.page);
          stopFetchMore = true;
        }
        setLoadingMore(false);
      };
    useEffect(()=>{
        getHistory();
    },[])
    const pay = async () => {
        if(!amount) return alert('Please enter amount');
        setLoadingMore(true);
        const amountInRs = Number(amount) * 100;
        const orderData = {
            amount: amountInRs,
            currency: paymentOptions.currency,
            receipt: userData?.user?.email,
        };
        
        try {
            const response = await makeOrder(orderData);
            const options = {
                ...paymentOptions,
                amount: amountInRs,
                order_id: response?.data?.id,
                prefill: {
                email: userData?.user?.email,
                name: userData?.user?.name,
                },
            }
            RazorpayCheckout.open(options).then(async (data) => {
                if (data.razorpay_order_id) {
                    const isSignatureVerified = verifySignature(response?.data?.id, data.razorpay_payment_id, data.razorpay_signature);
                    if(isSignatureVerified) {
                        await postPayments({data: { email: userData?.user?.email, ...data, amount: Number(amount)}}).catch(err => alert(err));
                        alert(`Payment was successfully done!`);
                        setAmount('');
                        getHistory();
                    }
                } else {
                    alert(`Payment was failed :(`);
                }
            });
        } catch (error) {
            alert('Error:', JSON.stringify(error));
        }
        setLoadingMore(false);
    }
    if (loadingMore) return <Loader />;
    return (
        <>
        <View style={styles.container}>
            <TextInput
            name='amount'
            value={amount}
            onChangeText={onChangeAmount}
            style={styles.input}
            placeholder='Enter amount'
            />
            <TouchableOpacity onPress={pay} style={styles.button} disabled={loadingMore}>
                <Text style={styles.buttonText}>Make Payment</Text>
            </TouchableOpacity>
        <FlatList
        data={history}
        renderItem={({item}) => 
            <View style={styles.itemRow}>
                <Text style={styles.text}>{item.createdAt}</Text>
                <Text style={styles.text}>₹{item.amount}</Text>
                <Text style={styles.text}>{item.status_code === 200 ?
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                :
                <Ionicons name="close-circle" size={24} color={Colors.failure} />}</Text>
            </View>}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0}
        onScrollBeginDrag={() => {
        stopFetchMore = false;
        }}
        ListFooterComponent={() => loadingMore && <Loader />}
        ListEmptyComponent={() => {loadingMore ? <Loader /> : <Text style={{textAlign: "center"}}>No Payments have been done</Text>}}
        ListHeaderComponent={()=> <View style={styles.header}>
                <Text style={styles.headerText}>Payment Date & Time</Text>
                <Text style={styles.headerText}>Amount</Text>
                <Text style={styles.headerText}>Status</Text>
            </View>}
            onEndReached={handleOnEndReached}
        />
        </View>
      </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
      },
    button: {
      backgroundColor: Colors.primary,
      padding: 10,
      marginHorizontal: 30,
      marginVertical: 10,
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
    input: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        color: Colors.lightText,
        borderRadius: 0,
    },
    header:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginBottom: 10,
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
        backgroundColor: Colors.secondary,
    },
    text: {color: Colors.darkText,},
    headerText: {color: Colors.lightText,},
  })