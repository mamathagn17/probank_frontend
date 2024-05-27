import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import { Button } from 'react-bootstrap';
import Dashboard from '../DashBoard/DashBoard';
import URL from "../../URL";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const URLAPILogin = URL + "api/auth/Login";
  const navigate = useNavigate();

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);

    try {
      const response = await axios.post(URLAPILogin, {
        username: username,
        password: password
      });

      if (response.data.Valid) {
        setShowMessage(true);
        setMessage('Login successful');
        setMessageType('success');
        
        const { user_id, user_name } = response.data;

        if (password === "12345678") {
          navigate(`/FirstLogin?user_id=${user_id}`);
        } else {
          const routesResponse = await axios.post(URL + 'api/permission/dynamicRoutes', { userInfo: { user_id, user_name } });
          if (routesResponse.data.isValid) {
            localStorage.setItem('userInfo', JSON.stringify({ user_id, user_name }));
            localStorage.setItem('routes', JSON.stringify(routesResponse.data.routes));
            console.log('Stored routes:', routesResponse.data.routes); // Debug log
            setMessage('Welcome to home');
            setShowMessage(true);
            navigate('/VendorCreation')
            // navigate('/DashBoard');
          } else {
            console.error(routesResponse.data.responseText);
            setIsError(true);
            setMessageType('error');
            setMessage('Error fetching routes. Please try again.');
          }
        }
      } else {
        setShowMessage(true);
        setIsError(true);
        setMessageType('error');
        setMessage("Invalid Username or Password");
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card">
          <div className="card-header">
            <h4 className="text-center">Login</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="txtusername" className="form-label">Username<span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  name="username"
                  id="txtusername"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="txtpassword" className="form-label">Password</label>
                <input
                  type="password"
                  autoComplete="off"
                  className="form-control"
                  name="password"
                  id="txtpassword"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid">
                <Button variant="success" type="submit">Login</Button>
              </div>
              <div className="text-center mt-2">
                <Link to="/forgotpassword">Forgot Password?</Link>
              </div>
            </div>
          </form>
        </div>
        {showMessage && (
          <MessageBox
            message={message}
            type={messageType}
            onClose={clearMessage}
          />
        )}
      </div>
    </div>
  );
}

export default Login;
