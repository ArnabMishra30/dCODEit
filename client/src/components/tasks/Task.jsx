import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'aos/dist/aos.css';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import CreateTask from './CreateTask';
import SubmissionModal from './submission/SubmissionModal';
import ShowAnswersModal from './submission/ShowAnswersModal';

function Task() {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.user !== null);
    const currentUser = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [editingTask, setEditingTask] = useState(null); // State for editing task
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false); // State for submission modal visibility
    const [isShowAnswersModalOpen, setIsShowAnswersModalOpen] = useState(false);  // State for showing answers modal
    const [selectedTask, setSelectedTask] = useState(null); // State for the selected task for submission
    const [submissions, setSubmissions] = useState([]); // State for storing submissions

    const fetchTasks = async () => {
        try {
            const config = isLoggedIn ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axios.get('https://dcodeit-4.onrender.com/api/v1/task', config);

            if (response.data && Array.isArray(response.data.data)) {
                setTasks(response.data.data);
            } else {
                throw new Error('Response data is not an array');
            }
        } catch (error) {
            setError('Failed to fetch tasks');
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAssignTask = () => {
        if (currentUser.role === 'teacher') {
            // navigate('/createTask');
            setIsModalOpen(true); // Open the modal
        } else {
            toast.warn('You are not eligible to create a task.');
        }
    };

    const handleEditTask = (task) => {
        // navigate(`/editTask/${taskId}`);
        setEditingTask(task); // Set the task for editing
        setIsModalOpen(true); // Open the modal
    };

    const handleDeleteTask = async (taskId) => {
        setLoadingDelete(true); // Set loadingDelete to true
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            await axios.delete(`https://dcodeit-4.onrender.com/api/v1/task/${taskId}`, config);
            toast.success('Task deleted successfully');
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            toast.error('Failed to delete task');
            console.error('Error deleting task:', error);
        } finally {
            setLoadingDelete(false); // Reset loadingDelete state
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setEditingTask(null); // Clear editing task
        // if (newTask) {
        //     fetchTasks(newTask); // Update state with new task
        // }
    };

    const handleSubmitAnswer = (task) => {
        setSelectedTask(task);
        setIsSubmissionModalOpen(true);
    };

    const handleShowAnswers = async (task) => {
        setSelectedTask(task);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`https://dcodeit-4.onrender.com/api/v1/task/submission/answer/${task._id}`, config);
            setSubmissions(response.data.data);
            setIsShowAnswersModalOpen(true);
        } catch (error) {
            toast.error('Failed to fetch submissions');
            console.error('Error fetching submissions:', error);
        }
    };

    const closeSubmissionModal = () => {
        setIsSubmissionModalOpen(false);
        setSelectedTask(null);
    };

    const closeShowAnswersModal = () => {
        setIsShowAnswersModalOpen(false);
        setSelectedTask(null);
    };

    return (
        // <div className="max-w-7xl mx-auto py-10 px-4">
        <div className={`max-w-7xl mx-auto py-10 px-4 ${loadingDelete ? 'pointer-events-none cursor-not-allowed' : ''}`}>
            {/* Overlay */}
            {loadingDelete && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40"></div>
            )}
            <h1 className="text-5xl font-bold mb-8">All <span className='text-orange-600'>Tasks</span></h1>
            <div className="mb-6">
                {isLoggedIn && currentUser.role === 'teacher' && (
                    <button
                        onClick={handleAssignTask}
                        className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
                    >
                        Assign New Task
                    </button>
                )}
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(tasks) ? (
                        tasks.map((task, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 relative">
                                {/* <h2 className="text-2xl font-bold mb-2">{task.title}</h2> */}
                                <h1 className="text-blue-700 text-2xl font-bold mb-2">{task.description}</h1>
                                <p className="text-gray-500 text-sm mb-4">Submit by: {new Date(task.submitBy).toLocaleDateString()}</p>
                                <p className="text-gray-500 text-sm mb-4">Assigned at: {new Date(task.createdAt).toLocaleDateString()}</p>
                                <p className="text-gray-500 text-sm mb-4">Created by: {task.facultyDetails?.fullName || 'Unknown'}</p>
                                {currentUser._id === task.createdBy && (
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                        <FontAwesomeIcon icon={faPenToSquare}
                                            onClick={() => handleEditTask(task)}
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                        />
                                        <FontAwesomeIcon icon={faTrash}
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                        />
                                    </div>
                                )}
                                {currentUser.role === 'student' && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleSubmitAnswer(task)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition duration-300"
                                        >
                                            Submit Your Answer
                                        </button>
                                        <button
                                            onClick={() => handleShowAnswers(task)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 transition duration-300 ml-4"
                                        >
                                            Show Answers
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-red-500 text-center">No tasks available</div>
                    )}
                </div>
            )}
            {/* CreateTaskModal Component */}
            <CreateTask isOpen={isModalOpen} onClose={closeModal} task={editingTask} />
            {/* SubmissionModal Component */}
            <SubmissionModal isOpen={isSubmissionModalOpen} onClose={closeSubmissionModal} task={selectedTask} />
            {/* ShowAnswersModal Component */}
            <ShowAnswersModal isOpen={isShowAnswersModalOpen} onClose={closeShowAnswersModal} submissions={submissions} />
        </div>
    );
}

export default Task;
