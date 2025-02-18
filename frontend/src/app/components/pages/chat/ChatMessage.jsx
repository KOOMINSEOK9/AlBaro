const ChatMessage = ({ message, isOwnMessage }) => {

    console.log('Message props:', message);

    return (
        <div className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {!isOwnMessage && (
                <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                        <span className="text-sm font-medium text-blue-700">
                            {message.username?.[0]?.toUpperCase()}
                        </span>
                    </div>
                </div>
            )}

            <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                {!isOwnMessage && (
                    <span className="text-sm font-medium text-gray-700 mb-1.5 ml-0.5">
                        {message.username}
                    </span>
                )}

                <div className="flex items-end gap-2">
                    {isOwnMessage && (
                        <span className="text-xs text-gray-500">
                            {message.timestamp}
                        </span>
                    )}

                    <div className={`px-4 py-2.5 ${isOwnMessage
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-md shadow-sm'
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm'
                        }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {!isOwnMessage && (
                        <span className="text-xs text-gray-500">
                            {message.timestamp}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;