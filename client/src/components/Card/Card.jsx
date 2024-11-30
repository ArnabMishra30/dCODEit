// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import CommentModal from '../comment/CommentModal.jsx';

// function Card({ title, content, image, onReadMore, isLoggedIn }) {
//     const [liked, setLiked] = useState(false);
//     const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
//     const navigate = useNavigate();

//     const toggleLike = () => {
//         if (isLoggedIn) {
//             setLiked(!liked);
//         } else {
//             toast.warn('To like a post, please log in first.');
//             navigate('/login');
//         }
//     };

//     const openCommentModal = () => {
//         if (isLoggedIn) {
//             setIsCommentModalOpen(true);
//         } else {
//             toast.warn('To see comments, please log in first.');
//             navigate('/login');
//         }
//     };

//     const closeCommentModal = () => {
//         setIsCommentModalOpen(false);
//     };

//     const truncateContent = (content, maxLength) => {
//         if (typeof content !== 'string') return '';
//         return content.length <= maxLength ? content : `${content.slice(0, maxLength)}...`;
//     };

//     return (
//         <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 transform transition duration-300 hover:scale-105 cursor-pointer animation-star-animation">
//             <img className="w-full h-64 object-cover" src={image} alt="Blog Image" />
//             <div className="px-6 py-4">
//                 <div className="font-bold text-xl mb-2">{title}</div>
//                 <p className="text-gray-700 text-base">{truncateContent(content, 100)}</p>
//             </div>
//             <div className="px-6 pt-4 pb-2 flex items-center justify-between">
//                 <button onClick={onReadMore} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
//                     Read More
//                 </button>
//                 <div className="flex space-x-4">
//                     <button onClick={toggleLike} className={`text-lg`}>
//                         <FontAwesomeIcon icon={liked ? faThumbsDown : faThumbsUp} />
//                     </button>
//                     <button onClick={openCommentModal} className={`text-lg`}>
//                         <FontAwesomeIcon icon={faComment} />
//                     </button>
//                 </div>
//             </div>
//             {isCommentModalOpen && <CommentModal onClose={closeCommentModal} />}
//         </div>
//     );
// }

// export default Card;


// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import CommentModal from '../comment/CommentModal.jsx';

// function Card({ title, content, image, onReadMore, isLoggedIn, comments = [] }) {
//   const [liked, setLiked] = useState(false);
//   const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleLike = () => {
//     if (isLoggedIn) {
//       setLiked(!liked);
//     } else {
//       toast.warn('To like a post, please log in first.');
//       navigate('/login');
//     }
//   };

//   const openCommentModal = () => {
//     if (isLoggedIn) {
//       setIsCommentModalOpen(true);
//     } else {
//       toast.warn('To see comments, please log in first.');
//       navigate('/login');
//     }
//   };

//   const closeCommentModal = () => {
//     setIsCommentModalOpen(false);
//   };

//   const truncateContent = (content, maxLength) => {
//     if (typeof content !== 'string') return '';
//     return content.length <= maxLength ? content : `${content.slice(0, maxLength)}...`;
//   };

//   return (
//     <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 transform transition duration-300 hover:scale-105 cursor-pointer animation-star-animation">
//       <img className="w-full h-64 object-cover" src={image} alt="Blog Image" />
//       <div className="px-6 py-4">
//         <div className="font-bold text-xl mb-2">{title}</div>
//         <p className="text-gray-700 text-base">{truncateContent(content, 100)}</p>
//       </div>
//       <div className="px-6 pt-4 pb-2 flex items-center justify-between">
//         <button onClick={onReadMore} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
//           Read More
//         </button>
//         <div className="flex space-x-4">
//           <button onClick={toggleLike} className={`text-lg`}>
//             <FontAwesomeIcon icon={liked ? faThumbsDown : faThumbsUp} />
//           </button>
//           <button onClick={openCommentModal} className={`text-lg`}>
//             <FontAwesomeIcon icon={faComment} />
//           </button>
//         </div>
//       </div>
//       {isCommentModalOpen && <CommentModal onClose={closeCommentModal} comments={comments} />}
//     </div>
//   );
// }

// export default Card;
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommentModal from '../comment/CommentModal.jsx';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Card({ title, content, image, onReadMore, tweetId }) {
    const [liked, setLiked] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.user !== null);
    const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

    useEffect(() => {
        // Fetch the like status of the tweet when the component mounts
        const fetchLikeStatus = async () => {
            if (isLoggedIn) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const response = await axios.get(`https://dcodeit-4.onrender.com/api/v1/likes/tweets/${tweetId}/isLiked`, config);
                    if (response.data.liked !== undefined) {
                        setLiked(response.data.liked);
                    }
                } catch (error) {
                    console.error('Error fetching like status:', error);
                }
            }
        };
        fetchLikeStatus();
    }, [isLoggedIn, token, tweetId]);

    const toggleLike = async () => {
        if (isLoggedIn) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.post(`https://dcodeit-4.onrender.com/api/v1/likes/toggle/t/${tweetId}`, {}, config);
                // console.log(response);
                if (response.status === 201 || response.status === 200) {
                    setLiked(prevLiked => !prevLiked);
                    toast.success('Like toggled successfully');
                } else {
                    toast.error('Something went wrong');
                }
            } catch (error) {
                toast.error('Failed to toggle like');
                console.error('Error toggling like:', error);
            }
        } else {
            toast.warn('To like a post, please log in first.');
            navigate('/login');
        }
    };

    const openCommentModal = () => {
        if (isLoggedIn) {
            setIsCommentModalOpen(true);
        } else {
            toast.warn('To see comments, please log in first.');
            navigate('/login');
        }
    };

    const closeCommentModal = () => {
        setIsCommentModalOpen(false);
    };

    const truncateContent = (content, maxLength) => {
        if (typeof content !== 'string') return '';
        return content.length <= maxLength ? content : `${content.slice(0, maxLength)}...`;
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 transform transition duration-300 hover:scale-105 cursor-pointer animation-star-animation">
            <img className="w-full h-64 object-cover" src={image} alt="Blog Image" />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-700 text-base">{truncateContent(content, 100)}</p>
            </div>
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                <button onClick={onReadMore} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                    Read More
                </button>
                <div className="flex space-x-4">
                    <button onClick={toggleLike} className={`text-lg`}>
                        <FontAwesomeIcon icon={liked ? faThumbsDown : faThumbsUp} />
                    </button>
                    <button onClick={openCommentModal} className={`text-lg`}>
                        <FontAwesomeIcon icon={faComment} />
                    </button>
                </div>
            </div>
            {isCommentModalOpen && (
                <CommentModal
                    onClose={closeCommentModal}
                    tweetId={tweetId}
                />
            )}
        </div>
    );
}

export default Card;
