import React from 'react';
import './PopUp.css'

function PopUp({ showModal, toggleModal, modules }) {
  //   console.log("showModal prop:", showModal);
  // console.log("toggleModal prop:", toggleModal);
  return (
    <>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>Module Names</h2>
            <ul>
              {modules.map(module => (
                <li key={module.ModuleName}>{module.ModuleName}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default PopUp;
