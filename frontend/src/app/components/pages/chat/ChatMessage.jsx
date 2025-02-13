// ChatMessage.jsx
const ChatMessage = ({ message, isOwnMessage }) => {
    return (
        <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {!isOwnMessage && (
                <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                            {message.senderName?.[0]}
                        </span>
                    </div>
                </div>
            )}

            <div className={`flex flex-col max-w-[65%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                {!isOwnMessage && (
                    <span className="text-sm text-gray-700 mb-1 ml-1">
                        {message.senderName}
                    </span>
                )}

                <div className="flex items-end space-x-1">
                    {isOwnMessage && (
                        <span className="text-xs text-gray-400 self-end mb-1">
                            {message.timestamp}
                        </span>
                    )}

                    <div
                        className={`px-4 py-2 rounded-2xl break-words ${isOwnMessage
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                    >
                        <p className="text-sm">{message.content}</p>
                    </div>

                    {!isOwnMessage && (
                        <span className="text-xs text-gray-400 self-end mb-1">
                            {message.timestamp}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;