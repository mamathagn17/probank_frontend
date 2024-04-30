import React from 'react';
import './MessageBox.css'

function MessageBox({ message, type, onClose }) {
  const getMessageClass = () => {
    return type === 'success' ? 'success-message' : 'error-message';
  };

  return (
    <div className="message-box-container">
      <div className={`message-box ${getMessageClass()}`}>
        <div className="message-box-content">
          <p>{message}</p>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;