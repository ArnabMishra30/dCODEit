import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

function SubmissionModal({ isOpen, onClose, task }) {
    const [answer, setAnswer] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('answer', answer);
        if (screenshot) formData.append('screenshot', screenshot);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            };
            await axios.post(`http://localhost:8000/api/v1/task/submission/${task._id}`, formData, config);
            toast.success('Submission successful');
            onClose();  // Close the modal after successful submission
        } catch (error) {
            toast.error('Failed to submit answer');
            console.error('Error submitting answer:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Submit Your Answer</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="answer" className="block text-gray-700 font-semibold mb-2">
                            Answer
                        </label>
                        <textarea
                            id="answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="screenshot" className="block text-gray-700 font-semibold mb-2">
                            Screenshot (optional)
                        </label>
                        <input
                            type="file"
                            id="screenshot"
                            accept="image/*"
                            onChange={(e) => setScreenshot(e.target.files[0])}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition duration-300"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SubmissionModal;
