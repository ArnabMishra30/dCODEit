// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faThumbsUp, faReply, faFlag } from '@fortawesome/free-solid-svg-icons';
// import PropTypes from 'prop-types';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// function CommentModal({ onClose, tweetId }) {
//     const [comments, setComments] = useState([]);
//     const [activeComment, setActiveComment] = useState(null);
//     const [commentContent, setCommentContent] = useState('');
//     const [replyContent, setReplyContent] = useState('');
//     const [editCommentContent, setEditCommentContent] = useState('');
//     const [editingCommentId, setEditingCommentId] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const isLoggedIn = useSelector((state) => state.auth.user !== null);
//     const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

//     useEffect(() => {
//         if (tweetId) {
//             fetchComments();
//         }
//     }, [tweetId]);

//     const fetchComments = async () => {
//         try {
//             const config = isLoggedIn ? { headers: { Authorization: `Bearer ${token}` } } : {};
//             const response = await axios.get(`http://localhost:8000/api/v1/users/comments/tweetcmt/${tweetId}`, config);
//             console.log('API Response:', response.data); // Log the API response

//             if (response.data && response.data.data && Array.isArray(response.data.data.docs)) {
//                 setComments(response.data.data.docs); // Adjust to match the response structure
//             } else {
//                 throw new Error('Invalid response format');
//             }
//         } catch (error) {
//             console.error('Error fetching comments:', error.message || error);
//         }
//     };

//     const handleAddComment = async () => {
//         if (!isLoggedIn) {
//             alert('Please log in to add a comment.');
//             return;
//         }
//         setLoading(true);
//         try {
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             await axios.post(`http://localhost:8000/api/v1/users/comments/tweetcmt/${tweetId}`, { comment: commentContent }, config);
//             setCommentContent('');
//             fetchComments(); // Refresh comments list
//         } catch (error) {
//             console.error('Error adding comment:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEditComment = async (commentId) => {
//         if (!isLoggedIn) {
//             alert('Please log in to edit a comment.');
//             return;
//         }
//         setLoading(true);
//         try {
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             await axios.patch(`http://localhost:8000/api/v1/users/comments/tweetcmt/update/${commentId}`, { newComment: editCommentContent }, config);
//             setEditCommentContent('');
//             setEditingCommentId(null);
//             fetchComments(); // Refresh comments list
//         } catch (error) {
//             console.error('Error updating comment:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteComment = async (commentId) => {
//         if (!isLoggedIn) {
//             alert('Please log in to delete a comment.');
//             return;
//         }
//         setLoading(true);
//         try {
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             await axios.delete(`http://localhost:8000/api/v1/users/comments/tweetcmt/update/${commentId}`, config);
//             fetchComments(); // Refresh comments list
//         } catch (error) {
//             console.error('Error deleting comment:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReply = async (parentCommentId) => {
//         if (!isLoggedIn) {
//             alert('Please log in to reply to a comment.');
//             return;
//         }
//         setLoading(true);
//         try {
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             await axios.post(`http://localhost:8000/api/v1/users/comments/replies/${parentCommentId}`, { comment: replyContent }, config);
//             setReplyContent('');
//             fetchComments(); // Refresh comments list
//         } catch (error) {
//             console.error('Error replying to comment:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReplyClick = (commentId) => {
//         setActiveComment(commentId);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white w-full h-full max-w-3xl overflow-y-auto p-4 relative">
//                 <button
//                     onClick={onClose}
//                     className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
//                 >
//                     Close
//                 </button>
//                 <div className="space-y-4">
//                     <textarea
//                         placeholder="Add a comment..."
//                         value={commentContent}
//                         onChange={(e) => setCommentContent(e.target.value)}
//                         className="w-full p-2 border border-gray-300 rounded"
//                     />
//                     <button
//                         onClick={handleAddComment}
//                         className="bg-blue-500 text-white px-4 py-1 rounded"
//                         disabled={loading}
//                     >
//                         {loading ? 'Adding...' : 'Add Comment'}
//                     </button>
//                     {comments.length > 0 ? (
//                         comments.map((comment) => (
//                             <div key={comment._id} className="border-b border-gray-200 pb-2">
//                                 <p className="font-bold">{comment.ownerDetails?.name || 'Unknown'}</p>
//                                 <p>{comment.content || 'No content'}</p>
//                                 <div className="flex items-center space-x-2">
//                                     <button
//                                         onClick={() => handleReplyClick(comment._id)}
//                                         className="text-sm text-blue-500"
//                                     >
//                                         <FontAwesomeIcon icon={faReply} /> Reply
//                                     </button>
//                                     <button
//                                         onClick={() => handleEditComment(comment._id)}
//                                         className="text-sm text-green-500"
//                                     >
//                                         <FontAwesomeIcon icon={faThumbsUp} /> Edit
//                                     </button>
//                                     <button
//                                         onClick={() => handleDeleteComment(comment._id)}
//                                         className="text-sm text-red-500"
//                                     >
//                                         <FontAwesomeIcon icon={faFlag} /> Delete
//                                     </button>
//                                 </div>
//                                 {activeComment === comment._id && (
//                                     <div className="mt-2">
//                                         <textarea
//                                             placeholder="Write a reply..."
//                                             value={replyContent}
//                                             onChange={(e) => setReplyContent(e.target.value)}
//                                             className="w-full p-2 border border-gray-300 rounded"
//                                         />
//                                         <button
//                                             onClick={() => handleReply(comment._id)}
//                                             className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
//                                             disabled={loading}
//                                         >
//                                             {loading ? 'Replying...' : 'Reply'}
//                                         </button>
//                                     </div>
//                                 )}
//                                 {/* Optionally render nested replies */}
//                                 {comment.replies && comment.replies.map((reply) => (
//                                     <div key={reply._id} className="ml-4 border-t border-gray-200 pt-2">
//                                         <p className="font-bold">{reply.ownerDetails?.name || 'Unknown'}</p>
//                                         <p>{reply.content || 'No content'}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         ))
//                     ) : (
//                         <p>No comments yet.</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// CommentModal.propTypes = {
//     onClose: PropTypes.func.isRequired,
//     tweetId: PropTypes.string.isRequired,
// };

