import React from 'react';

function ShowAnswersModal({ isOpen, onClose, submissions }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-3/4 overflow-auto p-6 relative">
                <h2 className="text-xl font-semibold mb-4">Submissions</h2>
                <div className="space-y-4">
                    {submissions.length === 0 ? (
                        <p>No submissions found for this task.</p>
                    ) : (
                        submissions.map((submission, index) => (
                            <div key={submission._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    {submission.student.avatar && (
                                        <img
                                            src={submission.student.avatar}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full mr-4"
                                        />
                                    )}
                                    <div className="relative">
                                        <p className="text-gray-800 font-semibold cursor-pointer">
                                            {submission.student.name || 'Unknown'}
                                        </p>
                                        <div className="absolute left-0 bg-gray-800 text-white text-xs rounded p-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            {submission.student.email}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{submission.answer}</p>
                                {submission.screenshot && (
                                    <div className="mb-4">
                                        <img
                                            src={submission.screenshot}
                                            alt={`Screenshot ${index + 1}`}
                                            className="max-w-full h-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                )}
                                <p className="text-sm text-gray-500">Submitted on: {new Date(submission.submittedAt).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShowAnswersModal;
