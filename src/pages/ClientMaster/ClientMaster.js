import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";
function ClientCategory() {
    const [client, setClient] = useState('');
    const [id, setId] = useState('');
    const [client_name, setname] = useState('');
    const [email, setemail] = useState('');
    const [phone, setphone] = useState('');
    const [status, setStatus] = useState('');
    const [categories, setCategories] = useState([]);
    const [client_code,setClientCode]=useState('');
    const [category_id,setCategoryID]=useState('');
    const [isError, setIsError] = useState(false);
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [clientDetails, setClientDetails] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 10;
  const [selectAll, setSelectAll] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const URLgetclientlist = URL + "api/cliencategories/GetClientList";
  const URLfetchcategories = URL + "api/cliencategories/clientCategories";
  const URLaddclient = URL + "api/cliencategories/addclient";
  const URLClientdetails = URL + "api/cliencategories/getclientdetails";
  const URLclientupdate = URL + "api/cliencategories/clientupdate";
  const URLdeleteclients = URL + "api/cliencategories/clientdelete";
  const navigate = useNavigate();

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };


  
 useEffect(() => {
    // Fetch user list when component mounts
    fetchClientList();
  }, [currentPage]); 

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

  const handleUpdate = async () => {
    const isEmailValid = validateEmail(clientDetails.email);
    if (!isEmailValid) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please enter a valid email address.');
      return;
    }

    // Validate phone number
    const isPhoneValid = validatePhone(clientDetails.phone);
    if (!isPhoneValid) {
      setShowMessage(true);
      setIsError(true);
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    try {
      const response = await axios.post(URLclientupdate, {
        client_id: clientDetails.client_id,
        client_name: clientDetails.client_name,
        category_id: clientDetails.category_id,
        email:clientDetails.email,
        phone: clientDetails.phone,
        status: clientDetails.status,
        client_code: clientDetails.client_code,
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
  console.error('Error updating Client information:', error);
}
};

const handleDeleteUsers = async () => {
  try {
    const selectedIds = selectedUsers.map(user => user.client_id);
    const response = await axios.post(URLdeleteclients, {
      ids: selectedIds
    });

    if (response.data.Valid) {
      setMessage(response.data.message);

      setMessageType('success');
      setShowMessage(true);
      fetchClientList();
      
    } else {
      console.error('Failed to delete clients:', response.data.message);
    }
  } catch (error) {
    console.error('Error deleting clients:', error);
  }
};


  const validateemail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatephone = (phone) => {
    const phoneRegex = /^(9|8|7|6)[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };


  const handleEdit = (user) => {
    setSelectedClient(user);
    setShowModal(true);
    getClientDetails(user.client_id);
  };
  const getClientDetails = async (client_id) => {
    try {
      const response = await axios.post(URLClientdetails, { client_id });
      if (response.data.Valid) {
        const userData = response.data.data;
        setClientDetails(userData); 
        setShowModal(true); 
      } else {
        alert('client not found');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch Client details');
    }
  };
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchClientList = async () => {
        try {
          const response = await axios.post(URLgetclientlist, {
            client_id: id,
            client_name: client_name,
            category_id:category_id,
            email: email,
            phone: phone,
            status:status,
            currentPage: currentPage,
            perPage: perPage,
          });
    
          if (response.data[0].Valid) {
          
          const startIndex = (currentPage - 1) * perPage;
          const usersForCurrentPage = response.data[0].ResultSet.slice(startIndex, startIndex + perPage);
          setClientList(usersForCurrentPage);
          const totalClient= response.data[0].TotalCount;
          const totalPages = Math.ceil(totalClient / perPage);
          setTotalPages(totalPages);
          } else {
            setIsError(true);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const handleSelectAllToggle = () => {
        if (selectAll) {
          setSelectedUsers([]);
        } else {
          setSelectedUsers(clientList);
        }
        setSelectAll(!selectAll);

      };
      const handleCheckboxToggle = (user) => {
        const isSelected = selectedUsers.some(selectedUser => selectedUser.client_id === user.client_id);
    
        if (isSelected) {
          setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.client_id !== user.client_id));
        } else {
          setSelectedUsers([...selectedUsers, user]);
        }
      };
    const fetchCategories = async () => {
        try {
            const response = await axios.get(URLfetchcategories );
            setCategories(response.data.categories);
        } catch (error) {
            setIsError(true);
            setContent('Error occurred while fetching categories.');
            console.error('Error:', error);
        }
    };
    async function handlesubmit() {
        
        const isemailValid = validateemail(email);
        if (!isemailValid) {
          setShowMessage(true);
          setIsError(true);
          setMessage('Please enter a valid email address.');
          return;
        }
    
        // Validate phone number
        const isPhoneValid = validatephone(phone);
        if (!isPhoneValid) {
          setShowMessage(true);
          setIsError(true);
          setMessage('Please enter a valid 10-digit phone number.');
          return;
        }
    
        try {
          const response = await axios.post(URLaddclient, {
            client_name: client_name,
            category_id: client,
            email:email,
            phone: phone,
            status:status,
            client_code:client_code
           
          });
    
          if (response.data.Valid) {
           
            setShowMessage(true);
          setMessage('client added Successfully..');
          setMessageType('success');
          setContent('client added Successfully..');
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


      return (
        <div className="container" data-aos="fade-up">
           {!showModal && (
            <div className="row">
                <div className="col-12 col-sm-12">
                    <div className="card card-theme theme">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <h4>Client Configuration</h4>
                                </div>
                                <div className="col-md-6 text-end">
                                <button onClick={handleDeleteUsers} className="btn btn-outline-danger">
  Delete Selected
</button>
</div>
                            </div>
                        </div>
                        <form>
                            <div className="card-body pack-short-info">
                                <div className="row">
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="txtclinetnamee" className="form-label">Client Name<span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            name="name"
                                            id="txtname"
                                            placeholder="Enter username"
                                            value={client_name}
                                            
                                            onChange={(e) => setname(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label className="form-label">Category:</label>
                                        <select
                                            value={client}
                                            onChange={(e) => setClient(e.target.value)}
                                            className="form-select"
                                        >
                                             <option value="">Select Category Name</option>
                                            {categories.map(category => (
                                                <option key={category.category_id} value={category.category_id}>
                                                    {category.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="txtemail" className="form-label">Email<span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="email"
                                            autoComplete="off"
                                            className="form-control"
                                            name="email"
                                            id="txtemail"
                                            value={email}
                                            placeholder='Enter Email Id'
                                            onChange={(e) => setemail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="txtphone" className="form-label">Phone<span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            name="phone"
                                            id="txtphone"
                                            value={phone}
                                            placeholder='Enter Phone Number'
                                            onChange={(e) => setphone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="txtcode" className="form-label">Client Code<span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            name="code"
                                            id="txtcode"
                                            value={client_code}
                                            placeholder='Enter Client Code'
                                            onChange={(e) => setClientCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-success"
                                            onClick={handlesubmit}
                                        >
                                            ADD
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
                                                            <th>slno</th>
                                                            <th>Client ID</th>
                                                            <th>Client Name</th>
                                                            <th>Category Name</th>
                                                            <th>Email</th>
                                                            <th>Phone Number</th>
                                        
                                                            <th>Status</th>
                                                            <th>Client Code</th>
                                                           
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {clientList.map((user, index) => (
                              index < 10 && 
            <tr key={index}>
               <td>
                         <input
                            type="checkbox"
                            onChange={() => handleCheckboxToggle(user)}
                            checked={selectedUsers.some(selectedUser => selectedUser.client_id === user.client_id)}
                          />
      </td>
              <td>{(currentPage - 1) * perPage + index + 1}</td>
             {/* <td>{index + 1}</td> */}
             <td>{user.client_id}</td>
              <td>{user.client_name}</td>
              <td>{user.category_id}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.status}</td>
              <td>{user.client_code}</td>
              <td>
              <button onClick={() => handleEdit(user)}>Edit</button>
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
                        </form>
                        {showMessage && (
                            <MessageBox
                                message={message}
                                type={messageType}
                                onClose={clearMessage}
                            />
                        )}
                    </div>
                </div>
                <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>
            <span>{currentPage}</span>
            <button onClick={nextPage} disabled={clientList.length < perPage}>
              Next
            </button>
          </div>
            </div>
              )}
               {showModal && clientDetails && (
       <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-hidden="true">
       <div className="modal-dialog modal-dialog-centered modal-xl">
       <div className="modal-content" style={{ width: '100%', maxWidth: '100%', margin: 'auto' }}>
          <div className="modal-header">
                <h5 className="modal-title">Edit Client Information</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12 col-sm-10">
                    <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="title">Client ID</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control only-positive-decimal"
                            name="ClientID"
                            id="txtClientIDEdit"
                            value={clientDetails.client_id} 
                           readOnly
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="title">Client Name</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="ClientName"
                            id="txtClientNameEdit"
                            value={clientDetails.client_name} 
                            onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                            placeholder="Enter Client Name"
                            
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="title">Email</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Email"
                            id="txtEmailEdit"
                            value={clientDetails.email} 
                            onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                            placeholder="Enter Email"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="title">Phone Number</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Phone"
                            id="txtPhoneEdit"
                            value={clientDetails.phone}
                            onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                            placeholder="Enter Phone Number"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="title">Client code</label>
                        <div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="clientcode"
                            id="txtClientCodeEdit"
                            value={clientDetails.client_code} 
                            onChange={(e) => setClientDetails({ ...clientDetails,client_code: e.target.value })}
                            placeholder="Enter Client Code"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="title">Category ID</label>
                        <div>
                          <input
                            type="numeric"
                            autoComplete="off"
                            className="form-control"
                            name="catid"
                            id="txtCayegoryIDEdit"
                            placeholder="Enter Category ID"
                            onChange={(e) => setClientDetails({ ...clientDetails,category_id: e.target.value })}
                            value={clientDetails.category_id} 
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="title">status</label>
                        <div>
                          <input
                            type="numeric"
                            autoComplete="off"
                            className="form-control"
                            name="status"
                            id="txtstatusEdit"
                            placeholder="Enter status"
                            onChange={(e) => setClientDetails({ ...clientDetails, status: e.target.value })}
                            value={clientDetails.status} 
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
      <button onClick={handleUpdate} className="btn btn-outline-success mr-2">
        Update
      </button>
      <button onClick={handleCancel} className="btn btn-outline-success mr-2">
        Cancel
      </button>
      {/* <button onClick={() => handleDelete(clientDetails.id)} className="btn btn-outline-success">
      Delete
    </button> */}
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
export default ClientCategory;