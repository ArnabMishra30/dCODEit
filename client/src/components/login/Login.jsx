import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../features/auth/authSlice.js';
import { Link, useNavigate } from "react-router-dom";
import WelcomeMessage from '../home/WelcomeMessage.jsx'; // Import the WelcomeMessage component

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { status } = useSelector((state) => state.auth);
    const { status, user } = useSelector((state) => state.auth); // Adjust to include user info
    const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    ////simple sumit------
    // const onSubmit = (data) => {
    //     dispatch(loginUser(data)).then((action) => {
    //         if (loginUser.fulfilled.match(action)) {
    //             navigate('/');
    //         }
    //     });
    // };

    //submission with welcome message
    const onSubmit = (data) => {
        dispatch(loginUser(data)).then((action) => {
            if (loginUser.fulfilled.match(action)) {
                setIsWelcomeVisible(true);
                setTimeout(() => {
                    setIsWelcomeVisible(false);
                    navigate('/'); // Navigate after displaying the welcome message
                }, 3000); // 3 seconds for the welcome message
            }
        });
    };

    const handleCancel = () => {
        navigate('/'); // Navigate to the home page or another page
    };

    return (
        <div className="flex justify-center items-center h-screen relative">
            <div className="bg-white p-8 shadow-lg rounded-md w-full max-w-md relative">
                <button
                    onClick={handleCancel}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className={`w-full px-4 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className={`w-full px-4 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            {...register('role', { required: 'Role is required' })}
                            className={`w-full px-4 py-2 border rounded-md ${errors.role ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select a role</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-6 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
            {isWelcomeVisible && (
                <WelcomeMessage username={user.username} onClose={() => setIsWelcomeVisible(false)} />
            )}
        </div>
    );
};

export default Login;

