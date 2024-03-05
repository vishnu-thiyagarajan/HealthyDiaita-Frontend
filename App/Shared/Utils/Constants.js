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