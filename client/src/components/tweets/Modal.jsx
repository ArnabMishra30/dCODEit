import React from 'react';
import parse from 'html-react-parser';

const Modal = ({ show, onClose, blog }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-full overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-700 text-xl">&times;</button>
        </div>
        <div className="flex flex-col items-center">
          <img className="w-full h-auto max-h-96 object-contain mb-4" src={blog.image} alt="Blog Image" />
          <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
          <p className="text-gray-600 mb-4">{blog.author}</p>
          <p className="text-blue-700 mb-4">{blog.date}</p>
          <p className="text-gray-700">{parse(blog.content)}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
