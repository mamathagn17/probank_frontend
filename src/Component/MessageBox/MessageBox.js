import React from 'react';
import './MessageBox.css'

function MessageBox({ message, type, onClose, onConfirm, onCancel }) {
  const getMessageClass = () => {
    return type === 'success' ? 'success-message' : 'error-message';
  };

  const isConfirmationMessage = typeof onConfirm === 'function' && typeof onCancel === 'function';

  return (
    <div className="message-box-container">
      <div className={`message-box ${getMessageClass()}`}>
        <div className="message-box-content">
          <p>{message}</p>
         
          {!isConfirmationMessage && <button className="close-button" onClick={onClose}>Close</button>}
         
          {isConfirmationMessage && (
            <div>
              <button  onClick={onConfirm} className="btn btn-outline-success">Yes</button>
              <button onClick={onCancel} className="btn btn-outline-danger" style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
