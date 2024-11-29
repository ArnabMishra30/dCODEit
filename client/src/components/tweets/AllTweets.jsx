import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Card from '../Card/Card.jsx';
import Modal from './Modal.jsx';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';

function AllTweets() {
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
  // const [page, setPage] = useState(1);//for pagination purpose
  // const [pageSize] = useState(6); // Number of tweets per page
  // const [hasMore, setHasMore] = useState(true);

  const fetchTweets = async () => {
    try {
      const config = isLoggedIn
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get('http://localhost:8000/api/v1/users/tweets', config);

      if (response.data && Array.isArray(response.data.data)) {
        setBlogs(response.data.data);
      } else {
        throw new Error('Response data is not an array');
      }
    } catch (error) {
      setError('Failed to fetch blogs');
      console.error('Error fetching tweets:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  ////to handle pagination if there in backend
  // useEffect(() => {
  //   fetchTweets();
  // }, [page]);

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
      navigate('/myBlogs');
    } else {
      toast.warn('Please log in first!');
      navigate('/login');
    }
  };

  //for pagination(on click on load more more tweets)
  // const handleLoadMore = () => {
  //   if (hasMore) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // };

  const truncateContent = (content, maxLength) => {
    if (typeof content !== 'string') return '';
    content = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return content.length <= maxLength ? content : `${content.slice(0, maxLength)}...`;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-5xl font-bold mb-8">
          {isLoggedIn ? (
            <>
              Welcome, <span className='text-orange-600'>{currentUser.username}</span>
            </>
          ) : (
            <><span className='text-orange-600'>Latest</span> Blog</>
          )}
        </h1>
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="lg:w-1/2 relative">
            <img className="w-full h-64 object-cover" src="https://plus.unsplash.com/premium_photo-1664303228186-a61e7dc91597?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9tfGVufDB8fDB8fHww" alt="Latest Blog" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>
          </div>
          <div className="lg:w-1/2 lg:pl-8 p-6 lg:py-8 relative bg-white">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Platform for Thoughts and Innovations</h2>
            <p className="text-gray-700 mb-4">Your ideas have a place here. Publish your blogs, explore others' insights, and engage in meaningful discussions. Join us in building a community where creativity and conversation thrive.</p>
            {/* <button
              onClick={handlePublishYours}
              className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
            >
              Publish Yours
            </button> */}
            <div className="flex space-x-4">
              <button
                onClick={handlePublishYours}
                className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
              >
                Publish Yours
              </button>
              <button
                onClick={handleMyBlogs}
                className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
              >
                My Posts
              </button>
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-8">Other <span className='text-orange-600'>Blogs</span></h1>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(blogs) ? (
              blogs.map((blog, index) => (
                <div key={index} data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                  <Card
                    title={blog.title}
                    content={truncateContent(blog.content, 100)}
                    image={blog.image}
                    tweetId={blog._id}
                    onReadMore={() => handleReadMore(blog)}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              ))
            ) : (
              <div className="text-red-500 text-center">No blogs available</div>
            )}
          </div>
          // <>
          //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          //     {Array.isArray(blogs) && blogs.length > 0 ? (
          //       blogs.slice(0, 6).map((blog, index) => (
          //         <div key={index} data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          //           <Card
          //             title={blog.title}
          //             content={truncateContent(blog.content, 100)}
          //             image={blog.image}
          //             onReadMore={() => handleReadMore(blog)}
          //             isLoggedIn={isLoggedIn}
          //           />
          //         </div>
          //       ))
          //     ) : (
          //       <div className="text-red-500 text-center">No blogs available</div>
          //     )}
          //   </div>
          //   {blogs.length > 6 && (
          //     <div className="flex justify-center mt-6">
          //       <button
          //         onClick={handleLoadMore}
          //         className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition duration-300"
          //       >
          //         See More
          //       </button>
          //     </div>
          //   )}
          // </>
        )}
        {selectedBlog && (
          <Modal show={showModal} onClose={handleCloseModal} blog={selectedBlog} />
        )}
      </div>
    </>
  );
}

export default AllTweets;
