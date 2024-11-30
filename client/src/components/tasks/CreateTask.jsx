import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateTask = ({ isOpen, onClose, task }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

    useEffect(() => {
        if (task) {
            setIsUpdating(true); // Set to updating mode if a task is provided
            setValue('description', task.description);
            setValue('submitBy', new Date(task.submitBy).toISOString().substring(0, 10));
            setValue('assignedToEmails', task.assignedToEmails || '');
            setValue('onModel', task.onModel || '');
            setValue('isForAll', task.isForAll || false);
        } else {
            setIsUpdating(false);
        }
    }, [task, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            // Convert the assignedToEmails string into an array
            if (data.assignedToEmails) {
                data.assignedToEmails = data.assignedToEmails.split(',').map(email => email.trim());
            }

            if (isUpdating) {
                // Update existing task
                await axios.patch(`https://dcodeit-4.onrender.com/api/v1/task/${task._id}`, data, config);
                toast.success('Task updated successfully');
            } else {
                // Create new task
                await axios.post('https://dcodeit-4.onrender.com/api/v1/task', data, config);
                toast.success('Task created successfully');
            }
            onClose(); // Close the modal
        } catch (error) {
            toast.error('Failed to save task');
            console.error('Error saving task:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-2xl font-semibold mb-4">{isUpdating ? 'Edit Task' : 'Create New Task'}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Description Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Task Description</label>
                        <textarea
                            {...register('description', { required: 'Task description is required' })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Enter the task description"
                        ></textarea>
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Submit By Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Submit By</label>
                        <input
                            type="date"
                            {...register('submitBy', { required: 'Submission date is required' })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.submitBy && (
                            <p className="text-red-500 text-sm mt-1">{errors.submitBy.message}</p>
                        )}
                    </div>

                    {/* Assigned To Emails Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Assigned To (Emails, comma separated)</label>
                        <input
                            type="text"
                            {...register('assignedToEmails')}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter emails separated by commas"
                        />
                    </div>

                    {/* On Model Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Assign To Role</label>
                        <select
                            {...register('onModel')}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Role</option>
                            <option value="User">Student</option>
                            <option value="Faculty">Faculty</option>
                        </select>
                    </div>

                    {/* Is For All Field */}
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                {...register('isForAll')}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Assign to All</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            disabled={loading}
                        >
                            {/* {isUpdating ? 'Update Task' : 'Create Task'} */}
                            {loading ? (isUpdating ? 'Updating...' : 'Creating...') : (isUpdating ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
