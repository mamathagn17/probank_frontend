import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";
function AddUser() {
 
  const [user_name, setusername] = useState('');
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  // const [password, setPassword] = useState([]);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const URLAPIfetchRole= URL + "api/adduser/fetchRoles";
  const URLadduser= URL + "api/adduser/adduser";
  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };


  useEffect(() => {
    fetchRoles();
}, []);



const fetchRoles = async () => {
  try {
    
      const response = await axios.get(URLAPIfetchRole);
      setRoles(response.data.roles);
  } catch (error) {
      setIsError(true);
      setContent('Error occurred while fetching Roles.');
      console.error('Error:', error);
  }
};

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);
    
    

    try {
      const response = await axios.post( URLadduser, {
       user_name:user_name,
       role_id:role,
      //  password:password
      });

      if (response.data.Valid) {
       
        setShowMessage(true);
      setMessage('User Saved Successfully..');
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
            <h2 className="text-center mb-4">User Creation</h2>
        </div>
    </div>

    
    <div className="row">
        <div className="col-md-6 mx-auto">
            <div className="card card-theme theme">
                <div className="card-header">
                    <div className="row">
                    <div className="col-6">
              <h4>User Creation</h4>
            </div>
            
          
                <div className="card-body">
                    <form id="clientbranch" onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label for="name" className="form-label">User Name<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setusername(e.target.value)}
                              type="text"
                              autoComplete="off"
                              className="form-control"
                              name="user_name"
                              required
                              id="txtUserName"
                              placeholder="Enter User Name"
                            />
                        </div>
                       
                        <div className="col-12 col-sm-6 mb-3">
                                        <label className="form-label">Select Role Name:</label>
                                        <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    style={{ width: '120%' }}
  
    className="form-select">
    <option value="">Select Role Name</option> 
    {roles.map(role => (
        <option key={role.role_id} value={role.role_id}>
            {role.role_name}
        </option>
    ))}
</select>
                                              <div className="dropdown-arrow"></div>
                                    </div>
                                    {/* <div className="mb-3">
                            <label for="password" className="form-label">Password<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setPassword(e.target.value)}
                              type="password"
                              autoComplete="off"
                              className="form-control"
                              name="password"
                              required
                              id="password"
                              placeholder="Enter Password"
                            />
                        </div> */}

                        
                        
                        
                        <div className="text-center">
                        <button type="submit" className="btn btn-outline-success" style={{ marginRight: '10px' }}>Save </button>
                       
                        </div>
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

export default AddUser;
