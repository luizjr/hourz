import {
    fetch
} from 'react-native';
import {
    initFetch,
    finishFetch
} from './fetchData';
import getBaseRef from '../env';


import type {
    Action,
    FBResponse,
    ThunkAction,
    User
} from './types';

type AuthRequestAction = (user: User) => Action;
type AuthResponseAction = (session: FBResponse) => Action;
type AuthErrorAction = (error: string) => Action;

// Erros de autenticação/ registro de usuário do firebase
const fbAuthErrors = {
    "auth/app-deleted": "Aplicação não encontrada.",
    "auth/app-not-authorized": "App não autorizada.",
    "auth/argument-error": "Argumentos incorretos",
    "auth/invalid-api-key": "Api Key inválido.",
    "auth/invalid-user-token": "Token de usuário inválido",
    "auth/network-request-failed": "Erro de conexão com a rede",
    "auth/operation-not-allowed": "Operação não permitida",
    "auth/user-disabled": "usuário desabilitado",
    "auth/user-token-expired": "Sessão expirada",
    "auth/account-exists-with-different-credential": "Usuário com estas credenciais já está cadastrado",
    "auth/email-already-in-use": "Usuário com este email já foi cadastrado",
    "auth/invalid-email": "Email não válido",
    "auth/user-not-found": "Usuário não encontrado",
    "auth/wrong-password": "Senha incorreta.",
    AUTHENTICATION_DISABLED: 'No momento o banco de dados está indisponível.',
    EMAIL_TAKEN: 'Este email já está sendo usado.',
    INVALID_ARGUMENTS: 'Argumentos inválidos.',
    INVALID_CREDENTIALS: 'Suas credenciais são inválidas.',
    INVALID_EMAIL: 'Este email não é válido',
    INVALID_PASSWORD: 'Sua senha está incorreta.',
    INVALID_USER: 'O usuário não existe.'
}

// depreciado: referencia do firebase
// const baseRef = getBaseRef();

// Autenticação do firebase
const auth = getBaseRef().auth();

// Database do firebase
const database = getBaseRef().database();

/**
 * função que cria uma action de request para o modulo auth
 * @param  {string} type -> tipo de action
 * @return {function} action
 */
function authRequest(type: string): AuthRequestAction {
    return (user) => ({
        type,
        payload: user
    })
}
/**
 * função que cria uma action de response para o modulo auth
 * @param  {string} type -> tipo de action
 * @return {function} action
 */
function authResponse(type: string): AuthResponseAction {
    return (session) => {
        return {
            type,
            payload: {
                session,
                lastLogin: Date.now()
            }
        };
    };
}

/**
 * função que cria uma action de erro na request para o modulo auth
 * @param  {string} type -> tipo de action
 * @return {function} action
 */
function authError(type: string): AuthErrorAction {
    return (error) => ({
        type,
        payload: fbAuthErrors[error.code] || 'Erro desconhecido.',
        error: true
    });
}

/**
 * action para login
 * @param  {User} user
 * @return {function} -> action que passa pela middleware redux-thunk
 */
export function signIn(user: User): ThunkAction {
    return async(dispatch) => {
        // cria as actions
        const signin = authResponse('SIGNIN');
        const error = authError('SIGNIN_ERROR');

        // dispara a action de request
        dispatch(initFetch('Conectando...'));
        dispatch(resetAuth());
        try {
            // faz o login no firebase e dispara a action de signin

            let authData = await auth.signInWithEmailAndPassword(user.email, user.password);

            // let authData = await baseRef.authWithPassword(user);

            console.log(authData);

            let userRef = database.ref('profile').child(authData.uid);
            userRef.once('value')
                .then(function(snapshot) {
                    let user = {
                        uid: authData.uid,
                        email: authData.email
                    }

                    let profile = {
                        name: snapshot.val().name,
                        image: snapshot.val().image
                    }

                    let data = {
                        user: user,
                        profile: profile
                    }

                    console.log(data);

                    dispatch(signin(data));
                    dispatch(finishFetch());

                }).catch(function(errorObject) {
                    console.log(errorObject);
                    dispatch(error(errorObject));
                    dispatch(finishFetch());
                });

        } catch (err) {
            console.log(err);
            // Dispara o erro, caso não complete o login
            dispatch(error(err));
            dispatch(finishFetch());
        }


    }
}

/**
 * action para registro de usuário
 * @param  {User} user
 * @return {function} -> action que passa pela middleware redux-thunk
 */
export function signUp(user: User): ThunkAction {
    return async(dispatch) => {

        //cria as actions
        const signup = authResponse('SIGNUP');
        const error = authError('SIGNUP_ERROR');

        dispatch(initFetch('Registrando...'));
        dispatch(resetAuth());

        try {
            // faz o registro no firebase e dispara a action de signup
            let authData = await auth.createUserWithEmailAndPassword(
                user.email, user.password
            );

            // Cria o filho do tipo profile
            let userRef = database.ref('profile').child(authData.uid);

            // Define como sera o objeto profile a ser salvo
            let profile = {
                name: user.name
            };

            try {
              // Salva o profile
              await userRef.set(profile);
              dispatch(signup(authData));
            } catch (err) {
              console.log('erro');
            }



        } catch (err) {
            // Dispara o erro, caso não complete o registro
            dispatch(error(err));
            console.log(err);
        } finally {
            // remove a tela de loading
            dispatch(finishFetch());
        }
    }
}

/**
 * action que reseta o state do user
 */
export function resetAuth(): Action {
    return {
        type: 'RESET_AUTH'
    };
}
