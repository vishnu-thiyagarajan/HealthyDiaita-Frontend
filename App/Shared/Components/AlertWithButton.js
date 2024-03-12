import { Alert } from 'react-native';

export const AlertTwoButton = (title, message, onCancel, onOk) =>{
    return Alert.alert(title, message, [
        {
          text: 'Cancel',
          onPress: onCancel ? onCancel : ()=>{},
          style: 'cancel',
        },
        {text: 'OK', onPress: onOk ? onOk : ()=>{}},
      ]);
}

