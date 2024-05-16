import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import URL from "../../URL";
import { MdArrowRight } from 'react-icons/md';
function UserList() {
  const [user_id, setId] = useState('');
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const URLgetUser= URL + "api/userlist/GetUser";
  const URLuserdetails= URL + "api/userlist/User_Details";
  const URLuserupdate= URL + "api/userlist/User_update";
  const URLAPIGetRole =URL+ "api/userlist/fetchrole";
  const URLdeleteusers = URL + "api/userlist/DeleteUsers";
  const [showPassword, setShowPassword] = useState(false);

// Function to toggle password visibility
const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};
  useEffect(() => {
    fetchUserList();
    fetchRoleList();
  }, [currentPage]);
  const handleAdduser = () => {
    navigate('/AddUser'); 
  };

  const fetchUserList = async () => {
    try {
      const response = await axios.post(URLgetUser, {
        currentPage: currentPage,
        perPage: perPage
      });

      if (response.data.Valid) {
        const { ResultSet, TotalCount } = response.data;
        setUserList(ResultSet);
        setTotalPages(Math.ceil(TotalCount / perPage));
      } else {
        handleRequestError('Error occurred while fetching data.');
      }
    } catch (error) {
      handleRequestError('Error occurred while fetching data.');
    }
  };

  const handleRequestError = (errorMessage) => {
    console.error(errorMessage);
    setMessage(errorMessage);
    setMessageType('error');
    setShowMessage(true);
  };

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(userList);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxToggle = (user) => {
    const isSelected = selectedUsers.some(selectedUser => selectedUser.id === user.id);

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleDeleteUsers = async () => {
  
    setShowConfirmation(true);
  
  };
  const handleConfirmDelete = async () => {
    setShowConfirmation(false); // Hide confirmation message box
    try {
      const selectedIds = selectedUsers.map(user => user.user_id);
      const response = await axios.post(URLdeleteusers, {
        ids: selectedIds
      });
  
      if (response.data.Valid) {
        setMessage(response.data.message);
        setMessageType('success');
        setShowMessage(true);
        fetchUserList();
      } else {
        console.error('Failed to delete users:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    getUserDetails(user.user_id);
  };

  const getUserDetails = async (id) => {
    try {
      const response = await axios.post(URLuserdetails, { id });
      if (response.data.Valid) {
        const userData = response.data.data;
        setUserDetails(userData);
        setShowModal(true);
      } else {
        alert('User not found');
      }
    } catch (error) {
      handleRequestError('Failed to fetch user details');
    }
  };
  const handleUpdate = async () => {
    
    try {
      const response = await axios.post( URLuserupdate, {
        user_id: userDetails.user_id,
        user_name: userDetails.user_name,
        role_id: userDetails.role_id,
        password: userDetails.password,
        
      });

  setMessage(response.data.message);

  if (response.data.Valid) {
    setMessageType('success');
    setShowMessage(true);
    fetchUserList();
    
  } else {
    setMessageType('error');
    setShowMessage(true);
    console.log('Error message:', response.data.message);
  }
} catch (error) {
  console.error('Error updating user information:', error);
}
};
  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const handleCancelDelete = () => {
    setShowConfirmation(false); // Hide confirmation message box
  };

  const fetchRoleList = async () => {
    try {
      const response = await axios.get(URLAPIGetRole);
      setRoles(response.data.roles);
    } catch (error) {
      setIsError(true);
      setMessage('Error occurred while fetching Roles.');
      console.error('Error:', error);
    }
  };


  return (
    <div className="container" data-aos="fade-up">
     {!showModal && ( 
      <div className="row">
        <div className="col-12 col-sm-12">
          <div className="card card-theme theme">
            <div className="card-header">
              <div className="row">
                <div className="col-12 col-md-6">
                  <h4>Update User Password</h4>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                <button className="btn btn-outline-success ml-auto" onClick={handleAdduser}>
                  Add User
                </button>
                <button onClick={handleDeleteUsers} className="btn btn-outline-danger" >
                Delete Selected
              </button>
              </div>
              </div>
            </div>
            <div className="card-body pack-short-info">
              <div className="row">
                <div className="col-md-12">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered" id="tbUser" width="100%" cellSpacing="0">
                        <thead>
                          <tr>
                            <th>
                              <input type="checkbox" onChange={handleSelectAllToggle} checked={selectAll} />
                            </th>
                            <th>Sl.No</th>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>Role Name</th>
                            <th>Password</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userList.map((user, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  onChange={() => handleCheckboxToggle(user)}
                                  checked={selectedUsers.some(selectedUser => selectedUser.user_id === user.user_id)}
                                />
                              </td>
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>{user.user_id}</td>
                              <td>{user.user_name}</td>
                              <td>{user.role_name}</td>
                              <td>
        <input type="password" value={user.password} disabled />
      </td>
                              <td>
                                <button onClick={() => handleEdit(user)} className="btn btn-primary">Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1} className="btn btn-primary">Prev</button>
              <span>{currentPage}</span>
              <button onClick={nextPage} disabled={currentPage >= totalPages} className="btn btn-primary">Next</button>
            </div>
          </div>
        </div>
      </div>
     )}
     {showConfirmation && (
        <MessageBox
          message="Are you sure you want to delete selected records?"
          type="confirmation"
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    {showModal && userDetails && (
  <div className="modal fade show" tabIndex="-1" role="dialog" aria-hidden="true" style={{ display: 'block' }}>
    <div className="modal-dialog modal-dialog-centered modal-xl">
      <div className="modal-content" style={{ width: '80%', maxWidth: '100%', margin: 'auto' }}>
        <div className="modal-header">
          <h5 className="modal-title">Edit User Information</h5>
          <button type="button" className="close" onClick={() => setShowModal(false)}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-12 col-sm-10">
              <div className="row">
                <div className="col-12 col-md-2 mb-3">
                  <label className="title">User ID</label>
                  <div>
                    <input
                      type="text"
                      autoComplete="off"
                      className="form-control only-positive-decimal"
                      name="UserID"
                      id="txtVendorIDEdit"
                      value={userDetails.user_id} 
                      readOnly
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-2 mb-3">
                  <label className="title">User Name</label>
                  <div>
                    <input
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name="userName"
                      id="txtuserNameEdit"
                      style={{width:'150%'}}
                      value={userDetails.user_name} 
                      onChange={(e) => setUserDetails({ ...userDetails, user_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-3 mb-3">
                  <label className="title"  style={{marginLeft:'50px'}} >Role Name<span className="text-danger">*</span></label>
                  <select
                    id="roleSelect"
                    className="form-select"
                    value={userDetails.role_id}
                    onChange={(e) => setUserDetails({ ...userDetails, role_id: e.target.value })}
                    style={{width:'100%', marginLeft:'50px'}}
                  >
                    <option value="">Select Role Name</option>
                    {roles.map(role=> (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3 mb-3" style={{ position: 'relative' }}>
  <label className="title" style={{ marginLeft: '50px' }}>Password</label>
  <div className="password-input" style={{ position: 'relative' }}>
    <input
      type={showPassword ? "text" : "password"}
      autoComplete="off"
      className="form-control"
      name="password"
      id="txtpasswordEdit"
      value={userDetails.password} 
      style={{ width: '180px' ,marginLeft: '50px'  }}
      onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
      required
    />
    <span
      style={{ position: 'absolute', right: '-70px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
      onClick={togglePasswordVisibility}
    >
      {showPassword ? (
        <FontAwesomeIcon icon={faEyeSlash} />
      ) : (
        <FontAwesomeIcon icon={faEye} />
      )}
    </span>
  </div>
</div>

              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between">
                <button onClick={handleUpdate} className="btn btn-success">
                  Update
                </button>
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
        </div>
      </div>
    </div>
  </div>
)}

      
    </div>
  );
}

export default UserList;
