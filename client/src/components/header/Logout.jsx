// import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { logoutUser } from '../../store/authServices.js';
// import { useNavigate } from 'react-router-dom';

// const Logout = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     useEffect(() => {
//         dispatch(logoutUser());
//         navigate('/login');
//     }, [dispatch, navigate]);

//     return <div>Logging out...</div>;
// };

// export default Logout;

import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';

const Logout = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
        >
            Logout
        </button>
    );
};

export default Logout;
