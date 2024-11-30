import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import BlogCard from './BlogCard.jsx';
import Modal from '../Modal.jsx';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';

function UserTweet() {
    useEffect(() => {
        AOS.init({ duration: 2000 });
    }, []);

    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.user !== null);
    const currentUser = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

    const [showModal, setShowModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUserTweets = async () => {
        if (!currentUser) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`https://dcodeit-4.onrender.com/api/v1/users/tweets/user/${currentUser._id}`, config);

            if (response.data && Array.isArray(response.data.data)) {
                setBlogs(response.data.data);
            } else {
                throw new Error('Response data is not an array');
            }
        } catch (error) {
            setError('Failed to fetch blogs');
            console.error('Error fetching user tweets:', error);
            if (error.response) {
                console.error('API Error Response:', error.response.data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserTweets();
    }, [currentUser]);

    const handleReadMore = (blog) => {
        setSelectedBlog(blog);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBlog(null);
    };

    const handlePublishYours = () => {
        if (isLoggedIn) {
            navigate('/createTweet');
        } else {
            toast.warn('Please log in first!');
            navigate('/login');
        }
    };

    const handleMyBlogs = () => {
        if (isLoggedIn) {
            navigate('/tweet');
        } else {
            toast.warn('Please log in first!');
            navigate('/login');
        }
    };

    const handleEdit = (tweetId) => {
        // navigate('/edit-tweet');
        console.log(tweetId);
        navigate(`/edit-tweet/${tweetId}`);
    };

    // const handleDelete = async (tweetId) => {
    //     try {
    //         const config = {
    //             headers: { Authorization: `Bearer ${token}` },
    //         };
    //         const response = await axios.delete(`https://dcodeit-4.onrender.com/api/v1/users/tweets/${tweetId}`, config);
    //         if (response.data && response.data.status === 200) {
    //             setBlogs((prevBlogs) => prevBlogs.filter(blog => blog._id !== tweetId));
    //             toast.success('Tweet deleted successfully');
    //         }
    //     } catch (error) {
    //         console.error('Error deleting tweet:', error);
    //         toast.error('Failed to delete tweet');
    //     }
    // };

    const handleDelete = async (tweetId) => {
        setIsDeleting(true); // Start deleting
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.delete(`https://dcodeit-4.onrender.com/api/v1/users/tweets/${tweetId}`, config);
            if (response.data && response.data.success) {
                setBlogs((prevBlogs) => prevBlogs.filter(blog => blog._id !== tweetId));
                toast.success('Tweet deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting tweet:', error);
            toast.error('Failed to delete tweet');
        } finally {
            setIsDeleting(false); // End deleting
        }
    };



    const truncateContent = (content, maxLength) => {
        if (typeof content !== 'string') return '';
        content = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return content.length <= maxLength ? content : `${content.slice(0, maxLength)}...`;
    };

    return (
        <div className="relative">
            {/* Blur overlay */}
            {isDeleting && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-md text-center">
                        <p className="text-lg font-bold mb-4">Deleting tweet...</p>
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                    </div>
                </div>
            )}
            <div className={`max-w-7xl mx-auto py-10 px-4 ${isDeleting ? 'blur-md' : ''}`}>
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row-reverse items-center justify-between bg-white rounded-lg shadow-lg overflow-hidden mb-12">
                    <div className="lg:w-1/2 relative">
                        <img className="w-full h-64 object-cover" src="https://plus.unsplash.com/premium_photo-1664303228186-a61e7dc91597?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9tfGVufDB8fDB8fHww" alt="Your Blogs" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>
                    </div>
                    <div className="lg:w-1/2 lg:pr-8 p-6 lg:py-8 relative bg-white">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Personal Thoughts Space</h2>
                        <p className="text-gray-700 mb-4">Explore and manage all your tweets in one place. Keep your thoughts and stories organized and share them with the world.</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handlePublishYours}
                                className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
                            >
                                Publish New Blog
                            </button>
                            <button
                                onClick={handleMyBlogs}
                                className="bg-indigo-500 text-white px-6 py-3 rounded-full shadow-md transition duration-300 hover:bg-teal-500"
                            >
                                View All Blogs
                            </button>
                        </div>
                    </div>
                </div>
                {/* End Hero Section */}
                <h1 className="text-5xl font-bold mb-8">
                    {currentUser.username}'s <span className='text-orange-600'>Blogs</span>
                </h1>
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {Array.isArray(blogs) ? (
                            blogs.map((blog, index) => (
                                <BlogCard
                                    key={index}
                                    title={blog.title}
                                    content={truncateContent(blog.content, 150)}
                                    image={blog.image}
                                    username={currentUser.username}
                                    userAvatar={currentUser.avatar}
                                    creationDate={new Date(blog.createdAt).toLocaleDateString()}
                                    onReadMore={() => handleReadMore(blog)}
                                    // onEdit={handleEdit(blog._id)}
                                    onEdit={() => handleEdit(blog._id)}// this arrow function helps to extract the selected blogs
                                    onDelete={() => handleDelete(blog._id)}
                                />
                            ))
                        ) : (
                            <div className="text-red-500 text-center">No blogs available</div>
                        )}
                    </div>
                )}
                {selectedBlog && (
                    <Modal show={showModal} onClose={handleCloseModal} blog={selectedBlog} />
                )}
            </div>
        </div>
    );
}

export default UserTweet;
