import React, { useState,useEffect } from 'react';
import axios from 'axios';
import URL from "../../URL";
import PopUp from '../../Component/PopUp/PopUp';
import '../../Component/MessageBox/MessageBox.css';
import '../../Component/PopUp/PopUp';
import { useLocation } from 'react-router-dom';


function LicenseRequestPage() {
  
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
  console.log('userInfo in LicenseRequestPage:', userInfo);
  const [category, setCategory] = useState('');
  const [client, setClient] = useState('');
  const [clients, setClients] = useState([]);

  const [branch, setBranch] = useState('');
  const [filename, setFileName] = useState('');
  const [uuid, setUUID] = useState('');
  const [invoice, setInvoice] = useState('');
  const [utr, setUTR] = useState('');
  //const [activationdate, setActivationDate] = useState('');
  const [modules,setModules]=useState([]);
 const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [content, setContent] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [branches, setBranches] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [filteredRequestList, setFilteredRequestList] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const URLAPIlicenselist = URL + "api/Licenserequest/GetLicenseRequestList";
  const URLAPIfetchbranch = URL + "api/Licenserequest/fetchbranches";
  const URLAPIfetchclient = URL + "api/Licenserequest/fetchclients";
  const URLApIgetModules= URL+"api/Licenserequest/getmodules";
  const URLAPIMarkAsApprove = URL + "api/Licenserequest/MarkAsApprove";
  const URLAPIMarkAsReject = URL + "api/Licenserequest/MarkAsReject";
  const URLAPIMarkpendingRenewal=URL + "api/Licenserequest/MarkAsPendingRenewal";
  const URLAPIRequestAction=URL + "api/Licenserequest/LogLicenseRequestAction";
  const [showModuleModal, setShowModuleModal] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  
  
  const toggleModuleModal = () => {
    setShowModuleModal(!showModuleModal);
  };
  useEffect(() => {
    fetchbranches();
}, []);

useEffect(() => {
  fetchclients();
}, []);

const handleSearch = (event) => {
  event.preventDefault();
  setCurrentPage(1);
  fetchLicenseRequestList();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Returns date in the local time zone format
};

const markRecordsAsApprove = async () => {
  try {
    const selectedIds = selectedRequest.map(request => request.recid);
    if (selectedIds.length === 0) {
      alert("Please select at least one record.");
      return;
    }

    const response = await axios.post(URLAPIMarkAsApprove, {
      recIds: selectedIds 
    });

    if (response.data.Success) {
      handleApprove();
      console.log('approved');
      fetchLicenseRequestList(); 
      setSelectedRequest([]); 
      setSelectAll(false); 

    } else {
      console.error('Failed to mark records as Approved List.');
    }
  } catch (error) {
    console.error('Error marking records as Approved List:', error);
  }
};
const markRecordsAsReject = async () => {
  try {
    const selectedIds = selectedRequest.map(request => request.recid);
    if (selectedIds.length === 0) {
      alert("Please select at least one record.");
      return;
    }

    const response = await axios.post(URLAPIMarkAsReject, {
      recIds: selectedIds 
    });
  
    if (response.data.Success) {
      handleReject();
      fetchLicenseRequestList(); 
      setSelectedRequest([]); 
      setSelectAll(false); 
    } else {
      console.error('Failed to mark records as Reject.');
    }
  } catch (error) {
    console.error('Error marking records as Reject:', error);
  }
};
const markPendingRenewal = async () => {
  try {
    const selectedIds = selectedRequest.map(request => request.recid);
    if (selectedIds.length === 0) {
      alert("Please select at least one record.");
      return;
    }

    const response = await axios.post(URLAPIMarkpendingRenewal, {
      recIds: selectedIds 
    });

    if (response.data.Success) {
     // handleApprove();
      fetchLicenseRequestList(); 
      setSelectedRequest([]); 
      setSelectAll(false); 

    } else {
      console.error('Failed to mark records as Pending Renewal.');
    }
  } catch (error) {
    console.error('Error marking records as Pending Renewal:', error);
  }
};
const getmodules = async () => {
  try {
    const selectedIds = selectedRequest.map(request => request.recid); 
    const response = await axios.get(URLApIgetModules, {
      params: {
        ids: selectedIds
      }
    });

    if (response.status === 200 && response.data.success) {
      setModules(response.data.modules);
    } else {
      setIsError(true);
      setMessage('Error occurred while fetching Modules.');
      console.error('Error:', response.data.message);
    }
  } catch (error) {
    setIsError(true);
    setMessage('Error occurred while fetching Modules.');
    console.error('Error:', error);
  }
};




const fetchbranches = async () => {
  try {
      const response = await axios.get(URLAPIfetchbranch);
      setBranches(response.data.branches);
  } catch (error) {
      setIsError(true);
      setContent('Error occurred while fetching Branches.');
      console.error('Error:', error);
  }
};
const fetchclients = async () => {
  try {
      const response = await axios.get(URLAPIfetchclient);
      setClients(response.data.clients);
  } catch (error) {
      setIsError(true);
      setContent('Error occurred while fetching Clients.');
      console.error('Error:', error);
  }
};

  
  
  const handleApprove = async () => {
   
   const selectedIds = selectedRequest.map(request => request.recid);
    try {
        // Log license request approval action
        await axios.post(URLAPIRequestAction, {
          userInfo:userInfo,
          recIds: selectedIds,
            action: 'Approved'
        });
        setShowRejectPopup(true);
    } catch (error) {
        console.error('Error:', error);
    }
};

const handleReject = async () => {
  const selectedIds = selectedRequest.map(request => request.recid);

    try {
        // Log license request rejection action
        await axios.post(URLAPIRequestAction, {
            userInfo:userInfo,
            recIds: selectedIds,
            action: 'Rejected'
        });
        setShowRejectPopup(true);
    } catch (error) {
        console.error('Error:', error);
    }
};


  const handleModule = () => {
    getmodules();
    console.log('Modules');
    toggleModuleModal();
  };
  const perPage = 10;
  useEffect(() => {
  
    fetchLicenseRequestList();
  }, [currentPage]); 

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedRequest([]);
    } else {
      setSelectedRequest(requestList);
    }
    setSelectAll(!selectAll);
  };
  const handleCheckboxToggle = (request) => {
    const isSelected = selectedRequest.some(selected => selected.recid === request.recid);
  
    if (isSelected) {
      setSelectedRequest(selectedRequest.filter(selected => selected.recid!== request.recid));
    } else {
      setSelectedRequest([...selectedRequest, request]);
    }
  };
  
  const handleSelectUser = (userId) => {
    
    const index = selectedUserIds.indexOf(userId);
    if (index === -1) {
     
      setSelectedUserIds([...selectedUserIds, userId]);
    } else {
      
      const updatedSelectedUserIds = selectedUserIds.filter(recid=> recid !== userId);
      setSelectedUserIds(updatedSelectedUserIds);
    }
  };
  
  
  
  

  
  
  
  const fetchLicenseRequestList = async () => {
    try {
      const response = await axios.post(URLAPIlicenselist, {
        currentPage: currentPage,
        perPage: perPage,
        branchname: branch, 
        clientname:client,
        filename:filename,
        uuid:uuid,
        invoicenumber:invoice,
        utr_number:utr,
        //activationdate:activationdate,
        searchQuery: searchQuery,
        fromDate: fromDate,
        toDate: toDate,
        status:status
      
      });
  
     
      if (response.data[0].Valid) {
      
        const startIndex = (currentPage - 1) * perPage;
        const usersForCurrentPage = response.data[0].ResultSet.slice(startIndex, startIndex + perPage);
        setRequestList(usersForCurrentPage);
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
  return (
    <div className="container" data-aos="fade-up">
      <div className="row">
        <div className="col-12 col-sm-12">
          <div className="card card-theme theme">
            <div className="card-header">
              <div className="row">
                <div className="col-12 col-md-6">
                  <h4>New License Request</h4>
                </div>
              </div>
            </div>
            <form>
              <div className="card-body pack-short-info">
               
              </div>
              <div className="row">
  

  <div className="col-sm-4 mb-3" style={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
    <label className="form-label" style={{ marginLeft: '10px', marginRight: '10px' }}>Client Name:</label>
    <div style={{ flex: 1 }}>
      <select
        value={client}
        onChange={(e) => setClient(e.target.value)}
        className="form-select"
        style={{ width: '80%', marginLeft: '10px' }}
      >
        <option value="">Select Client Name</option>
        {clients.map(client => (
          <option key={client.client_name} value={client.client_name}>
            {client.client_name}
          </option>
        ))}
      </select>
    </div>
    <div className="dropdown-arrow"></div>
  </div>

  <div className="col-sm-4 mb-3" style={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
    <label className="form-label" style={{ marginLeft: '-50px', marginRight: '10px' }}>Branch Name:</label>
    <div style={{ flex: 1 }}>
      <select
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        className="form-select"
        style={{ width: '80%', marginLeft: '10px' }}
      >
        <option value="">Select Branch Name</option>
        {branches.map(branch => (
          <option key={branch.branch_name} value={branch.branch_name}>
            {branch.branch_name}
          </option>
        ))}
      </select>
    </div>
    <div className="dropdown-arrow"></div>
  </div>
  <div className="col-sm-4 mb-3" style={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
    <label className="form-label" style={{ marginLeft: '-50px', marginRight: '10px' }}>Status:</label>
    <div style={{ flex: 1 }}>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="form-select"
        style={{ width: '50%', marginLeft: '10px' }}
      >
        <option value="">Select Status</option>
        <option value="1">Approved</option>
        <option value="2">Pending</option>
        <option value="3">Rejected</option>
      </select>
    </div>
    <div className="dropdown-arrow"></div>
  </div>
</div>


                

<div className="row">
<div className="col-12 col-md-4 mb-3">
                  <label className="title" style={{ marginLeft: '10px' }}>Activation Date(From)<span className="text-danger">*</span></label>
                  <div>
                    <input
                      onChange={(e) => setFromDate(e.target.value)}
                      type="date"
                      autoComplete="off"
                      className="form-control"
                      name="activationdatefrom"
                      required
                      id="txtActivationDateFrom"
                      style={{marginLeft:'10px'}}
                      placeholder="Enter ActivationDate"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <label className="title" style={{ marginLeft: '10px' }}>Activation Date(To)<span className="text-danger">*</span></label>
                  <div>
                    <input
                      onChange={(e) => setToDate(e.target.value)}
                      type="date"
                      autoComplete="off"
                      className="form-control"
                      name="activationdate"
                      required
                      id="txtActivationDate"
                      placeholder="Enter ActivationDate"
                      
                    />
                  </div>
                </div>
                <div className="row">
  <div className="col-12 col-md-6 mb-3">
    <label className="form-label" style={{ marginLeft: '10px' }}>Search:</label>
    <div className="input-group">
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        autoComplete="off"
        className="form-control"
        name="search"
        placeholder="Enter keywords to search..."
        style={{ marginLeft: '10px' }}
      />
      <button
        onClick={handleSearch}
        className="btn btn-outline-success"
        style={{ marginLeft: '10px' }}
      >
        Search
      </button>
    </div>
  </div>
</div>
</div>
                <div className="row">
  
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
                            <th>REQ.ID</th>
                            <th>Client Name</th>
                            <th>Branch Name</th>
                            <th>License Type Name</th>
                            <th>Activation Date</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Entry Date</th>
                            <th>File Name</th>
                            <th>UUID</th>
                            <th>File Generated Date</th>
                            {/* <th>User ID</th> */}
                            <th>Holder Name</th>
                            <th>invoice Number</th>
                            <th>UTR</th>
                            {/* <th>Client ID</th>
                            <th> Branch ID</th> */}
                            <th>Remarks</th>
                            <th>Product Name</th>
                            <th> Renewal Status</th>
                            
                          </tr>
                        </thead>
                        <tbody>
  {requestList.map((request, index) => (
    <tr key={index}>
      <td>
      <input
  type="checkbox"
  onChange={() => handleCheckboxToggle(request)}
  checked={selectedRequest.some(selected => selected.recid === request.recid)}
/>
      </td>
      <td>{(currentPage - 1) * perPage + index + 1}</td>
      <td>{request.recid}</td>
      <td>{request.clientname}</td>
      <td>{request.branchname}</td>
      <td>{request.license_name}</td>
      <td>{formatDate(request.activationdate)}</td>
      <td>{formatDate(request.expirydate)}</td>
      <td> {(() => {
    switch (request.status) {
      case 1:
        return <span style={{ color: 'blue' }}>Pending</span>;
      case 0:
        return <span style={{ color: 'green' }}>Approved</span>;
      case 2:
        return <span style={{ color: 'red' }}>Rejected</span>;
      default:
        return null; // Handle unknown status values if necessary
    }
  })()}</td>
      <td>{formatDate(request.entrydate)}</td>
      <td>{request.filename}</td>
      <td>{request.uuid}</td>

      <td>{formatDate(request.filegenerateddate)}</td>
      {/* <td>{request.userid}</td> */}
      <td>{request.name}</td>
      <td>{request.invoicenumber}</td>
      <td>{request.utr_number}</td>
      {/* <td>{request.client_id}</td>
      <td>{request.branch_id}</td> */}
      <td>{request.remarks}</td>
      <td>{request.product_name}</td>
    <td> {(() => {
    switch (request.renewal_status) {
      case 1:
        return <span style={{ color: 'blue' }}>Pending</span>;
      case 0:
        return <span style={{ color: 'green' }} >Approved</span>;
      case 2:
        return <span style={{ color: 'red' }}>Rejected</span>;
      default:
        return null; 
    }
  })()}</td>
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
            </form>
            <div className="row mt-3">
              <div className="col-md-12">
              <button onClick={markRecordsAsApprove} className="btn btn-outline-success" style={{ marginLeft: '10px' , marginRight:'10px'}}  >
                Approve
                 </button>
                <button onClick={markRecordsAsReject} className="btn btn-outline-danger"  style={{ marginRight: '10px' }}>
                  Reject
                </button>
                <button onClick={markPendingRenewal} className="btn btn-outline-danger"  style={{ marginRight: '10px' }}>
                 Mark Renewal Status As Pending
                </button>
                <button onClick={handleModule} className="btn btn-outline-success">
                  Get Modules
                </button> 
                <PopUp
        showModal={showModuleModal}
        toggleModal={toggleModuleModal}
        modules={modules} 
         />
              </div>
            </div>
            {isError && <p>{content}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LicenseRequestPage;