import {Fragment, useState, useEffect, useMemo, useRef} from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Input,
  Button,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import ReactMarkdown from 'react-markdown';
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  ChatBubbleBottomCenterIcon,
  EllipsisHorizontalIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import './dashboard.css'
import { BACKEND_CHAT_URL, ENV_CHAT_PROXY, ENV_PROXY } from "@/configs/globalVariable";
import styles from './chat.module.css';
import gfm from 'remark-gfm';
import { MentionsInput, Mention } from 'react-mentions';


const JettIcon = ({ className }) => {
  return <img src="/img/logo.png" alt="Bot Icon" className={className} />;
};

const UserIcon = ({ className }) => {
  return <img src="/img/user-icon.svg" alt="User Icon" className={className} />;
};


function ChatBox({strategyId}) {
  const [ws, setWs] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTildePresent, setIsTildePresent] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [partialQuery, setPartialQuery] = useState("");
  const [nameToIdMap, setNameToIdMap] = useState(new Map());

  const [messageState, setMessageState] = useState({
    messages: [
      {
        message: 'Hi, what would you like to ask me?',
        type: 'bot',
      },
    ],
    history: [],
    pending: undefined,
    sourceDocuments: []
  });
  const question = query.trim();
  const handleWebSocketMessage = (message) => {
    const parsedMessage = JSON.parse(message);
      if (parsedMessage.sender == 'you') {
        // we don't need to use this as we have already added it to the state before sending
        return
      }
      if (parsedMessage.type === "start") {
        setMessageState((prevState) => ({
          ...prevState,
          messages: [
            ...prevState.messages,
            {
              message: parsedMessage.message,
              type: parsedMessage.type,
            },
          ],
          pending: true
        }));
      } else if (parsedMessage.type === "stream") {
        setMessageState((prevState) => ({
          ...prevState,
          messages: [
            ...prevState.messages.slice(0, -1),
            {
              message: prevState.messages[prevState.messages.length - 1].message + parsedMessage.message,
              type: parsedMessage.sender,
            }
          ],
        }));
      } else if (parsedMessage.type === "end") {
        console.log(" parsedMessage.message",  parsedMessage.message)
        setMessageState((state) => ({
          history: [...state.history, [question, state.pending ?? '']],
          messages: state.messages,
          pending: undefined,
          sourceDocuments: parsedMessage.message
        }));
        setQuery('');
        setLoading(false);
      }
  }
  const onMessage = (event) => {
    const message = event.data;
    console.log(message)

    handleWebSocketMessage(message);
  };

  const search = async (force) => {
    if (isTildePresent || force) {
      const q = partialQuery || "";
      const results = await searchApi(q); 
      setAutocompleteResults(results);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("ENV_CHAT_PROXY", ENV_CHAT_PROXY);
    let url;
    if (import.meta.env.VITE_ENV === 'prod') {
      url = `wss://${BACKEND_CHAT_URL}/v3/chat/${strategyId}?token=${token}`;
    } else {
      url = `ws://${ENV_CHAT_PROXY}/v3/chat/${strategyId}?token=${token}`;
    }
    const ws = new WebSocket(url);
    // Callback when a message is received
    ws.onmessage = onMessage;
    ws.onopen = function(event) {
    console.log('Connection is open');
    };
    
    ws.onerror = function(error) {
      console.error('WebSocket error observed:', error);
    };
      
    ws.onclose = function(event) {
      console.log('Connection is closed', event.code, event.reason);
    };
        
    setWs(ws);
    setLoading(false);
    search(true);

    return () => {
      ws.close();
    }
  }, []);

  //handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();
    let queryToSend = question;
    for (const [name, id] of nameToIdMap) {
      console.log("name", id)
      queryToSend = queryToSend.replace(name, id);
    }

    console.log("queryToSend", queryToSend)

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'you',
          message: question,
        },
      ],
      pending: undefined,
    }));

    setLoading(true);
    setQuery('');
    setMessageState((state) => ({ ...state, pending: '' }));

    const ctrl = new AbortController();

    try {
      console.log(ws)
      ws.send(queryToSend);
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = (e) => {
    console.log(e.key)
    if (isTildePresent) {
      return;
    }
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  const { messages, pending, history, sourceDocuments=[] } = messageState;
  const [open, setOpen] = useState(-1);
  const showSource = true;

  const handleOpen = (value) => {
    setOpen(open === value ? -1 : value);
  };
  const chatMessages = useMemo(() => {
    console.log("messages", messages)
    return [
      ...messages
    ];
  }, [messages]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const searchApi = async (query) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${ENV_PROXY}/v1/autocomplete/?query=`+query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        return [];
      }
      let res = await response.json();
      console.log("res", res);
      res = res.map(result => ({ id: result.id, display: result.name }));
      console.log("res", res)
      return res;
    } catch(e) {
      console.log("error in autocomplete");
      console.log(e);
      return [];
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, sourceDocuments]);
  console.log("sourceDocuments", sourceDocuments, showSource)

  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
  
    if (value.includes("~")) {
      const afterTilde = value.split("~").pop();
      setIsTildePresent(true);
      setPartialQuery(afterTilde);
    } else {
      setIsTildePresent(false);
    }
  }

  const handleSelect = (id) => {
    const selectedResult = autocompleteResults.find(m => m.id === id); 
    const parts = query.split("~");
    parts.pop(); // remove the part after the last "~"
    console.log("selectedResult", selectedResult)
    parts.push("`" + selectedResult.display + "`"); // add the selected result
    console.log("selected result", selectedResult)
    setQuery(parts.join(" ")); // join the parts back together without "~"
    // Update the map with the new name-id association
    setNameToIdMap(prevMap => new Map(prevMap.set(selectedResult.display, selectedResult.id)));
    setAutocompleteResults([]);
    setIsTildePresent(false);
  }
  
  useEffect(() => {
    search();
  }, [partialQuery, isTildePresent]);
  
  return (
    <div className="h-full border border-gray-300 rounded-lg relative grid grid-cols-1 grid-rows-[1fr,auto]">
    <div className={`m-4 overflow-y-auto`}>
      {chatMessages.map((message, index) => {
        if (message.message === "") {
          return;
        }
        let icon;
        let className;
        let textName;
        if (message.type === "bot") {
          icon = <JettIcon className="h-6 w-6" />;
          className = "flex items-center gap-2 rounded-md mb-2 bg-gray-50";
          textName = "text-black";
        } else {
          icon = <UserIcon className="h-6 w-6" />;
          className = "flex items-center gap-2 rounded-md mb-2  bg-gray-50";
          textName = "text-black";
        }
        return (
          <div key={`chatMessage-${index}`} className={className}>
            <div className="flex-none mx-2">{icon}</div>
            <div className={`flex-grow mx-2 px-4 py-2 rounded-md mb-2 ${styles.markdownanswer} ${textName}`}>
              <ReactMarkdown remarkPlugins={[gfm]} linkTarget="_blank">
                {message.message}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef}></div>
    </div>
    <div className="flex flex-col justify-end max-h-[300px]">
      {showSource && sourceDocuments && (
        <div className="m-4 relative overflow-y-auto flex-grow">
          <Fragment>
            {sourceDocuments.map((doc, index) => (
              <div key={`messageSourceDocs-${index}`}>
                <Accordion open={open === index}>
                  <AccordionHeader onClick={() => handleOpen(index)}>
                    <h3>Source {index + 1}</h3>
                  </AccordionHeader>
                  <AccordionBody className="overflow-y-auto max-h-[200px]">
                    <div linkTarget="_blank">
                      {doc.page_content}
                    </div>
                    <p className="mt-2">
                      <b>Source:</b> {doc.metadata && doc.metadata.source}
                    </p>
                  </AccordionBody>
                </Accordion>
              </div>
            ))}
          </Fragment>
        </div>
      )}

      <div className="p-4">
        <div className="relative w-full">
        <MentionsInput
            value={query}
            onChange={handleInput}
            onKeyDown={handleEnter}
            placeholder="Send a message..."
            disabled={loading}
            className={loading ? "pr-10" : ""}
            classNames={{
              input: 'border-2 rounded-lg h-10 flex items-center py-2',
            }}
            style={{
              control: {
              },
              highlighter: {
                overflow: 'hidden',
              },
              input: {
                margin: 0,
                border: 0, // remove the individual input field border
                outline: 'none', // add this line to remove outline on focus
                paddingLeft: '10px',
                paddingTop: '8px',
                fontSize: '12px'
              },
              suggestions: {
                list: {
                  position: 'absolute',
                  bottom: '100%', // positions the dropdown above the input
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '12px'
                },
                item: {
                  padding: '5px 15px',
                  borderBottom: '1px solid rgba(0,0,0,0.15)',
                  '&focused': {
                    backgroundColor: '#cee4e5',
                  },
                },
              },
            }}
          >
          <Mention
            trigger="~"
            data={autocompleteResults}
            onAdd={handleSelect}
            appendSpaceOnAdd={true}
          />
        </MentionsInput>

        {loading ? (
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500 animate-ellipsis bold-loader" />
          </div>
        ) : (
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            <PaperAirplaneIcon className="h-4 w-4 text-gray-500 bold-loader" />
          </div>
        )}
        </div>
      </div>
    </div>
  </div>
  

  );
}

export function Chat() {
  return (
    <>
      <div className="h-12 w-full"></div>
      <div className="h-[calc(60vh-48px)] sm:h-[calc(50vh-48px)] md:h-[calc(70vh-48px)] lg:h-[calc(90vh-48px)] xl:h-[calc(95vh-48px)] flex flex-col">
        <Card className="flex flex-col h-full w-full">
          <CardBody className="flex-1 flex flex-col overflow-y-auto">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Chat with us
            </Typography>
            <div className="flex-1 overflow-y-auto">
            <ChatBox />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}


export default Chat;
