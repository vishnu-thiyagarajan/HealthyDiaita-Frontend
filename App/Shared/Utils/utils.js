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