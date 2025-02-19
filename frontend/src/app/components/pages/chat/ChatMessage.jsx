const ChatMessage = ({ message, isOwnMessage }) => {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            {!isOwnMessage && (
                <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                            {message.userName?.[0]?.toUpperCase()}
                        </span>
                    </div>
                </div>
            )}

            <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                {!isOwnMessage && (
                    <span className="text-sm text-gray-600 mb-1">
                        {message.userName}
                    </span>
                )}

                <div className="flex items-end gap-2">
                    {isOwnMessage && (
                        <span className="text-xs text-gray-500 mb-1">
                            {message.timestamp}
                        </span>
                    )}

                    <div className={`rounded-2xl px-4 py-2 ${isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                        }`}>
                        {message.content}
                    </div>

                    {!isOwnMessage && (
                        <span className="text-xs text-gray-500 mb-1">
                            {message.timestamp}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;