// export default CommentModal;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faThumbsUp, faFlag } from '@fortawesome/free-solid-svg-icons';

function CommentModal({ onClose, tweetId }) {
    const [comments, setComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [editCommentContent, setEditCommentContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [loading, setLoading] = useState(false);

    const isLoggedIn = useSelector((state) => state.auth.user !== null);
    const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

    useEffect(() => {
        if (tweetId) {
            fetchComments();
        }
    }, [tweetId]);

    const fetchComments = async () => {
        try {
            const config = isLoggedIn ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axios.get(`http://localhost:8000/api/v1/users/comments/tweetcmt/${tweetId}`, config);
            console.log('API Response:', response.data);

            if (response.data && response.data.data && Array.isArray(response.data.data.docs)) {
                setComments(response.data.data.docs);

                // Extract and log usernames
                response.data.data.docs.forEach(comment => {
                    const username = comment.ownerDetails?.username || 'Unknown User';
                    // console.log('Username:', username);
                });

            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching comments:', error.message || error);
        }
    };

    const handleAddComment = async () => {
        if (!isLoggedIn) {
            alert('Please log in to add a comment.');
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:8000/api/v1/users/comments/tweetcmt/${tweetId}`, { comment: commentContent }, config);
            setCommentContent('');
            fetchComments(); // Refresh comments list
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!isLoggedIn) {
            alert('Please log in to edit a comment.');
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`http://localhost:8000/api/v1/users/comments/tweetcmt/update/${commentId}`, { newComment: editCommentContent }, config);
            setEditCommentContent('');
            setEditingCommentId(null);
            fetchComments(); // Refresh comments list
        } catch (error) {
            console.error('Error updating comment:', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!isLoggedIn) {
            alert('Please log in to delete a comment.');
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:8000/api/v1/users/comments/tweetcmt/update/${commentId}`, config);
            fetchComments(); // Refresh comments list
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (parentCommentId) => {
        if (!isLoggedIn) {
            alert('Please log in to reply to a comment.');
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:8000/api/v1/users/comments/replies/${parentCommentId}`, { comment: replyContent }, config);
            setReplyContent('');
            fetchComments(); // Refresh comments list
        } catch (error) {
            console.error('Error replying to comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReplyClick = (commentId) => {
        setActiveComment(commentId);
    };

    // Recursive component to render nested replies
    const renderComments = (commentList) => {
        return commentList.map((comment) => (
            <div key={comment._id} className="border-b border-gray-200 pb-2 ml-4">
                {/* Displaying the username from ownerDetails */}
                <p className="font-bold">{comment.ownerDetails?.username || 'Unknown'}</p>
                <p>{comment.content || 'No content'}</p>
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleReplyClick(comment._id)} className="text-sm text-blue-500">
                        <FontAwesomeIcon icon={faReply} /> Reply
                    </button>
                    <button onClick={() => handleEditComment(comment._id)} className="text-sm text-green-500">
                        <FontAwesomeIcon icon={faThumbsUp} /> Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment._id)} className="text-sm text-red-500">
                        <FontAwesomeIcon icon={faFlag} /> Delete
                    </button>
                </div>
                {activeComment === comment._id && (
                    <div className="mt-2">
                        <textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                        <button
                            onClick={() => handleReply(comment._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Replying...' : 'Reply'}
                        </button>
                    </div>
                )}
                {/* Recursive rendering of nested replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-4">
                        {renderComments(comment.replies)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-4">Comments</h2>
                    <div className="mb-4">
                        <textarea
                            placeholder="Write a comment..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                        <button
                            onClick={handleAddComment}
                            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {comments && comments.length > 0 ? (
                            renderComments(comments)
                        ) : (
                            <p>No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
                    Close
                </button>
            </div>
        </div>
    );
}

export default CommentModal;
