import React, { useState } from 'react';
import { BsSend, BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import useSendMessage from '../../hooks/useSendMessage';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { loading, sendMessage } = useSendMessage();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Initialize with boolean value

  const handleEmojiClick = (emojiObject) => {
    // Append the selected emoji to the current message
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return; // Prevent sending empty messages

    await sendMessage(message); // Call sendMessage function from useSendMessage hook
    setMessage(''); // Clear the message input after sending
    setShowEmojiPicker(false); // Hide the emoji picker after sending
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
          type="text"
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type='button'
          className='absolute inset-y-0 right-8 flex items-center pr-3 cursor-pointer'
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <BsEmojiSmile />
        </button>

        {showEmojiPicker && (
          <div className='absolute bottom-12 left-0'>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
