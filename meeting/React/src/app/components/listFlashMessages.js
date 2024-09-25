import React from 'react';
import { useAtom } from 'jotai';
import { flashMsgListAtom } from '../app.js';
import { nanoid } from 'nanoid';
import findIndex from 'lodash/findIndex';
import { useAtomDevtools } from 'jotai/devtools';
import "./styles/listFlashMessages.scss";

export const addFlashMessage = ({type, text}) => {
  const [flashMsgList, setFlashMsgList] = useAtom(flashMsgListAtom);
  setFlashMsgList([
    ...flashMsgList,
      {
        id: nanoid(),
        type: type,
        text: text
      }
  ]) 
};
  
function ListFlashMessages() {
  const [flashMsgList, setFlashMsgList] = useAtom(flashMsgListAtom);
	
  const deleteFlashMessage = (message) => {
		const useMsgDevtools = () => {
      useAtomDevtools(flashMsgListAtom)
		}
    const index = findIndex(flashMsgList, { id: message.id }); 
    if (index >= 0) {
      setFlashMsgList([
        ...flashMsgList.slice(0, index),
        ...flashMsgList.slice(index + 1)
      ]);
    }
  };

  const DisplayFlashMessage = (message) => {
    const handleClick = (e) => {
      deleteFlashMessage(message);
    }
    if (message.id === 0) {
			() => deleteFlashMessage(message);
			return(<div />);
		}
    if (message.type === 'success') {
      return (
        <div className='bar'>
         <div className='messageSuccess'>
            <div className='empty' />
            {message.text}
            <button className='closeButton' onClick={handleClick}><span>&times;&nbsp;&nbsp;</span></button>
          </div>
        </div>
      );
    } else {
      return (
        <div className='bar'>
         <div className='messageError'>
            <div className='empty' />
            {message.text}
            <div className='closeButton' onClick={handleClick}><span>&times;&nbsp;&nbsp;</span></div>
          </div>
        </div>
      );
    }
  }

	const messageList = flashMsgList.map(message =>
	< DisplayFlashMessage key={message.id} id={message.id} text={message.text} type={message.type}/>
	);
	
	return (
		<div>{messageList}</div>
		);
}
export default ListFlashMessages;

