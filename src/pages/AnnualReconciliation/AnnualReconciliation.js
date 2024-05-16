import React, { useState, useEffect } from 'react';
import axios from 'axios';
import URL from "../../URL";
import { useLocation } from 'react-router-dom';
import '../../Component/MessageBox/MessageBox.css';

function AnnualReconciliation() {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
  const [isError, setIsError] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [branch, setBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [client, setClient] = useState('');
  const [clients, setClients] = useState([]);
  const [year, setYear] = useState('');
  const [content, setContent] = useState('');
  const perPage = 10;
  const URLAPIfetchclient = URL + "api/Licenserequest/fetchclients";
  const URLToUpdateField = URL + "api/annualreconciliation/UpdateField";
  const URLAPIfetchbranch = URL + "api/Licenserequest/fetchbranches";
  const URLAPIAnnuallist = URL + "api/annualreconciliation/AnnualList";
  const URLAPIMarkAsPending = URL + "api/annualreconciliation/MarkAsPending";
  const URLAPIStatusAction=URL + "api/annualreconciliation/LogAnnualAction";
  
  const handleBranchChange = (event) => {
    setBranch(event.target.value);
  };
  const handleClientChange = (event) => {
    setClient(event.target.value);
  };

  const fetchBranches = async () => {
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
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const markRecordsAsPending = async () => {
    try {
      const selectedIds = selectedRequest.map(request => request.client_id);
      if (selectedIds.length === 0) {
        alert("Please select at least one record.");
        return;
      }
  
      const response = await axios.post(URLAPIMarkAsPending, {
        clientIds: selectedIds // Pass an array of client IDs to mark as pending
      });
  
      if (response.data.Success) {
        handleMarkPendingLogs();
        fetchAnnualReconciliation(); 
        setSelectedRequest([]); 
        setSelectAll(false); 
      } else {
        console.error('Failed to mark records as pending.');
      }
    } catch (error) {
      console.error('Error marking records as pending:', error);
    }
  };
  
  
  useEffect(() => {
    fetchBranches();
    fetchclients();
  }, []);

  const handleClearSelection = () => {
    setSelectedRequest([]);
    setSelectAll(false); 
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleAmountChange = async (index, value) => {
    const updatedRequestList = [...requestList];
    updatedRequestList[index].amount = value;
    setRequestList(updatedRequestList);
  
  
   
    try {
      await handleFieldUpdate('amount', updatedRequestList[index].client_id, value);
    } catch (error) {
      console.error('Error updating amount:', error);
     
    }
  };
  const handleRemarksChange = async (index, value) => {
    const updatedRequestList = [...requestList];
    updatedRequestList[index].remarks = value;
    setRequestList(updatedRequestList);
  
   
    try {
      await handleFieldUpdate('remarks', updatedRequestList[index].client_id, value);
    } catch (error) {
      console.error('Error updating remarks:', error);
      
    }
  };

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedRequest([]);
    } else {
      setSelectedRequest([...requestList]);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxToggle = (request) => {
    const isSelected = selectedRequest.some(selected => selected.client_id === request.client_id);
  
    if (isSelected) {
      setSelectedRequest(selectedRequest.filter(selected => selected.client_id !== request.client_id));
    } else {
      setSelectedRequest([...selectedRequest, request]);
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 2000; i--) {
      years.push(i.toString());
    }
    return years;
  };
  
  const fetchAnnualReconciliation = async () => {
    try {
      const response = await axios.post(URLAPIAnnuallist, {
        currentPage: currentPage,
        perPage: perPage,
        branch_id: branch,
        client_id:client,
        year:year
      });

      if (response.data.Valid) {
        const { ResultSet, TotalCount } = response.data;
        setRequestList(ResultSet);
        const totalPages = Math.ceil(TotalCount / perPage);
        setTotalPages(totalPages);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
    }
  };

  const handleFieldUpdate = async (fieldName, requestId, updatedValue) => {
    try {
      
      const response = await axios.post(URLToUpdateField, {
        requestId: requestId,
        fieldName: fieldName,
        updatedValue: updatedValue
      });

   
      if (response.data.Success) {
       
        fetchAnnualReconciliation();
      } else {
       
        console.error('Error updating field:', fieldName);
       
      }
    } catch (error) {
      console.error('Error updating field:', fieldName, error);
      
    }
  };
  const handleMarkPendingLogs = async () => {
   
    const selectedIds = selectedRequest.map(request => request.client_id);
     try {
         // Log license request approval action
         await axios.post(URLAPIStatusAction, {
           userInfo:userInfo,
           recIds: selectedIds,
           action: 'Pending'
         });
     } catch (error) {
         console.error('Error:', error);
     }
 };


  useEffect(() => {
    fetchAnnualReconciliation();
  }, [currentPage,branch,client,year]); 

    return (
      <div className="container" data-aos="fade-up">
        <div className="row">
        <div className="col-12 col-sm-12">
          <div className="card card-theme theme">
            <div className="card-header">
              <div className="row">
                <div className="col-12 col-md-6">
                  <h4>Annual Reconciliation</h4>
                </div>
              </div>
            </div>
            <form>
              <div className="card-body pack-short-info">
              <div className="row">
  
  <div className="col-md-3">
    <label htmlFor="branch" style={{marginLeft:'10px'}}>Branch Name:</label>
    <select
      id="branch"
      className="form-select"
      value={branch}
      onChange={handleBranchChange}
      style={{ width: '50%',marginLeft:'10px' }}
    >
      <option value="">Select Branch</option>
      {branches.map(branch => (
        <option key={branch.branch_id} value={branch.branch_id}>
          {branch.branch_name}
        </option>
      ))}
    </select>
  </div>
  <div className="col-md-3">
    <label htmlFor="client" style={{marginLeft:'-100px'}}>Client Name:</label>
    <select
      id="client"
      className="form-select"
      value={client}
      onChange={handleClientChange}
      style={{ width: '50%',marginLeft:'-100px' }}
    >
      <option value="">Select Client</option>
      {clients.map(client => (
        <option key={client.client_id} value={client.client_id}>
          {client.client_name}
        </option>
      ))}
    </select>
  </div>
  <div className="col-md-3">
    <label htmlFor="year" style={{marginLeft:'-200px'}}>Year:</label>
    <select
      id="year"
      className="form-select"
      value={year}
      onChange={handleYearChange}
       style={{ width: '50%',marginLeft:'-200px' }}
    >
      <option value="">Select Year</option>
      {generateYears().map((yearOption) => (
        <option key={yearOption} value={yearOption}>
          {yearOption}
        </option>
      ))}
    </select>
  </div>
</div>

              </div>
                <div className="row"></div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table
                          className="table table-bordered"
                          id="tbUser"
                          width="100%"
                          cellSpacing="0"
                        >
                          <thead>
                            <tr>
                              <th>
                                <label htmlFor="checkall" className="form-label">Pending</label>
                                <input type="checkbox" onChange={handleSelectAllToggle} checked={selectAll} />
                              </th>
                              <th>slno</th>
                              <th>Client Name</th>
                              <th>Branch Name</th>
                              <th>License Request ID</th>
                              <th>Pending Status</th>
                              <th>Warning Status</th>
                              <th>Year</th>
                              <th>Amount</th>
                              <th>Remarks</th>
                              <th>Completed Status</th>
                              <th>Trigger Termination</th>
                             
                              <th>Actioned By</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requestList.map((request, index) => (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxToggle(request)}
                                    checked={selectedRequest.some(selected => selected.client_id === request.client_id)}
                                  />
                                </td>
                                <td>{(currentPage - 1) * perPage + index + 1}</td>
                                <td>{request.client_name}</td>
                                <td>{request.branch_name}</td>
                                <td>{request.license_id}</td>
                                <td> {(() => {
                                switch (request.pending_status) {
                                  case 0:
                                    return <span style={{ color: 'orange' }}>Default</span>;
                                  case 1:
                                    return <span style={{ color: 'red' }}>Pending</span>;
                                  case 2:
                                    return <span style={{ color: 'green' }}>Completed</span>;
                                  default:
                                    return null; 
                                }
                              })()}</td>
                                <td>{request.warning_status}</td>
                                <td>{request.year}</td>
                               
                                  <td>
                                  <input
                                    type="text"
                                    value={request.amount}
                                    onChange={(e) => handleAmountChange(index, e.target.value)}
                                  />
                                </td>
                                <td>
                                <input
                                  type="text"
                                  value={request.remarks}
                                  onChange={(e) => handleRemarksChange(index, e.target.value)}
                                />
                              </td>

                                <td>{request.completed_status}</td>
                                <td>{request.trigger_terminationstatus}</td>
                               
                                <td>{request.user_name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              {isError && <p>Error occurred while fetching data.</p>}
              <div style={{ display: 'inline-block' }}>
                <button className="btn btn-outline-success" style={{ width: '150px', marginLeft: '10px' }} onClick={markRecordsAsPending}>
                  Mark as Pending
                </button>
                <button className="btn btn-outline-danger" style={{ width: '80px', marginLeft: '10px' }} onClick={handleClearSelection}>
                  Clear
                </button>
                <div className="pagination" style={{ marginTop: '10px' }}>
      <button type="button" onClick={prevPage} disabled={currentPage === 1}>
  Prev
</button>

            <span>{currentPage}</span>
            <button type="button" onClick={nextPage} disabled={requestList.length < perPage}>
  Next
</button>

          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AnnualReconciliation;
