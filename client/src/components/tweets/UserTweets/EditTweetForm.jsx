// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const EditTweetForm = () => {
//     const { tweetId } = useParams();
//     const { register, handleSubmit, setValue, reset } = useForm();
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();
//     const currentUser = useSelector((state) => state.auth.user);
//     const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

//     useEffect(() => {
//         if (!currentUser) {
//             navigate('/'); // Redirect if not logged in
//         } else {
//             fetchTweet();
//         }
//     }, [currentUser, navigate]);

//     const fetchTweet = async () => {
//         try {
//             const response = await axios.get(`https://dcodeit-4.onrender.com/api/v1/users/tweets/${tweetId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.status === 200) {
//                 const tweet = response.data.data; // Assuming the data is within 'data'
//                 setValue('title', tweet.title);
//                 setValue('content', tweet.content);
//                 // Optionally set image if needed
//                 // setValue('image', tweet.image);
//             }
//         } catch (error) {
//             toast.error('Failed to fetch tweet!');
//             console.error(error.response?.data || error.message);
//         }
//     };


//     const onSubmit = async (data) => {
//         if (!token) {
//             toast.error('You must be logged in to edit a tweet.');
//             navigate('/login'); // Redirect to login if token is not found
//             return;
//         }

//         setIsLoading(true);

//         const formData = new FormData();
//         formData.append('title', data.title);
//         formData.append('content', data.content); // Fixed content to data.content
//         if (data.image && data.image.length > 0) { // Check if image is selected
//             formData.append('image', data.image[0]);
//         }

//         try {
//             const response = await axios.patch(`https://dcodeit-4.onrender.com/api/v1/users/tweets/${tweetId}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 },
//             });

//             if (response.status === 200) {
//                 toast.success('Tweet updated successfully!');
//                 navigate('/tweets'); // Adjusted to navigate to a list of tweets or appropriate page
//             }
//         } catch (error) {
//             toast.error('Failed to update tweet!');
//             console.error(error.response?.data || error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         navigate('/myBlogs'); // Adjusted to navigate to a list of tweets or appropriate page
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Edit Tweet</h1>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="mb-4">
//                     <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
//                     <input
//                         id="title"
//                         type="text"
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         {...register('title', { required: true })}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
//                     <textarea
//                         id="content"
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         {...register('content', { required: true })}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Image</label>
//                     <input
//                         id="image"
//                         type="file"
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         {...register('image')}
//                     />
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <button
//                         type="submit"
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         disabled={isLoading}
//                     >
//                         {isLoading ? 'Updating...' : 'Update Tweet'}
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleCancel}
//                         className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditTweetForm;

//--------------------------This above is not designed well and fetching pure data --------------------------------------


import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditTweetForm = () => {
    const { tweetId } = useParams();
    const { register, handleSubmit, setValue, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

    useEffect(() => {
        if (!currentUser) {
            navigate('/'); // Redirect if not logged in
        } else {
            fetchTweet();
        }
    }, [currentUser, navigate]);

    const fetchTweet = async () => {
        try {
            const response = await axios.get(`https://dcodeit-4.onrender.com/api/v1/users/tweets/${tweetId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const tweet = response.data.data; // Assuming the data is within 'data'
                setValue('title', tweet.title);
                setContent(tweet.content);
                // Optionally set image if needed
                setValue('image', tweet.image);
            }
        } catch (error) {
            toast.error('Failed to fetch tweet!');
            console.error(error.response?.data || error.message);
        }
    };

    const onSubmit = async (data) => {
        if (!token) {
            toast.error('You must be logged in to edit a tweet.');
            navigate('/login'); // Redirect to login if token is not found
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', content); // Use state content
        if (data.image && data.image.length > 0) { // Check if image is selected
            formData.append('image', data.image[0]);
        }

        try {
            const response = await axios.patch(`https://dcodeit-4.onrender.com/api/v1/users/tweets/${tweetId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                toast.success('Tweet updated successfully!');
                navigate('/tweet'); // Adjusted to navigate to a list of tweets or appropriate page
            }
        } catch (error) {
            toast.error('Failed to update tweet!');
            console.error(error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/myBlogs'); // Adjusted to navigate to a list of tweets or appropriate page
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Tweet</h1>
            <>
                <div className="relative max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
                            <div className="text-center">
                                <p className="text-lg font-medium text-gray-700">Publishing your tweet...</p>
                            </div>
                        </div>
                    )}
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
                    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${isLoading ? 'opacity-50' : ''}`}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                {...register('title', { required: true })}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="h-96">
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <ReactQuill value={content} onChange={setContent} className="h-full " readOnly={isLoading} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                {...register('image')}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                                type="text"
                                {...register('author')}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="text"
                                {...register('date')}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                disabled
                            />
                        </div> */}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </>
        </div>
    );
};

export default EditTweetForm;
