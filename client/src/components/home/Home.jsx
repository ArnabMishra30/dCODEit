// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Card from '../Card/Card.jsx';
// import Modal from '../tweets/Modal.jsx';

// function Home() {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBlog, setSelectedBlog] = useState(null);

//   const handleReadMore = (blog) => {
//     setSelectedBlog(blog);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedBlog(null);
//   };

//   const truncateDescription = (description, maxLength) => {
//     if (description.length <= maxLength) return description;
//     return description.slice(0, maxLength) + '...';
//   };

//   const blogs = [
//     {
//       author: 'Yahya Yasir',
//       date: '14 Jun, 2024',
//       title: 'Overcoming Stigma in Mental Health',
//       description: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet...',
//       image: 'https://picsum.photos/id/237/200/300',
//     },
//     {
//       author: 'Milan Jha',
//       date: '09 Jun, 2024',
//       title: 'Holistic Approaches to Mental Wellness',
//       description: 'Discuss the significance of breaking the stigma...',
//       image: 'https://picsum.photos/seed/picsum/200/300',
//     },
//     {
//       author: 'Rituparna Singh',
//       date: '01 Jun, 2024',
//       title: 'Building Emotional Strength in Tough Times',
//       description: 'Discuss the significance of breaking the stigma...',
//       image: 'https://picsum.photos/200/300?grayscale',
//     },
//   ];

//   return (
//     <>
//       <div className="mx-auto w-full max-w-7xl">
//         <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2 sm:py-16 py-10 flex flex-col sm:flex-row items-center">
//           <div className="relative z-10 max-w-screen-xl px-4 sm:py-24 mx-auto sm:px-6 lg:px-8 flex-1">
//             <div className="max-w-xl space-y-8 text-center sm:text-right sm:ml-auto">
//               <h2 className="text-4xl font-bold sm:text-5xl text-blue-600 sm:mb-8 mb-4">
//                 Welcome to dCODEit! <br />
//                 <span className="font-semibold text-4xl text-gray-700">
//                   Join us to master coding, collaborate on projects, and unlock your potential in a supportive community.
//                 </span>
//               </h2>

//               <Link
//                 className="inline-flex text-white items-center px-6 py-3 font-medium bg-orange-700 rounded-lg hover:opacity-75"
//                 to="/"
//               >
//                 <svg
//                   fill="white"
//                   width="24"
//                   height="24"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                 >
//                   <path d="M1.571 23.664l10.531-10.501 3.712 3.701-12.519 6.941c-.476.264-1.059.26-1.532-.011l-.192-.13zm9.469-11.56l-10.04 10.011v-20.022l10.04 10.011zm6.274-4.137l4.905 2.719c.482.268.781.77.781 1.314s-.299 1.046-.781 1.314l-5.039 2.793-4.015-4.003 4.149-4.137zm-15.854-7.534c.09-.087.191-.163.303-.227.473-.271 1.056-.275 1.532-.011l12.653 7.015-3.846 3.835-10.642-10.612z" />
//                 </svg>
//                 &nbsp; Get Started
//               </Link>
//             </div>
//           </div>

//           <div className="relative flex-1 flex justify-center items-center sm:mt-0 mt-10 sm:ml-8 ml-4">
//             <img className="w-96 sm:w-auto" src="https://i.ibb.co/5BCcDYB/Remote2.png" alt="image1" />
//           </div>
//         </aside>

//         <div className="grid place-items-center sm:mt-10 mt-5">
//           <img className="sm:w-96 w-48" src="https://i.ibb.co/2M7rtLk/Remote1.png" alt="image2" />
//         </div>

//         <h1 className="font-mono text-center text-3xl sm:text-5xl py-10 font-semibold text-teal-700 mt-10">
//           Explore & Share Your Tech Stories
//         </h1>

//         <div className="flex flex-wrap justify-center">
//           {blogs.map((blog, index) => (
//             <Card
//               key={index}
//               title={blog.title}
//               description={truncateDescription(blog.description, 100)}
//               image={blog.image}
//               onReadMore={() => handleReadMore(blog)}
//             />
//           ))}
//         </div>
//         {selectedBlog && (
//           <Modal show={showModal} onClose={handleCloseModal} blog={selectedBlog} />
//         )}

