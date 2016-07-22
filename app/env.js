/**
 * ambiente da aplicação
 */

import Firebase from 'firebase';
import Config from './config/config';

// depreciado
// const firebaseUrl = Config.firebase.url;

const firebaseRef = Firebase.initializeApp(Config.firebase);
/**
 * retorna a instância do Firebase
 * @return {Firebase Object}
 */
export default function getBaseRef() {
    return firebaseRef;
    // depreciado
    // return new Firebase(firebaseUrl);
};
