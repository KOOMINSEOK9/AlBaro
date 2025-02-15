// ChatInput.jsx
'use client';

import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="border-t bg-white px-8 py-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <div className="flex-1 flex items-center bg-gray-50 rounded-xl border border-gray-200">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                    전송
                </button>
            </form>
        </div>
    );
};

export default ChatInput;