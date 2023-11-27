// AIExplainModal.jsx
import React, { useEffect, useState, useRef } from 'react';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import ReactMarkdown from 'react-markdown';
import styles from './chat.module.css';
import gfm from 'remark-gfm';


const AIModal = ({ onClose, strategyId }) => {
  const [wsData, setWsData] = useState("");
  const [a, setA] = useState("");
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    if (import.meta.env.VITE_ENV === 'prod') {
      url = `wss://${BACKEND_CHAT_URL}/v3/chat?strategy_id=${strategyId}`;
    } else {
      url = `ws://${ENV_CHAT_PROXY}/v3/chat?strategy_id=${strategyId}`;
    }
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.sender == 'bot' && parsedMessage.type == 'stream') {
        setWsData((prevState) => ((prevState || "") + parsedMessage.message));
      }
    };

    websocket.onopen = function(event) {
        console.log('Connection is open');
        websocket.send("hi");
    };

    websocket.onclose = () => {
      setWs("");
    };
    
    // Close the WebSocket connection when the component unmounts
    return () => {
      if (ws) ws.close();
    };
  }, [strategyId]);

  useEffect(() => {
    scrollToBottom();
  }, [wsData]);

  return (
    <>
      <Dialog open={true} handler={onClose}>
        <DialogHeader>About the strategy</DialogHeader>
        <DialogBody divider className="h-[40rem] overflow-scroll">
        <div className={`flex-grow mx-2 px-4 py-2 rounded-md mb-2 text-black ${styles.markdownanswer}`}>
            <ReactMarkdown remarkPlugins={[gfm]} linkTarget="_blank" className="prose">
                {wsData}
            </ReactMarkdown>
            <div ref={messagesEndRef}></div>
        </div>
            
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={onClose}>
            close
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AIModal;
