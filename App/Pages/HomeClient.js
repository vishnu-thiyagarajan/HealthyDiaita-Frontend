import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useContext, useState, useRef } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../Components/Button';
import { AuthContext } from '../Context/AuthContext';
import Colors from '../Shared/Colors';
import Loader from '../Shared/Components/Loader';
import { postFoodIntakes } from '../Shared/Services/FoodIntake';
import { mealTimings } from '../Shared/Utils/Constants';

export default function HomeClient (){
  const {userData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mealTime, setMealTime] = useState(mealTimings[0].value);
  const [showDropDown, setShowDropDown] = useState(false);
  const foodRef = useRef(null);
  const noteRef = useRef(null);
  const foodChange = value => {
    foodRef.current.value = value;
  }
  const noteChange = value => {
    noteRef.current.value = value
  }
  const toggleDropDown = ()=> setShowDropDown((prv)=>!prv);
  const onChangeMealTime = (selectedItem) => {
    setMealTime(selectedItem);
  };
  const showDatePicker = ()=>setShow(true);
  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
    setShow(false);
  };
  const add = async () => {
    try {
      const food = foodRef.current.value;
      const note = noteRef.current.value;
      if(!food || food?.length < 5) return alert('Please describe your meal!');
      setLoading(true);
      const data = {data: {food, note, date: date.setUTCHours(...mealTime.split(',')), user: userData?.id}};
      const response = await postFoodIntakes(data).catch((e)=>alert(e.message));
      if(response.status === 200){
        alert('Food intake added successfully!');
        setMealTime(mealTimings[0].value);
        setDate(new Date());
        foodRef.current.value = "";
        noteRef.current.value = "";
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <KeyboardAvoidingView
      enabled
      // keyboardVerticalOffset={100}
      behavior="height"
      style={styles.wrapper}
      >
      {loading && <Loader/>}
      <ScrollView style={styles.container}>
      <Text style={styles.caption}>Add your food intake here!</Text>
      <Text>Intake date?</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              editable={false}
              inlineImageLeft='search_icon'
              name='date'
              value={date.toDateString()}
            />
            <Ionicons style={styles.icon}  name="calendar-clear-outline" size={24} color={Colors.lightText} />
          </View>
        </TouchableOpacity>
        {show && <DateTimePicker
          value={date}
          mode={"date"}
          onChange={onChangeDate}
        />}
        <Text>Meal time?</Text>
        <View>
          <DropDownPicker
            items={mealTimings}
            style={styles.dropDown}
            placeholder="Select a meal time"
            setOpen={toggleDropDown}
            open={showDropDown}
            value={mealTime}
            setValue={onChangeMealTime}
            listMode='MODAL'
            modalTitle='Select a meal time'
          />
        </View>
        <Text>What was your meal?</Text>
        <TextInput
          name='food'
          ref={foodRef}
          value={foodRef.current?.value}
          onChangeText={foodChange}
          style={styles.input}
          editable
          multiline
          numberOfLines={4}
          maxLength={250}
        />
        <Text>Anything other than food? (optional)</Text>
        <TextInput
          name='note'
          ref={noteRef}
          value={noteRef.current?.value}
          onChangeText={noteChange}
          style={styles.input}
          editable
          multiline
          numberOfLines={4}
          maxLength={200}
        />
        <Button text="Add food intake" onPress={add} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  caption : { fontSize: 25, textAlign: 'center', fontWeight: 'bold' },
  input: {
    textAlignVertical: 'top',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    color: Colors.lightText,
    borderRadius: 0,
  },
  inputContainer: {
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  dropDown: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    marginTop: 5,
    marginBottom: 5,
  },
  wrapper: { flex: 1 }
})
