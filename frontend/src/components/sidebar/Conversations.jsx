import React from 'react'
import Conversation from './Conversation'
import useGetConversation from '../../hooks/useGetConversation';
import { getRandomEmoji } from '../../utils/emojis';

const Conversations = () => {
  const {loading, conversation } = useGetConversation();
  // console.log("CONVERSATIONS: ",conversation);
  return (
      <div className='py-2 flex flex-col overflow-auto'>
        {conversation.map((conversation, idx) => (
          <Conversation 
          key={conversation._id}
          conversation = {conversation}
          emoji = {getRandomEmoji()}
          lastIdx = {idx == conversation.length - 1}
        />
        ))}
        
          {loading ? <span className='loading loading-spinner mx-auto'></span> : null}  
      </div>
      );
  
}

export default Conversations





//STATER CODE FOR CONVERSATION
// import React from 'react'
// import Conversation from './Conversation'

// const Conversations = () => {
//   return (
//     <div className='py-2 flex flex-col overflow-auto'>
//         <Conversation />
//         <Conversation />
//         <Conversation />
//         <Conversation />
//         <Conversation />
//         <Conversation />

//     </div>
//   )
// }

// export default Conversations