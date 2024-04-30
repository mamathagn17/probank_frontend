import React, { useState } from 'react';
import axios from 'axios';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import { Button, Row, Col, Container } from 'react-bootstrap'; // Import Row, Col, and Container from react-bootstrap
import URL from "../../URL";
import { useLocation,useNavigate } from 'react-router-dom';

function FirstLogin() {
  const [defaultpassword, setDefault] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get('user_id');
  const URLAPIReset= URL + "api/auth/ResetPassword";
  const navigate = useNavigate();

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
    navigate('/Login'); 
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    setIsError(false);

    try {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        setIsError(true);
        setMessage("Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        setShowMessage(true);
        return;
      }
      if (password !== confirmPassword) {
        setIsError(true);
        setMessage("Passwords do not match. Please try again.");
        setShowMessage(true);
        return;
      }

      const response = await axios.post(URLAPIReset, {
        user_id: userId,
        defaultpassword: defaultpassword,
        newPassword: password
      });


      console.log(response);

      if (response.data.Valid) {
        setShowMessage(true);
        setMessage('Password reset successful');
        
        setMessageType('success');
      } else {
        setShowMessage(true);
        setIsError(true);
        setMessage(response.data.message);
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={6}>
          <div className="card">
            <div className="card-header">
              <h4 className="text-center">Password Reset</h4>
            </div>
            <form>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="txtdefaultpass" className="form-label">Default Password<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="password"
                    autoComplete="off"
                    className="form-control"
                    name="defaultpass"
                    id="txtdefaultpass"
                    placeholder="Enter Default Password"
                    value={defaultpassword}
                    onChange={(e) => setDefault(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="txtpassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    autoComplete="off"
                    className="form-control"
                    name="password"
                    id="txtpassword"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="txtconfirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    autoComplete="off"
                    className="form-control"
                    name="confirmPassword"
                    id="txtconfirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <Button variant="success" onClick={handleSubmit}>Reset</Button>
                </div>
              </div>
            </form>
            {showMessage && (
              <MessageBox
                message={message}
                type={messageType}
                onClose={clearMessage}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default FirstLogin;
