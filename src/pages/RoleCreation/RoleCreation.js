import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";
function RoleCreation() {
  //const [category_id, setid] = useState('');
  const [role_name, setRole] = useState('');
  
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const URLaddrole = URL + "api/rolecreation/addrole";

 

  

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);
    
    

    try {
      const response = await axios.post(URLaddrole, {
       role_name:role_name
      });

      if (response.data.Valid) {
       
        setShowMessage(true);
      setMessage('Role Saved Successfully..');
      setMessageType('success');
      //navigate('/');
    } else {
      setShowMessage(true);
      setIsError(true);
      setMessage(response.data.message); 
    }
  } catch (error) {
    setIsError(true);
    console.error('Error:', error);
    }
  }
 

  return (
    <div className="container" data-aos="fade-up">

    
    <div className="row">
        <div className="col-md-6 mx-auto">
            <h2 className="text-center mb-4">Role Creation</h2>
        </div>
    </div>

    
    <div className="row">
        <div className="col-md-6 mx-auto">
            <div className="card card-theme theme">
                <div className="card-header">
                    <div className="row">
                    <div className="col-6">
              <h4>Role Creation</h4>
            </div>
            
          
                <div className="card-body">
                    <form id="role" onSubmit={handleSubmit}>
                        
                        {/* <div className="mb-3">
                            <label for="ID" className="form-label">ID<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setid(e.target.value)}
                              type="number"
                              autoComplete="off"
                              className="form-control"
                              name="name"
                              required
                              id="txtCategoryID"
                              placeholder="Enter Category ID "
                            />
                        </div> */}
                        <div className="mb-3">
                            <label for="name" className="form-label">Role Name<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setRole(e.target.value)}
                              type="text"
                              autoComplete="off"
                              className="form-control"
                              name="role_name"
                              required
                              id="txtRoleName"
                              placeholder="Enter Role Name"
                            />
                        </div>
                        
                        
                        
                        <div className="text-center">
                        <button type="submit" className="btn btn-outline-success" style={{ marginRight: '10px' }}>ADD </button>
                       
                        </div>
                        {/* <div className="text-center">
                        <button type="button" className="btn btn-outline-success" style={{ marginRight: '10px' }}>Cancel</button>
                       
                        </div> */}
                    </form>
                    {showMessage && (
          <MessageBox
            message={message}
            type={messageType}
            onClose={clearMessage}
          />
        )}
                    {isError && <p>{content}</p>}
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
    </div>










    
  );
}

export default RoleCreation;
