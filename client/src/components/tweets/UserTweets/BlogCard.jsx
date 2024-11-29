import React from 'react';

const BlogCard = ({ title, content, image, username, creationDate, userAvatar, onReadMore, onEdit, onDelete }) => {
    return (
        <div className="w-full lg:max-w-full lg:flex bg-gray-50 rounded-lg shadow-lg overflow-hidden mb-6 transform transition-transform duration-500 hover:scale-105 hover:cursor-pointer">
    <div className="h-64 lg:h-auto lg:w-60 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
        <img
            className="w-full h-full object-cover"
            src={image}
            alt={title}
        />
    </div>
    <div className="flex-1 border-r border-b border-l border-gray-300 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-6 flex flex-col justify-between leading-normal">
        <div className="mb-8">
            <div className="text-orange-700 font-bold text-2xl mb-2">{title}</div>
            <p className="text-gray-600 text-base mb-4">{content}</p>
            <button
                onClick={onReadMore}
                className="text-blue-500 hover:underline focus:outline-none"
            >
                Read More
            </button>
        </div>
        <div className="flex items-center mb-4">
            <img className="w-16 h-16 rounded-full mr-4" src={userAvatar} alt="User Avatar" />
            <div className="text-sm">
                <p className="text-gray-800 leading-none">{username}</p>
                <p className="text-gray-500">{creationDate}</p>
            </div>
        </div>
        <div className="flex space-x-2">
            <button
                onClick={onEdit}
                className="bg-orange-500 text-white px-4 py-2 rounded shadow-md hover:bg-emerald-400 transition duration-300"
            >
                Edit
            </button>
            <button
                onClick={onDelete}
                className="bg-red-400 text-gray-700 px-4 py-2 rounded shadow-md hover:bg-red-600 transition duration-300 hover:text-gray-200"
            >
                Delete
            </button>
        </div>
    </div>
</div>

    );
};

export default BlogCard;







