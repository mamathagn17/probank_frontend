import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";
import './Permission.css'; // Import CSS file for styling

function Permission() {
  const [userrole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [userroles, setUserRoles] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);
  const [checkedState, setCheckedState] = useState({}); // State to track checkbox state
  const [expandedNodes, setExpandedNodes] = useState([]); // State to track expanded nodes

  const navigate = useNavigate();
  const URLAPIfetchuserrole = URL + "api/permission/fetchuserrole";
  const URLAPIfetchUsernames = URL + "api/permission/fetchusernames";
  const URLAPIfetchData = URL + "api/permission/data";
  const URLAPIgrantPermissions = URL + "api/permission/grantpermissions"; // New URL for granting permissions
  const URLAPIrevokePermissions = URL + "api/permission/revokepermissions"; // New URL for revoking permissions

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };

  useEffect(() => {
    fetchData();
    fetchUserroles();
  }, []);

  const fetchUserroles = async () => {
    try {
      const response = await axios.get(URLAPIfetchuserrole);
      setUserRoles(response.data.userroles);
    } catch (error) {
      setIsError(true);
      setMessage('Error occurred while fetching User Roles.');
      console.error('Error:', error);
    }
  };

  const handleRoleChange = async (e) => {
    const selectedRole = e.target.value;
    setUserRole(selectedRole);
    if (selectedRole === '1' || selectedRole === '2') {
      await fetchUsernames(selectedRole);
    } else {
      setUsernames([]); 
    }
  };
  
  const fetchUsernames = async (role_id) => {
    try {
      const response = await axios.post(URLAPIfetchUsernames, { role_id });
      setUsernames(response.data.usernames);
    } catch (error) {
      setIsError(true);
      setMessage('Error occurred while fetching User Names.');
      console.error('Error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(URLAPIfetchData);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchUserPermissions = async (userId) => {
    try {
      const response = await axios.post(URL + "api/permission/fetchuserpermissions", { userId });
      setUserPermissions(response.data.permissions || []);
      setCheckedState(response.data.permissions.reduce((acc, permission) => {
        acc[permission] = true;
        return acc;
      }, {}));
    } catch (error) {
      setIsError(true);
      setMessage('Error occurred while fetching user permissions.');
      console.error('Error:', error);
    }
  };

  const handleUserChange = async (e) => {
    const selectedUserId = e.target.value;
    setSelectedUser(selectedUserId);
    await fetchUserPermissions(selectedUserId);
  };

  const toggleChildVisibility = (parentId) => {
    setUserData(prevData => {
      return prevData.map(item => {
        if (item.RecID === parentId) {
          return {
            ...item,
            childrenVisible: !item.childrenVisible
          };
        }
        return item;
      });
    });
  };

  const handleCheckboxChange = (e) => {
    const checkboxValue = e.target.value;
    const isChecked = e.target.checked;
    setCheckedState(prevState => ({ ...prevState, [checkboxValue]: isChecked }));
  };

  // Function to handle grant permissions
  const handleGrantClick = async () => {
    try {
      const selectedPermissions = Object.keys(checkedState).filter(permission => checkedState[permission]);
      if (selectedPermissions.length === 0) {
        // Show error message if no permissions are selected
        setIsError(true);
        setMessage('Please select at least one permission to grant.');
        return;
      }

      // Call API to grant permissions
     const response= await axios.post(URLAPIgrantPermissions, { userId: selectedUser, permissions: selectedPermissions });
      if (response.data.Valid) {
       
        setShowMessage(true);
      setMessage(response.data.Valid);
      setMessageType('success');
      setCheckedState({});
      
      // Fetch user permissions again to update UI
      await fetchUserPermissions(selectedUser);
      
    
    } else {
      setShowMessage(true);
      setIsError(true);
      setMessage(response.data.message); 
    }

      // Clear checked state after granting permissions
     

      // Show success message
      setIsError(false);
      setMessage('Permissions granted successfully.');
    } catch (error) {
      setIsError(true);
      setMessage('Error occurred while granting permissions.');
      console.error('Error:', error);
    }
  };

  // Function to handle revoke permissions
  // const handleRevokeClick = async () => {
  //   try {
  //     const selectedPermissions = Object.keys(checkedState).filter(permission => checkedState[permission]);
  //     if (selectedPermissions.length === 0) {
  //       // Show error message if no permissions are selected
  //       setIsError(true);
  //       setMessage('Please select at least one permission to revoke.');
  //       return;
  //     }

  //     // Call API to revoke permissions
  //     await axios.post(URLAPIrevokePermissions, { userId: selectedUser, permissions: selectedPermissions });

  //     // Clear checked state after revoking permissions
  //     setCheckedState({});
      
  //     // Fetch user permissions again to update UI
  //     await fetchUserPermissions(selectedUser);

  //     // Show success message
  //     setIsError(false);
  //     setMessage('Permissions revoked successfully.');
  //   } catch (error) {
  //     setIsError(true);
  //     setMessage('Error occurred while revoking permissions.');
  //     console.error('Error:', error);
  //   }
  // };
  const handleRevokeClick = async () => {
    try {
      const response = await axios.post(URL + "api/permission/revokepermissions", {
        userId: selectedUser,
        permissions: Object.keys(checkedState).filter(permission => !checkedState[permission])
      });
      // Handle success response or update UI accordingly
      if (response.data.Valid) {
       
        setShowMessage(true);
      setMessage(response.data.message);
      setMessageType('success');
    
    } else {
      setShowMessage(true);
      setIsError(true);
      setMessage(response.data.message); 
    }// Log response or update UI message
    } catch (error) {
      setIsError(true);
      setMessage('Error occurred while revoking permissions.');
      console.error('Error:', error);
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);
  }

  const renderTree = (items, level = 0) => {
    return (
      <div>
        {items.map((item) => (
          <div key={item.RecID} style={{ marginLeft: `${level * 20}px `}}>
            {item.children && !level && (
              <FontAwesomeIcon
                icon={expandedNodes.includes(item.RecID) ? faAngleDown : faAngleRight}
                className="toggle-icon"
                onClick={() => toggleChildVisibility(item.RecID)}
              />
            )}
            <input 
              type="checkbox" 
              id={`node_${item.RecID}`} 
              value={item.RecID} 
              onChange={handleCheckboxChange}
              checked={checkedState[item.RecID]}
            />
            <FontAwesomeIcon icon={item.children ? faFolder : faFile} className={item.children ? "folder-icon" : "file-icon"} />
            <label htmlFor={`node_${item.RecID}`} onClick={() => toggleChildVisibility(item.RecID)}>{item.Caption}</label>
            {item.childrenVisible && item.children && renderTree(item.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card custom-card">
            <div className="card-header custom-card-header">
              <h4 className="text-center">Grant/Revoke Permissions</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="SelectUserRole" className="form-label">User Role<span className="text-danger"></span></label>
                  <select
                    id="SelectUserRole"
                    className="form-select"
                    value={userrole}
                    onChange={handleRoleChange}
                    required
                  >
                    <option value="">Select User Role</option>
                    {userroles.map(userRole => (
                      <option key={userRole.role_id} value={userRole.role_id}>
                        {userRole.role_name}
                      </option>
                    ))}
                  </select>
                </div>

                {userrole === '1' || userrole === '2' ? (
                  <div className="mb-3">
                    <label className="form-label">Usernames<span className="text-danger"></span></label>
                    <div>
                      <select
                        id="SelectUsername"
                        className="form-select"
                        value={selectedUser}
                        onChange={handleUserChange}
                        required
                      >
                        <option value="">Select Username</option>
                        {usernames.map(userName => (
                          <option key={userName.user_id} value={userName.user_id}>
                            {userName.user_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : null}

                <div>
                  <h3 className="text-center">Permissions</h3>
                  {renderTree(userData)}
                </div>

                <button type="button" className="btn btn-primary" onClick={handleGrantClick}>Grant</button> &nbsp;&nbsp;
                <button type="button" className="btn btn-danger" onClick={handleRevokeClick}>Revoke</button>
              </form>
              {showMessage && (
          <MessageBox
            message={message}
            type={messageType}
            onClose={clearMessage}
          />
        )}
              {isError && <p className="text-danger">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Permission;