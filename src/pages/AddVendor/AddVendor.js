import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import { useLocation } from 'react-router-dom';
import URL from "../../URL";

import HolderCreationLogs from '../HolderCreationLogs/HolderCreationLogs';
function AddVendor() {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
  // const location = useLocation();
  // const userInfo = location.state.userInfo;
  // console.log('userInfo in addvendor:', userInfo);

  const [licenseHolderId, setLicenseHolderId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const URLAPIadduser = URL + "api/addvendor/AddUser";
  const URLHolderlogs = URL+"api/addvendor/Holdercreationlogssave";

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(9|8|7|6)[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);
    
    if (!name) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please enter a Vendor name.');
      return;
    }
    
    if (!email) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please Enter Email ID.');
      return;
    }
    
    if (!user_name) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please Enter User Name.');
      return;
    }

    
    if (!password) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please Enter Password.');
      return;
    }
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please enter a valid email address.');
      return;
    }

    // Validate phone number
    const isPhoneValid = validatePhone(phone);
    if (!isPhoneValid) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const response = await axios.post(URLAPIadduser, {
        name: name,
        email: email,
        phone: phone,
        user_name: user_name,
        password: password,
      });

      if (response.data.Valid) {
        setShowMessage(true);
        setMessage('Vendor Details Saved Successfully..');
        setLicenseHolderId(response.data.license_holderid);
        saveHolderCreationLog(response.data.license_holderid);
      

    
      setMessageType('success');
      setName('');
      setEmail('');
      setPassword('');
      setUserName('');
      setPhone('');
      //setContent('Vendor Details Saved Successfully..');
      //navigate('/');
    } else {
      setShowMessage(true);
      setIsError(true);
      setMessage(response.data.message); // Set error message from backend
    }
  } catch (error) {
    setIsError(true);
    console.error('Error:', error);
    }
  }
  const handleListView = () => {
    navigate('/VendorCreation'); // Navigate to vendorCreation.js component
  };
  
  const saveHolderCreationLog = async (licenseHolderId) => {
    console.log(userInfo);
    try {
      const data = {
        userInfo,
        license_holderid: licenseHolderId, // Pass the license holder id here
        name,
      };
      console.log(data);
      const response = await axios.post(URLHolderlogs, data);
  
      if (!response.data.success) {
        console.error('Failed to save holder creation log:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving holder creation log:', error);
    }
  };
  

  return (
    <div className="container" data-aos="fade-up">

    
    <div className="row">
        <div className="col-md-6 mx-auto">
            <h2 className="text-center mb-4">Creating License Holder</h2>
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
            <div className="col-6 text-end">
              <button onClick={handleListView} className="btn btn-outline-success">ListView</button>
            </div>
          
                <div className="card-body">
                    <form id="userCreationForm" onSubmit={handleSubmit}>
                        
                        <div className="mb-3">
                            <label for="name" className="form-label">Name<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setName(e.target.value)}
                              type="text"
                              autoComplete="off"
                              className="form-control"
                              name="name"
                             value={name}
                              id="txtVendorName"
                              placeholder="Enter VendorName"
                            />
                        </div>
                        <div className="mb-3">
                            <label for="email" className="form-label">Email<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setEmail(e.target.value)}
                              type="text"
                              autoComplete="off"
                              className="form-control"
                              name="email"
                             value={email}
                              id="txtEmail"
                              placeholder="Enter Email ID"
                            />
                        </div>
                        <div className="mb-3">
                            <label for="phone" className="form-label">Phone<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setPhone(e.target.value)}
                              type="tel"
                              autoComplete="off"
                              className="form-control"
                              value={phone}
                              name="phone"
                             
                              id="txtPhone"
                              placeholder="Enter Phone Number"
                            />
                        </div>
                        <div className="mb-3">
                            <label for="username" className="form-label">Username<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setUserName(e.target.value)}
                              type="text"
                              autoComplete="off"
                              className="form-control"
                              value={user_name}
                              name="username"
                            
                              id="txtUserName"
                              placeholder="Enter User Name"
                            />
                        </div>
                        <div className="mb-3">
                            <label for="password" className="form-label">Password<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setPassword(e.target.value)}
                              type="password"
                              autoComplete="off"
                              className="form-control"
                              value={password}
                              name="password"
                            
                              id="txtPassword"
                              placeholder="Enter Password"
                            />
                        </div>
                        <div className="text-center">
                        <button type="submit" className="btn btn-outline-success" style={{ marginRight: '10px' }}>Save</button>
                        <button type="reset" className="btn btn-outline-warning" style={{ marginRight: '10px' }}>Cancel</button>
                        <button type="button" className="btn btn-outline-danger" style={{ marginRight: '10px' }} onClick={() => "goToSignupPage()"}>Exit</button>
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

export default AddVendor;