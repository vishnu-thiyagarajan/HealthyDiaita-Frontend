import Colors from '../Colors';
import {RP_USER_NAME} from '@env';

export const paymentOptions = {
    name: 'Healthy Diaita',
    description: 'Consultation fees',
    image: 'https://healthydiaita.in/images/logo160.png',
    currency: 'INR',
    key: RP_USER_NAME,
    theme: {color: Colors.primary},
}
export const ignoreWarnings = [
    'If you want to use Reanimated 2 then go through our installation steps https://docs.swmansion.com/react-native-reanimated/docs/installation',
];

export const mealTimings = [
    {label:'BreakFast', value:'3,30,0,0', hour: 9},
    {label:'Brunch', value:'5,30,0,0', hour: 11},
    {label:'Lunch', value:'8,30,0,0', hour: 14},
    {label:'Snacks', value:'11,30,0,0', hour: 17},
    {label:'Dinner', value:'14,30,0,0', hour: 20},
  ]