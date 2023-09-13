import { createAuthProvider } from 'react-token-auth';

export const {useAuth, authFetch, login, logout} =
    createAuthProvider({
        accessTokenKey: session => session.access_token,
        storage: localStorage,
        onUpdateToken: (token) => fetch('/auth/refresh', {
            method: 'POST',
            body: token.refresh_token
        })
        .then(response => 
            response.json())
        .catch(err => console.log(err))
    })