import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const CreateTweet = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.accessToken) || localStorage.getItem('accessToken');

  useEffect(() => {
    if (!currentUser) {
      navigate('/'); // Redirect if not logged in
    } else {
      setValue('author', currentUser?.username || '');
      setValue('date', new Date().toLocaleString());
    }
  }, [currentUser, setValue, navigate]);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('You must be logged in to create a tweet.');
      navigate('/login'); // Redirect to login if token is not found
      return;
    }

    //if user is writing something
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', content);
    formData.append('author', data.author);
    formData.append('date', data.date);
    if (data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      const response = await axios.post('https://dcodeit-4.onrender.com/api/v1/users/tweets/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 201) {
        toast.success('Tweet created successfully!');
        navigate('/tweet');
      }
    } catch (error) {
      toast.error('Failed to create tweet!');
      console.error(error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tweet');
  };

  return (
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

          <div>
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
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTweet;
