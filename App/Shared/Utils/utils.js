import CryptoJS from 'crypto-js';
import {RP_PASSWORD} from '@env';

export const getDateAndTimeFormatted = (dateStr)=>{
    const date = new Date(dateStr);
    const hour = date.getHours();
    const minute = date.getMinutes();

    const formattedDate = {
        date: `${date.toDateString()}`,
        time: `${hour}:${minute}`
    };

    return(formattedDate);
}

export const getMealTimeFormatted = (timeStr)=>{
    switch(timeStr){
        case "9:0":
            return "Breakfast";
        case "11:0":
            return "Brunch";
        case "14:0":
            return "Lunch";
        case "17:0":
            return "Snacks";
        case "20:0":
            return "Dinner";
        default:
            return "Breakfast";
    }
}

export const verifySignature = (orderId, paymentId, razorpaySignature) => {
    const text = orderId + "|" + paymentId;
    const generatedSignature = CryptoJS.HmacSHA256(text, RP_PASSWORD).toString();
    return generatedSignature === razorpaySignature;
}

   
export const capitalizeFirstLetter = (word) => {
    if(!word) return ''
    return(word[0].toUpperCase() + word.slice(1));
}

export const truncate = (str, maxLength) => {
    return str?.length > maxLength ? str.slice(0, maxLength - 1) + '..' : str;
}