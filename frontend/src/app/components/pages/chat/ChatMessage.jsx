const ChatMessage = ({ message, isOwnMessage, showTimestamp }) => {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-[4px]`}>
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
                    <span className="text-xs text-gray-600 mb-1">
                        {message.userName}
                    </span>
                )}

                <div className="flex items-end gap-1">
                    {isOwnMessage && showTimestamp && (
                        <span className="text-[11px] text-gray-500 self-end mb-[2px]">
                            {message.timestamp}
                        </span>
                    )}

                    <div className={`px-4 py-2 text-sm leading-[1.35] ${isOwnMessage
                        ? 'bg-blue-500 text-white rounded-[1.1rem] rounded-tr-[2px]'
                        : 'bg-gray-100 text-gray-900 rounded-[1.1rem] rounded-tl-[2px]'
                        }`}>
                        {message.content}
                    </div>

                    {!isOwnMessage && showTimestamp && (
                        <span className="text-[11px] text-gray-500 self-end mb-[2px]">
                            {message.timestamp}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;