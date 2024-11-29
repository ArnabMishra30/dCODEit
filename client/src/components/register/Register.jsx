// import React from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";

// const Register = () => {
//     const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
//     const navigate = useNavigate();
//     const role = watch("role"); // Watch the role field value

//     const onSubmit = async (data) => {
//         console.log(data);    
//         reset()
//     };

//     const handleClose = () => {
//         navigate('/');
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
//                 <button
//                     onClick={handleClose}
//                     className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//                 >
//                     &times;
//                 </button>
//                 <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
//                 <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Username</label>
//                         <input
//                             type="text"
//                             {...register("username", { required: "Username is required" })}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         />
//                         {errors.username && <span className="text-red-500">{errors.username.message}</span>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Email</label>
//                         <input
//                             type="email"
//                             {...register("email", {
//                                 required: "Email is required",
//                                 pattern: {
//                                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                     message: "Invalid email address"
//                                 }
//                             })}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         />
//                         {errors.email && <span className="text-red-500">{errors.email.message}</span>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Full Name</label>
//                         <input
//                             type="text"
//                             {...register("fullName", { required: "Full name is required" })}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         />
//                         {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Avatar</label>
//                         <input
//                             type="file"
//                             {...register("avatar", {
//                                 required: "Avatar is required",
//                                 validate: {
//                                     image: (files) => files[0] && ['image/jpeg', 'image/png'].includes(files[0].type) || "Only JPEG and PNG images are allowed"
//                                 }
//                             })}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         />
//                         {errors.avatar && <span className="text-red-500">{errors.avatar.message}</span>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Cover Image</label>
//                         <input
//                             type="file"
//                             {...register("coverImage", {
//                                 validate: {
//                                     image: (files) => files[0] && ['image/jpeg', 'image/png'].includes(files[0].type) || "Only JPEG and PNG images are allowed"
//                                 }
//                             })}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Role</label>
//                         <select
//                             {...register("role", { required: "Role is required" })}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         >
//                             <option value="">Select Role</option>
//                             <option value="student">Student</option>
//                             <option value="teacher">Teacher</option>
//                         </select>
//                         {errors.role && <span className="text-red-500">{errors.role.message}</span>}
//                     </div>
//                     {role === "student" && (
//                         <div className="mb-4">
//                             <label className="block text-gray-700 mb-2">Year</label>
//                             <select
//                                 {...register("year", { required: "Year is required" })}
//                                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             >
//                                 <option value="">Select Year</option>
//                                 <option value="1">1</option>
//                                 <option value="2">2</option>
//                                 <option value="3">3</option>
//                                 <option value="4">4</option>
//                             </select>
//                             {errors.year && <span className="text-red-500">{errors.year.message}</span>}
//                         </div>
//                     )}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-2">Department</label>
//                         <select
//                             {...register("dept", { required: "Department is required" })}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         >
//                             <option value="">Select Department</option>
//                             <option value="ece">ECE</option>
//                             <option value="cse">CSE</option>
//                             <option value="me">ME</option>
//                             <option value="ee">EE</option>
//                         </select>
//                         {errors.dept && <span className="text-red-500">{errors.dept.message}</span>}
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 mb-2">Password</label>
//                         <input
//                             type="password"
//                             {...register("password", {
//                                 required: "Password is required",
//                                 minLength: {
//                                     value: 6,
//                                     message: "Password must be at least 6 characters long"
//                                 },
//                                 maxLength: {
//                                     value: 8,
//                                     message: "Password must be at most 8 characters long"
//                                 },
//                                 pattern: {
//                                     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,8}$/,
//                                     message: "Password must contain one uppercase letter, one lowercase letter, one number, and one special character"
//                                 }
//                             })}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         />
//                         {errors.password && <span className="text-red-500">{errors.password.message}</span>}
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
//                     >
//                         Register
//                     </button>
//                 </form>
//                 <p className="mt-6 text-center">
//                     Already have an account?{" "}
//                     <Link to="/login" className="text-blue-500 hover:underline">
//                         Login
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Register;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const role = watch("role"); // Watch the role field value
    const [loading, setLoading] = useState(false); // Add loading state

    const onSubmit = async (data) => {

        setLoading(true); // Set loading to true when the request starts

        try {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('fullName', data.fullName);
            formData.append('password', data.password);
            formData.append('dept', data.dept);
            formData.append('role', data.role);
            formData.append('year', data.year || "");
            formData.append('avatar', data.avatar[0]);
            if (data.coverImage) {
                formData.append('coverImage', data.coverImage[0]);
            }

            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response);

            // Show alert and navigate on successful registration
            toast.success("Registration successful!");
            // alert("Registration successful!");
            navigate('/login');
        } catch (error) {
            console.error(error.response?.data || error.message);
            // Handle error here (e.g., show error message to the user)
            // Show error toast
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false); // Set loading to false when the request completes
        }
    };

    const handleClose = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            {...register("username", { required: "Username is required" })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address"
                                }
                            })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            {...register("fullName", { required: "Full name is required" })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Avatar</label>
                        <input
                            type="file"
                            {...register("avatar", { required: "Avatar is required" })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"

                        />
                        {errors.avatar && <span className="text-red-500">{errors.avatar.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Cover Image (Should differnt from Avatar)</label>
                        <input
                            type="file"
                            {...register("coverImage")}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Role</label>
                        <select
                            {...register("role", { required: "Role is required" })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                        {errors.role && <span className="text-red-500">{errors.role.message}</span>}
                    </div>
                    {role === "student" && (
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Year</label>
                            <select
                                {...register("year", { required: "Year is required" })}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select Year</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                            {errors.year && <span className="text-red-500">{errors.year.message}</span>}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Department</label>
                        <select
                            {...register("dept", { required: "Department is required" })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Department</option>
                            <option value="ece">ECE</option>
                            <option value="cse">CSE</option>
                            <option value="me">ME</option>
                            <option value="ee">EE</option>
                        </select>
                        {errors.dept && <span className="text-red-500">{errors.dept.message}</span>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: "Password must contain one uppercase letter, one lowercase letter, one number, and one special character"
                                }
                            })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : 'Register'}
                    </button>
                </form>
                <p className="mt-6 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