//         <div className="flex justify-center mt-10 mb-12">
//           <Link
//             to="/tweet"
//             className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-orange-600"
//           >
//             See More
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Home;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card/Card.jsx';
import Modal from '../tweets/Modal.jsx';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import './Home.css'
import parse from 'html-react-parser';
import HomeCard from './HomeCard.jsx';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = useSelector((state) => state.auth.user !== null);
  const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

  const fetchBlogs = async () => {
    try {
      const config = isLoggedIn
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get('http://localhost:8000/api/v1/users/tweets', config); // Adjust the URL as needed

      if (response.data && Array.isArray(response.data.data)) {
        setBlogs(response.data.data);
      } else {
        throw new Error('Response data is not an array');
      }
    } catch (error) {
      setError('Failed to fetch blogs');
      console.error('Error fetching blogs:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);//debuging step
    console.log('token:', token);//debuging step
    fetchBlogs();
  }, [isLoggedIn, token]);

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  const truncateDescription = (content = '', maxLength) => {
    if (typeof content !== 'string') return '';
    content = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };


  return (
    <>
      <div className="mx-auto w-full max-w-7xl">
        <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2 sm:py-16 py-10 flex flex-col sm:flex-row items-center">
          <div className="relative z-10 max-w-screen-xl px-4 sm:py-24 mx-auto sm:px-6 lg:px-8 flex-1">
            <div className="max-w-xl space-y-8 text-center sm:text-right sm:ml-auto">
              <h2 className="text-4xl font-bold sm:text-5xl text-blue-600 sm:mb-8 mb-4">
                Welcome to dCODEit! <br />
                <span className="font-semibold text-4xl text-gray-700">
                  Join us to master coding, collaborate on projects, and unlock your potential in a supportive community.
                </span>
              </h2>

              <Link
                className="inline-flex text-white items-center px-6 py-3 font-medium bg-orange-700 rounded-lg hover:opacity-75"
                to="/"
              >
                <svg
                  fill="white"
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                >
                  <path d="M1.571 23.664l10.531-10.501 3.712 3.701-12.519 6.941c-.476.264-1.059.26-1.532-.011l-.192-.13zm9.469-11.56l-10.04 10.011v-20.022l10.04 10.011zm6.274-4.137l4.905 2.719c.482.268.781.77.781 1.314s-.299 1.046-.781 1.314l-5.039 2.793-4.015-4.003 4.149-4.137zm-15.854-7.534c.09-.087.191-.163.303-.227.473-.271 1.056-.275 1.532-.011l12.653 7.015-3.846 3.835-10.642-10.612z" />
                </svg>
                &nbsp; Get Started
              </Link>
            </div>
          </div>

          <div className="relative flex-1 flex justify-center items-center sm:mt-0 mt-10 sm:ml-8 ml-4">
            <img className="w-96 sm:w-auto" src="https://i.ibb.co/5BCcDYB/Remote2.png" alt="image1" />
          </div>
        </aside>

        <div className="grid place-items-center sm:mt-10 mt-5">
          <img className="sm:w-96 w-48" src="https://i.ibb.co/2M7rtLk/Remote1.png" alt="image2" />
        </div>

        <h1 className="font-mono text-center text-3xl sm:text-5xl py-10 font-semibold text-teal-700 mt-10">
          Explore & Share Your Tech Stories
        </h1>

        {/* {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {blogs.map((blog, index) => (
              <Card
                key={index}
                title={blog.title}
                description={truncateDescription(blog.description, 100)}
                image={blog.image}
                onReadMore={() => handleReadMore(blog)}
              />
            ))}
          </div>
        )} */}

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="carousel-container">
            <div className="carousel">
              {blogs.map((blog, index) => (
                <div className="carousel-item" key={index}>
                  <HomeCard
                    title={blog.title}
                    content={truncateDescription(blog.content, 100)}
                    image={blog.image}
                    onReadMore={() => handleReadMore(blog)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedBlog && (
          <Modal show={showModal} onClose={handleCloseModal} blog={selectedBlog} />
        )}

        <div className="flex justify-center mt-10 mb-12">
          <Link
            to="/tweet"
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-lime-600 hover:cursor-pointer"
          >
            See All
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
