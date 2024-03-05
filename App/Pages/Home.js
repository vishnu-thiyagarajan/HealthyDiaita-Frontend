import React, { useState, useContext } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Colors from '../Shared/Colors';
import { Ionicons } from '@expo/vector-icons';
import { postFoodIntakes } from '../Shared/Services/FoodIntake';
import { AuthContext } from '../Context/AuthContext';
import Loader from '../Components/Loader';

const items = [
  {label:'BreakFast', value:'3,30,0,0'},
  {label:'Brunch', value:'5,30,0,0'},
  {label:'Lunch', value:'8,30,0,0'},
  {label:'Snacks', value:'11,30,0,0'},
  {label:'Dinner', value:'14,30,0,0'},
]
export default function Home (){
  const {userData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mealTime, setMealTime] = useState(items[0].value);
  const [showDropDown, setShowDropDown] = useState(false);
  const [food, setFood] = useState('');
  const [note, setNote] = useState('');
  const toggleDropDown = ()=> setShowDropDown((prv)=>!prv);
  const onChangeMealTime = (selectedItem) => {
    setMealTime(selectedItem);
  };
  const showDatePicker = ()=>setShow(true);
  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
    setShow(false);
  };
  const onChangeFood = (text) => setFood(text);
  const onChangeNote = (text) => setNote(text);
  const add = async()=>{
    if(!food || food.length < 5) return alert('Please describe your meal!');
    setLoading(true);
    const data = {data: {food, note, date: date.setUTCHours(...mealTime.split(',')), email: userData?.user?.email}};
    const response = await postFoodIntakes(data).catch((e)=>alert(e.message));
    if(response.status === 200){
      alert('Food intake added successfully!');
      setFood('');
      setNote('');
      setMealTime(items[0].value);
      setDate(new Date());
    }
    setLoading(false);

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
            items={items}
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
          value={food}
          onChangeText={onChangeFood}
          style={styles.input}
          editable
          multiline
          numberOfLines={4}
          maxLength={250}
        />
        <Text>Anything other than food? (optional)</Text>
        <TextInput
          name='note'
          value={note}
          onChangeText={onChangeNote}
          style={styles.input}
          editable
          multiline
          numberOfLines={4}
          maxLength={200}
        />
        <TouchableOpacity onPress={add} style={styles.button} disabled={loading}>
          <Text style={styles.buttonText}>Add food intake</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    margin: 30,
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
  wrapper: { flex: 1 }
})
