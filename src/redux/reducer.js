import axios from 'axios';


const initialState = {
    username: null,
    profilePicture: null
};

const UPDATE_USER = 'UPDATE_USER';
const LOGOUT = 'LOGOUT';

// Instructions say this takes in a parameter for the user object and I am not sure if
// what I put in is correct....
export const updateUser = (username, profilePicture) => {
    let data = axios.get('/api/auth/me', {
        username,
        profilePicture
    })
    .then(res => res.data)
    .catch(err => console.log(err));

    return {
        type: UPDATE_USER,
        payload: data
    }
}

export const logout = () => {
    axios.post('/api/auth/logout')
    .then(res => res.data)
    .catch(err => console.log(err));

    return {
        type: LOGOUT
    }
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_USER:
            const { username, profilePicture } = action.payload.user
            return {
                username,
                profilePicture
            }
        case LOGOUT:
            return { ...state }
        default:
            return state;
    }
}