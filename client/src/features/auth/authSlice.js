// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const baseURL = 'http://localhost:8000/api/v1';

// export const loginUser = createAsyncThunk(
//     'auth/loginUser',
//     async ({ email, password, role }, { rejectWithValue }) => {
//         try {
//             const response = await axios.post('http://localhost:8000/api/v1/users/login', {
//                 email,
//                 password,
//                 role,
//             });
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

// // authSlice.js (make sure the token is being sent correctly)
// export const logoutUser = createAsyncThunk(
//     'auth/logoutUser',
//     async (_, { getState, rejectWithValue }) => {
//         const { auth } = getState();
//         try {
//             const response = await axios.post(
//                 'http://localhost:8000/api/v1/users/logout',
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${auth.accessToken || localStorage.getItem('accessToken')}`, // Ensure valid token is sent
//                     },
//                 }
//             );
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         user: null,
//         accessToken: null,
//         refreshToken: null,
//         status: 'idle',
//         error: null,
//     },
//     reducers: {
//         setCredentials: (state, action) => {
//             const { user, accessToken, refreshToken } = action.payload;
//             state.user = user;
//             state.accessToken = accessToken;
//             state.refreshToken = refreshToken;
//         },
//         clearCredentials: (state) => {
//             state.user = null;
//             state.accessToken = null;
//             state.refreshToken = null;
//             state.status = 'idle';
//             state.error = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginUser.pending, (state) => {
//                 state.status = 'loading';
//             })
//             // authSlice.js
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 const { user, accessToken, refreshToken } = action.payload.data;
//                 state.user = user;
//                 state.accessToken = accessToken;
//                 state.refreshToken = refreshToken;
//                 localStorage.setItem('accessToken', accessToken);  // Store the access token
//                 localStorage.setItem('refreshToken', refreshToken); // Store the refresh token
//                 toast.success('Logged in successfully!');
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.payload?.message || 'Failed to log in';
//                 toast.error(state.error);
//             })
//             .addCase(logoutUser.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.payload?.message || 'Failed to log out';
//                 toast.error(state.error);

//                 // Redirect user to login page if unauthorized
//                 if (action.payload?.status === 401) {
//                     window.location.href = '/login';
//                 }
//             })
//             .addCase(logoutUser.fulfilled, (state) => {
//                 state.user = null;
//                 state.accessToken = null;
//                 state.refreshToken = null;
//                 state.status = 'idle';
//                 toast.success('Logged out successfully!');
//             });
//     },
// });

// export const { setCredentials, clearCredentials } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'http://localhost:8000/api/v1';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password, role }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/users/login`, {
                email,
                password,
                role,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { getState, rejectWithValue }) => {
        const { auth } = getState();
        try {
            const response = await axios.post(
                'http://localhost:8000/api/v1/users/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken || localStorage.getItem('accessToken')}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        refreshToken: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('accessToken');  // Clear the access token from storage
            localStorage.removeItem('refreshToken'); // Clear the refresh token from storage
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user, accessToken, refreshToken } = action.payload.data;
                state.user = user;
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                localStorage.setItem('accessToken', accessToken);  // Store the access token
                localStorage.setItem('refreshToken', refreshToken); // Store the refresh token
                toast.success('Logged in successfully!');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to log in';
                toast.error(state.error);
            })
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.status = 'idle';
                toast.success('Logged out successfully!');
                localStorage.removeItem('accessToken'); // Clear the access token
                localStorage.removeItem('refreshToken'); // Clear the refresh token
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to log out';
                toast.error(state.error);

                // Redirect user to login page if unauthorized
                if (action.payload?.status === 401) {
                    window.location.href = '/login';
                }
            });
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
