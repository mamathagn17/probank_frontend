import React, { useState, useEffect } from 'react';
import axios from 'axios';
import URL from "../../URL";
import { useLocation } from 'react-router-dom';

import '../../Component/MessageBox/MessageBox.css';

function MonthlyReconciliationPending() {
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
  const [month, setMonth] = useState('');
  const [content, setContent] = useState('');
  const [client, setClient] = useState('');
  const [clients, setClients] = useState([]);
  const [year, setYear] = useState('');
 

  const perPage = 10;

  const URLAPIPendinglist = URL + "api/monthlyreconciliation/GetPendingList";
  const URLToUpdateField = URL + "api/monthlyreconciliation/UpdateField";
  const URLAPIfetchbranch = URL + "api/Licenserequest/fetchbranches";
  const URLAPIfetchclient = URL + "api/Licenserequest/fetchclients";
  const URLAPIMarkAsCompleted = URL + "api/monthlyreconciliation/MarkAsCompleted";
  const URLAPIStatusAction=URL + "api/monthlyreconciliation/LogMonthlyAction";
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };
  const handleBranchChange = (event) => {
    setBranch(event.target.value);
  };
  const handleClientChange = (event) => {
    setClient(event.target.value);
  };
  const markRecordsAsCompleted = async () => {
    try {
      const selectedIds = selectedRequest.map(request => request.client_id);
      if (selectedIds.length === 0) {
        alert("Please select at least one record.");
        return;
      }
  
      const response = await axios.post(URLAPIMarkAsCompleted, {
        clientIds: selectedIds // Pass an array of client IDs to mark as pending
      });
  
      if (response.data.Success) {
        handleMarkCompletedLogs();
        fetchMonthlyPendingList(); 
        setSelectedRequest([]); 
        setSelectAll(false); 
      } else {
        console.error('Failed to mark records as pending.');
      }
    } catch (error) {
      console.error('Error marking records as pending:', error);
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
  useEffect(() => {
    fetchBranches();
  }, []);
  useEffect(() => {
    fetchclients();
  }, []);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 2000; i--) {
      years.push(i.toString());
    }
    return years;
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

  const fetchMonthlyPendingList = async () => {
    try {
      const response = await axios.post(URLAPIPendinglist, {
        currentPage: currentPage,
        perPage: perPage,
        month: month,
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
      // Make the API call to update the field
      const response = await axios.post(URLToUpdateField, {
        requestId: requestId,
        fieldName: fieldName,
        updatedValue: updatedValue
      });

      // Check if the update was successful
      if (response.data.Success) {
        // If successful, fetch the updated request list
        fetchMonthlyPendingList();
      } else {
        // If not successful, handle the error
        console.error('Error updating field:', fieldName);
        // You can set an error state here if needed
      }
    } catch (error) {
      console.error('Error updating field:', fieldName, error);
      // Handle any errors that occurred during the update process
      // You can set an error state here if needed
    }
  };


  const handleMarkCompletedLogs = async () => {
   
    const selectedIds = selectedRequest.map(request => request.client_id);
     try {
         
         await axios.post(URLAPIStatusAction, {
           userInfo:userInfo,
           recIds: selectedIds,
           action: 'Completed'
         });
     } catch (error) {
         console.error('Error:', error);
     }
 };


  useEffect(() => {
    fetchMonthlyPendingList();
  }, [currentPage, month,branch,client,year]); // Dependencies array without editable

    return (
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-12 col-sm-12">
            <div className="card card-theme theme">
              <div className="card-header">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h4>Monthly Reconciliation-PendingList</h4>
                  </div>
                </div>
              </div>
              <form>
                <div className="card-body pack-short-info">
                  <div className="row">
                    <div className="col-md-6" style={{ width: '180px', marginLeft: '10px' }}>
                      <label htmlFor="month"  >Month:</label>
                      <select
                        id="month"
                        className="form-select"
                        value={month}
                        onChange={handleMonthChange}
                      >
                        <option value="">Select Month</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = new Date(null, i + 1, null);
                          return (
                            <option key={i} value={month.toLocaleString('default', { month: 'long' })}>
                              {month.toLocaleString('default', { month: 'long' })}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-md-6" style={{ width: '180px', marginLeft: '10px' }}>
                    <label htmlFor="branch">Branch:</label>
                    <select
                      id="branch"
                      className="form-select"
                      value={branch}
                      onChange={handleBranchChange}
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch.branch_id} value={branch.branch_id}>
                          {branch.branch_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6" style={{ width: '220px', marginLeft: '10px' }}>
                  <label htmlFor='client'>Client Name:</label>
    <select
      value={client}
      onChange={handleClientChange}
      className="form-select"
    
    >
      <option value="">Select Client Name</option>
      {clients.map(client => (
        <option key={client.client_id} value={client.client_id}>
          {client.client_name}
        </option>
      ))}
    </select>
                  </div>
                  <div className="col-md-3">
    <label htmlFor="year" style={{marginLeft:'10px'}}>Year:</label>
    <select
      id="year"
      className="form-select"
      value={year}
      onChange={handleYearChange}
       style={{ width: '50%',marginLeft:'10px' }}
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
                                <label htmlFor="checkall" className="form-label"></label>
                                <input type="checkbox" onChange={handleSelectAllToggle} checked={selectAll} />
                              </th>
                              <th>slno</th>
                              <th>Client Name</th>
                              <th>Branch Name</th>
                              <th>License Name</th>
                              <th>Pending Status</th>
                              <th>Warning Status</th>
                              <th>Year</th>
                              <th>Month</th>
                              <th>Amount</th>
                              <th>Remarks</th>
                              <th>Completed Status</th>
                              <th>Trigger Termination</th>
                              <th>Number of Payments</th>
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
                                    return null; // Handle unknown status values if necessary
                                }
                              })()}</td>
                                <td>{request.warning_status}</td>
                                <td>{request.year}</td>
                                <td>{request.month}</td>
                                <td>
                                  <input
                                    type="text"
                                    value={request.amount}
                                    onChange={(e) => handleFieldUpdate('amount', request.client_id, e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={request.remarks}
                                    onChange={(e) => handleFieldUpdate('remarks', request.client_id, e.target.value)}
                                  />
                                </td>
                                <td>{request.completed_status}</td>
                                <td>{request.trigger_terminationstatus}</td>
                                <td>{request.numberofpayments}</td>
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
                <button className="btn btn-outline-success" style={{ width: '180px', marginLeft: '10px' }} onClick={markRecordsAsCompleted}>
                  Mark Completed
                </button>
                <button className="btn btn-outline-danger" style={{ width: '180px', marginLeft: '10px' }}>
                  Trigger Termination
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default MonthlyReconciliationPending;