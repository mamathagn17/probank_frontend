import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import URL from "../../URL";
function UserList() {
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
  const navigate = useNavigate();
  const URLgetUser= URL + "api/userlist/GetUser";
  const URLDeleteusers= URL + "api/userlist/DeleteUsers";
  const URLuserdetails= URL + "api/userlist/User_Details";
  const URLuserupdate= URL + "api/userlist/User_update";
  useEffect(() => {
    fetchUserList();
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
    try {
      const selectedIds = selectedUsers.map(user => user.id);
      const response = await axios.post(URLDeleteusers, {
        ids: selectedIds
      });

      if (response.data.Valid) {
        console.log('Users deleted successfully');
        fetchUserList();
      } else {
        console.error('Failed to delete users:', response.data.message);
        handleRequestError(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting users:', error);
      handleRequestError('Error deleting users.');
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
                            <th>Role ID</th>
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
                                  checked={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                                />
                              </td>
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>{user.user_id}</td>
                              <td>{user.user_name}</td>
                              <td>{user.role_id}</td>
                              <td>{user.password}</td>
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
                        value={userDetails.user_name} 
                        onChange={(e) => setUserDetails({ ...userDetails, user_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4 mb-3">
                    <label className="title">Role id</label>
                    <div>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        name="roleid"
                        id="txtroleidEdit"
                        value={userDetails.role_id} 
                        style={{width:'50%'}}
                        onChange={(e) => setUserDetails({ ...userDetails, role_id: e.target.value })}
                        placeholder="Enter Email"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-2 mb-3">
                    <label className="title" style={{marginLeft:'-110px'}}>Password</label>
                    <div>
                      <input
                        type="password"
                        autoComplete="off"
                        className="form-control"
                        name="password"
                        id="txtpasswordEdit"
                        value={userDetails.password} 
                        style={{width:'180%' ,marginLeft:'-110px'}}
                        onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
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
