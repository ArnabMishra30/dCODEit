
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function HomeCard({ title, content, image, onReadMore, isLoggedIn }) {
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
                <button onClick={onReadMore} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-cyan-500">
                    Read More
                </button>
                
            </div>
        </div>
    );
}

export default HomeCard;
