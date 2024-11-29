import React, { useEffect } from 'react';
import { motion } from 'framer-motion'; // For animation

const WelcomeMessage = ({ username, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); // Close the welcome message after 3 seconds
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [onClose]);

    const getGreeting = () => {
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 0 && hour < 12) {
            return "Good morning!";
        } else if (hour >= 12 && hour < 18) {
            return "Good afternoon!";
        } else {
            return "Good evening!";
        }

    };

    return (
        <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="text-white text-4xl font-bold mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
            >
                Welcome, {username}!
            </motion.div>
            <motion.div
                className="text-white text-2xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {getGreeting()}!
            </motion.div>
        </motion.div>
    );
};

export default WelcomeMessage;
