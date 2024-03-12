import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import Button from '../Components/Button';
import EmptyListMessage from '../Components/EmptyListMessage';
import ListHeader from '../Components/ListHeader';
import ShowPay from '../Components/ShowPay';
import { AuthContext } from '../Context/AuthContext';
import Colors from '../Shared/Colors';
import Loader from '../Shared/Components/Loader';
import { getPayments, makeOrder, postPayments } from '../Shared/Services/Payments';
import { paymentOptions } from '../Shared/Utils/Constants';
import { verifySignature } from '../Shared/Utils/utils';

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
    const {userData, selectedUser} = useContext(AuthContext);
    const userID = userData.role === 'Admin' ? selectedUser?.id : userData?.id;
    const [amount, setAmount] = useState('');
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const onChangeAmount = (text)=>{
        if(Number(text)||!text) setAmount(text)
    };
    const getHistory = async() => {
        setLoading(true);
        try {
            const resp = await getPayments(userID, 1, pageSize).catch((e)=>alert(e));
            setHistory(formatResp(resp));
            setCurrentPage(resp?.data?.meta?.pagination?.page);
            setPageCount(resp?.data?.meta?.pagination?.pageCount);
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
            if (currentPage >= pageCount) return setRefreshing(false);
            const resp = await getPayments(userID, currentPage + 1, pageSize).catch((e)=>alert(e));
            const formattedResp = formatResp(resp);
            setHistory([...history, ...formattedResp]);
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
        getHistory();
    },[])
    const pay = async () => {
        if(!amount) return alert('Please enter amount');
        setLoading(true);
        const amountInRs = Number(amount) * 100;
        const orderData = {
            amount: amountInRs,
            currency: paymentOptions.currency,
            receipt: userData?.email,
        };
        
        try {
            const response = await makeOrder(orderData);
            const options = {
                ...paymentOptions,
                amount: amountInRs,
                order_id: response?.data?.id,
                prefill: {
                email: userData?.email,
                name: userData?.name,
                },
            }
            RazorpayCheckout.open(options).then(async (data) => {
                if (data.razorpay_order_id) {
                    const isSignatureVerified = verifySignature(response?.data?.id, data.razorpay_payment_id, data.razorpay_signature);
                    if(isSignatureVerified) {
                        await postPayments({data: { user: userData?.id, ...data, amount: Number(amount)}}).catch(err => alert(err));
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
        } finally {
        setLoading(false);
        }
    }
    const renderPay = useCallback(({item}) => <ShowPay item={item} />, [history]);
    const emptyPay = () => <EmptyListMessage message="No Payments have been done"/>
    const payHeader = () => <ListHeader columns={['Payment Date & Time', 'Amount', 'Status']}/>
    const scrollStart = () => stopFetchMore = false;
    return (
        <>
        {loading && <Loader />}
        <View style={styles.container}>
            {userData.role === 'Client' && <>
            <TextInput
            name='amount'
            value={amount}
            onChangeText={onChangeAmount}
            style={styles.input}
            placeholder='Enter amount'
            />
            <Button text="Make Payment" onPress={pay} disabled={loading} />
            </>}
            {!loading && <FlatList
            data={history}
            onRefresh={getHistory}
            refreshing={refreshing}
            renderItem={renderPay}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0}
            onScrollBeginDrag={scrollStart}
            ListEmptyComponent={emptyPay}
            ListHeaderComponent={payHeader}
            onEndReached={handleOnEndReached}
        />}
        </View>
      </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
      },
    input: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        color: Colors.lightText,
        borderRadius: 0,
    },
    
  })