"use client"

import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import './InputBox.css';
import axios from 'axios';

interface Message {
    type: 'incoming' | 'outgoing';
    text: string;
}

export const InputBox: React.FC = () => {
    const [isChatbotVisible, setIsChatbotVisible] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        { type: 'incoming', text: 'Hi there 👋\nHow can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState<string>('');
    const chatInputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (chatInputRef.current) {
            chatInputRef.current.style.height = 'auto';
            chatInputRef.current.style.height = `${chatInputRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleToggleChatbot = () => {
        setIsChatbotVisible(!isChatbotVisible);
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { type: 'outgoing', text: inputValue.trim() }]);
            setInputValue('');
        }

        axios
            .post("http://localhost:3000/api/chatbot", { question: inputValue })
            .then((res) => {
                const incomingMessage: Message = { type: 'incoming', text: res.data.response };
                setMessages((prevMessages) => [...prevMessages, incomingMessage]);
            });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`app ${isChatbotVisible ? 'show-chatbot' : ''}`}>
            <button className="chatbot-toggler" onClick={handleToggleChatbot}>
                <span className="material-symbols-rounded">mode_comment</span>
                <span className="material-symbols-outlined">close</span>
            </button>
            <div className="chatbot">
                <header>
                    <h2>Chatbot</h2>
                    <span className="close-btn material-symbols-outlined" onClick={handleToggleChatbot}>close</span>
                </header>
                <ul className="chatbox">
                    {messages.map((msg, index) => (
                        <li key={index} className={`chat ${msg.type}`}>
                            {msg.type === 'incoming' && <span className="material-symbols-outlined">smart_toy</span>}
                            <p>{msg.text}</p>
                        </li>
                    ))}
                </ul>
                <div className="chat-input">
                    <textarea
                        ref={chatInputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a message..."
                        spellCheck="false"
                        required
                    ></textarea>
                    <span id="send-btn" className="material-symbols-rounded" onClick={handleSendMessage}>send</span>
                </div>
            </div>
        </div>
    );
};
