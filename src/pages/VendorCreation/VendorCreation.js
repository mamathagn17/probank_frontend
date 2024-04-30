import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import URL from "../../URL";
import { useLocation } from 'react-router-dom';
function VendorCreation() {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
  const [license_holderid, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userList, setUserList] = useState([]);
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [userDetails, setUserDetails] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 10;
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const URLdeleteusers = URL + "api/vendor/DeleteUsers";
  
  const URLgetuser = URL + "api/vendor/GetUserlist";
  const URLupdate = URL + "api/vendor/updateUser";
  const URLvendordetails = URL+"api/vendor/Vendor_Details";

  const [categoryList, setCategoryList] = useState([]);
  // const [content, setContent] = useState('');
 const navigate = useNavigate();

 useEffect(() => {
  // Fetch user list when component mounts
  fetchUserList();
}, [currentPage]); 

const handleAddNew = () => {
  navigate('/AddUser'); 
};
const handleCancel = () => {
  navigate('/VendorCreation'); 
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^(9|8|7|6)[0-9]{9}$/;
  return phoneRegex.test(phone);
};

  const fetchUserList = async () => {
    try {
      const response = await axios.post(URLgetuser, {
        license_holderid: license_holderid,
        name: name,
        email: email,
        phone: phone,
        currentPage: currentPage,
        perPage: perPage,
      });

      if (response.data[0].Valid) {
      
      const startIndex = (currentPage - 1) * perPage;
      const usersForCurrentPage = response.data[0].ResultSet.slice(startIndex, startIndex + perPage);
      setUserList(usersForCurrentPage);
      const totalUsers = response.data[0].TotalCount;
      const totalPages = Math.ceil(totalUsers / perPage);
      setTotalPages(totalPages);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSelectUser = (userId) => {
    // Check if the user ID is already selected
    const index = selectedUserIds.indexOf(userId);
    if (index === -1) {
      // If not selected, add to the list
      setSelectedUserIds([...selectedUserIds, userId]);
    } else {
      // If already selected, remove from the list
      const updatedSelectedUserIds = selectedUserIds.filter(license_holderid => license_holderid !== userId);
      setSelectedUserIds(updatedSelectedUserIds);
    }
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
    const isSelected = selectedUsers.some(selectedUser => selectedUser.license_holderid === user.license_holderid);

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.license_holderid!== user.license_holderid));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  const handleDeleteUsers = async () => {
    try {
      const selectedIds = selectedUsers.map(user => user.license_holderid);
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUserList();
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    getUserDetails(user.license_holderid);
  };
  const getUserDetails = async (license_holderid) => {
    try {
      const response = await axios.post(URLvendordetails, {license_holderid});
      if (response.data.Valid) {
        const userData = response.data.data;
        setUserDetails(userData); 
        setShowModal(true); 
      } else {
        alert('User not found');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch user details!!');
    }
  };
  // const handleUpdate = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/updateUser', {
  //       id: userDetails.id,
  //       name: userDetails.name,
  //       email: userDetails.email,
  //       phone: userDetails.phone,
  //       user_name: userDetails.user_name,
  //       password: userDetails.password,
  //     });
  //     if (response.data.success) {
  //       console.log('User information updated successfully');
      
  //       fetchUserList();
       
  //       setShowModal(false);
  //     } else {
  //       console.error('Failed to update user information:', response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error updating user information:', error);
  //   }
  // };
  // const handleDelete = async (id) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/DeleteUser', { id });
  
  //     if (response.data.success) {
  //       console.log('User deleted successfully');
  //       fetchUserList(); 
  //       setShowModal(false);
  //     } else {
  //       console.error('Failed to delete user:', response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };
  const handleUpdate = async () => {
    const isEmailValid = validateEmail(userDetails.email);
    if (!isEmailValid) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please enter a valid email address.');
      return;
    }

    // Validate phone number
    const isPhoneValid = validatePhone(userDetails.phone);
    if (!isPhoneValid) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    try {
      const response = await axios.post(URLupdate, {
        license_holderid: userDetails.license_holderid,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        user_name: userDetails.user_name,
        password: userDetails.password,
      });

  setMessage(response.data.message);

  if (response.data.Valid) {
    setMessageType('success');
    setShowMessage(true);
    // fetchUserList();
    // setShowModal(false);
  } else {
    setMessageType('error');
    setShowMessage(true);
    console.log('Error message:', response.data.message);
  }
} catch (error) {
  console.error('Error updating user information:', error);
}
};


  const handleDelete = async (id) => {
    try {
      const response = await axios.post('http://localhost:3000/api/vendor/DeleteUser', { id });
      setMessage(response.data.message);
      if (response.data.Valid) {
        console.log('User deleted successfully');
        setMessageType('success');
        setShowMessage(true);
        
        // setShowModal(false);
        // fetchUserList(); 
      } else {
        console.error('Failed to delete user:', response.data.message);
        setMessageType('error');
        setShowMessage(true);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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
                  <h4>Vendor List</h4>
                </div>
                <div className="col-md-6 text-end">
                  <button  className="btn btn-outline-success" style={{ marginRight: '10px' }}>
                    Upload Excel
                  </button> 
                  <button onClick={handleDeleteUsers} className="btn btn-outline-danger">
  Delete Selected
</button>
                 
                </div>
              </div>
            </div>
            <div className="card-body pack-short-info">
              <div className="row">
                <div className="col-12 col-md-2 mb-3">
                  <label className="title">Vendor ID <span className="text-danger">*</span></label>
                  <div>
                    <input
                      onChange={(e) => setId(e.target.value)}
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name="id"
                      required
                      id="txtVendorID"
                      placeholder="Enter Vendor ID"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-3 mb-3">
                  <label className="title">Vendor Name<span className="text-danger">*</span></label>
                  <div>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name="name"
                      required
                      id="txtVendorName"
                      placeholder="Enter VendorName"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <label className="title">Email<span className="text-danger">*</span></label>
                  <div>
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name="email"
                      required
                      id="txtEmail"
                      placeholder="Enter Email ID"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <label className="title">Phone No<span className="text-danger">*</span></label>
                  <div>
                    <input
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name="phone"
                      required
                      id="txtPhone"
                      placeholder="Enter Phone"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <label className="title">UserName<span className="text-danger">*</span></label>
                  <div>
                    <input
                      onChange={(e) => setUserName(e.target.value)}
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name="username"
                      required
                      id="txtUserName"
                      placeholder="Enter User Name"
                    />
                  </div>
                </div>
               
                <div className="col-12 col-md-6">
                  <button
                    onClick={handleSearch}
                    className="btn btn-outline-success"
                  >
                    Search
                  </button>
                </div>
                
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        className="table table-bordered"
                        id="tbUser"
                        width="100%"
                        cellspacing="0"
                      >
                        <thead>
                          <tr>
                          <th>
      <input type="checkbox" onChange={handleSelectAllToggle} checked={selectAll} />
    </th>
            
                            <th>Sl.No</th>
                            <th>Vendor ID</th>
                            <th>Vendor Name</th>
                            <th>Email ID</th>
                            <th>Phone Number</th>
                            <th>User Name</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                           {userList.map((user, index) => (
                              index < 10 && 
            <tr key={index}>
               <td>
                         <input
                            type="checkbox"
                            onChange={() => handleCheckboxToggle(user)}
                            checked={selectedUsers.some(selectedUser => selectedUser.license_holderid === user.license_holderid)}
                          />
      </td>
              <td>{(currentPage - 1) * perPage + index + 1}</td>
             {/* <td>{index + 1}</td> */}
             <td>{user.license_holderid}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.user_name}</td>
              <td>
              <button onClick={() => handleEdit(user)}>Edit</button>
              </td>
            </tr>
          ))}
                        </tbody>
                        <div className="row">
 
</div>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>
            <span>{currentPage}</span>
            <button onClick={nextPage} disabled={userList.length < perPage}>
              Next
            </button>
          </div>
          </div>
        </div>
      </div>
       )}
      {showModal && userDetails && (
       <div className="modal fade show" tabIndex="-1" role="dialog" aria-hidden="true" style={{ display: 'block' }}>
         <div className="modal-dialog modal-dialog-centered modal-xl">

         <div className="modal-content" style={{ width: '100%', maxWidth: '100%', margin: 'auto' }}>
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
                        <label className="title">Vendor ID</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control only-positive-decimal"
                            name="UserID"
                            id="txtVendorIDEdit"
                            value={userDetails.license_holderid} 
                           readOnly
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-2 mb-3">
                        <label className="title">Vendor Name</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="VendorName"
                            id="txtVendorNameEdit"
                            value={userDetails.name} 
                            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                            placeholder="Enter Vendor Name"
                            
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 mb-3">
                        <label className="title">Email</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Email"
                            id="txtEmailEdit"
                            value={userDetails.email} 
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                            placeholder="Enter Email"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-2 mb-3">
                        <label className="title">Phone Number</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Phone"
                            id="txtPhoneEdit"
                            value={userDetails.phone} 
                            onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                            placeholder="Enter Phone Number"
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
                            name="UserName"
                            id="txtUserNameEdit"
                            value={userDetails.user_name} 
                            onChange={(e) => setUserDetails({ ...userDetails, user_name: e.target.value })}
                            placeholder="Enter User Name"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-2 mb-3">
                        <label className="title">Password</label>
                        <div>
                          <input
                            type="password"
                            autoComplete="off"
                            className="form-control"
                            name="Password"
                            id="txtPasswordEdit"
                            placeholder="Enter Password"
                            onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                            value={userDetails.password} 
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="modal-footer">
                <div className="row">
  <div className="col">
    <div className="d-flex justify-content-between">
      <button onClick={handleUpdate} className="btn btn-outline-success">
        Update
      </button>
      <button onClick={handleCancel} className="btn btn-outline-success">
        Cancel
      </button>
      <button onClick={() => handleDelete(userDetails.id)} className="btn btn-outline-success">
      Delete
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
        </div>
      )}
    </div>
  );
}
export default VendorCreation;

