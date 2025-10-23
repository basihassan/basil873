
import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
  const bubbleClasses = isSender
    ? "bg-pink-500 text-white self-end rounded-l-2xl rounded-tr-2xl"
    : "bg-gray-200 text-gray-800 self-start rounded-r-2xl rounded-tl-2xl";

  return (
    <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} mb-4`}>
      <div className={`max-w-xs md:max-w-md p-3 px-4 ${bubbleClasses}`}>
        <p className="text-sm">{message.text}</p>
      </div>
      <p className="text-xs text-gray-400 mt-1 px-1">{message.timestamp}</p>
    </div>
  );
};

export default MessageBubble;
