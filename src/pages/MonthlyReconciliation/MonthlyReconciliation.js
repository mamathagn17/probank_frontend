import React, { useState, useEffect } from 'react';
import axios from 'axios';
import URL from "../../URL";
import { useLocation } from 'react-router-dom';
import '../../Component/MessageBox/MessageBox.css';
import MessageBox from '../../Component/MessageBox/MessageBox';
function MonthlyReconciliation() {
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
  const [client, setClient] = useState('');
  const [clients, setClients] = useState([]);
  const [year, setYear] = useState('');
  const [years, setYears] = useState([]);
  const [content, setContent] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const perPage = 10;

  const URLAPIfetchclient = URL + "api/Licenserequest/fetchclients";
  const URLAPIMonthlylist = URL + "api/monthlyreconciliation/MonthlyList";
  const URLToUpdateField = URL + "api/monthlyreconciliation/UpdateField";
  const URLAPIfetchbranch = URL + "api/Licenserequest/fetchbranches";
  const URLAPIMarkAsPending = URL + "api/monthlyreconciliation/MarkAsPending";
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

  const handleCancelDelete = () => {
    setShowConfirmation(false); // Hide confirmation message box
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
  const markRecordsAsPending = async () => {
    // try {
    //   const selectedIds = selectedRequest.map(request => request.client_id);
    //   if (selectedIds.length === 0) {
    //     alert("Please select at least one record.");
    //     return;
    //   }
  
    //   const response = await axios.post(URLAPIMarkAsPending, {
    //     clientIds: selectedIds // Pass an array of client IDs to mark as pending
    //   });
  
    //   if (response.data.Success) {
    //     handleMarkPendingLogs();
    //     fetchMonthlyReconciliation(); // Refresh the list after updating
    //     setSelectedRequest([]); // Clear selected records
    //     setSelectAll(false); // Uncheck select all checkbox
    //   } else {
    //     console.error('Failed to mark records as pending.');
    //   }
    // } catch (error) {
    //   console.error('Error marking records as pending:', error);
    // }
    setShowConfirmation(true);
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
  
  useEffect(() => {
    fetchBranches();
    fetchclients();
  }, []);

  const handleClearSelection = () => {
    setSelectedRequest([]); // Clear all selected requests
    setSelectAll(false); // Uncheck the select all checkbox if it's checked
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleAmountChange = async (index, value) => {
    const updatedRequestList = requestList.map((request, idx) => {
      if (idx === index) {
        return { ...request, amount: value }; // Update the amount for the specific row
      }
      return request;
    });
    setRequestList([...updatedRequestList]); // Update the state with the new array
  
    // Call the API to update the "amount" field in the database
    try {
      await handleFieldUpdate(
        updatedRequestList[index].client_id,
        updatedRequestList[index].month,
        updatedRequestList[index].year,
        'amount',
        value
      );
    } catch (error) {
      console.error('Error updating amount:', error);
      // Handle error if needed
    }
  };
  
  const handleRemarksChange = async (index, value) => {
    const updatedRequestList = [...requestList];
    updatedRequestList[index].remarks = value;
    setRequestList(updatedRequestList);
  
    try {
      await handleFieldUpdate(
        updatedRequestList[index].client_id,
        updatedRequestList[index].month,
        updatedRequestList[index].year,
        'remarks',
        value
      );
    } catch (error) {
      console.error('Error updating remarks:', error);
      // Handle error if needed
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

 const handleConfirmPending= async () => {
  setShowConfirmation(false); // Hide confirmation message box
  try {
    const selectedIds = selectedRequest.map(request => request.client_id);
      if (selectedIds.length === 0) {
        alert("Please select at least one record.");
        return;
      }
  
      const response = await axios.post(URLAPIMarkAsPending, {
        requests: selectedRequest.map(({ client_id, month, year }) => ({
          client_id,
          month,
          year
      }))
      });
  
      if (response.data.Success) {
        handleMarkPendingLogs();
        fetchMonthlyReconciliation(); // Refresh the list after updating
        setSelectedRequest([]); // Clear selected records
        setSelectAll(false); // Uncheck select all checkbox
      } else {
        console.error('Failed to mark records as pending.');
      }
    } catch (error) {
      console.error('Error marking records as pending:', error);
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
    const isSelected = selectedRequest.some(
      selected => selected.client_id === request.client_id && 
                  selected.month === request.month && 
                  selected.year === request.year
    );
  
    if (isSelected) {
      setSelectedRequest(
        selectedRequest.filter(
          selected => !(selected.client_id === request.client_id && 
                        selected.month === request.month && 
                        selected.year === request.year)
        )
      );
    } else {
      setSelectedRequest([...selectedRequest, request]);
    }
    console.log('Selected Requests:', [...selectedRequest, request].map(req => ({
      client_id: req.client_id,
      month: req.month,
      year: req.year
    })));
  };
  
  
 
  
  
  
 

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 2000; i--) {
      years.push(i.toString());
    }
    return years;
  };
  
  const fetchMonthlyReconciliation = async () => {
    try {
      const response = await axios.post(URLAPIMonthlylist, {
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

  const handleFieldUpdate = async ( requestId,month,year,fieldName, updatedValue) => {
    try {
      // Make the API call to update the field
      const response = await axios.post(URLToUpdateField, {
        requestId: requestId,
        month:month,
        year:year,
        fieldName: fieldName,
        updatedValue: updatedValue
      });

   
      if (response.data.Success) {
       
        fetchMonthlyReconciliation();
      } else {
       
        console.error('Error updating field:', fieldName);
       
      }
    } catch (error) {
      console.error('Error updating field:', fieldName, error);
      
    }
  };

  useEffect(() => {
    fetchMonthlyReconciliation();
  }, [currentPage, month,branch,client,year]); // Dependencies array without editable

    return (
      <div className="container" data-aos="fade-up">
        <div className="row">
        <div className="col-12 col-sm-12">
          <div className="card card-theme theme">
            <div className="card-header">
              <div className="row">
                <div className="col-12 col-md-6">
                  <h4>Monthly Reconciliation</h4>
                </div>
              </div>
            </div>
            <form>
              <div className="card-body pack-short-info">
              <div className="row">
  <div className="col-md-3">
    <label htmlFor="month">Month:</label>
    <select
      id="month"
      className="form-select"
      value={month}
      onChange={handleMonthChange}
      style={{ width: '60%' }}
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
  <div className="col-md-3">
    <label htmlFor="branch" style={{marginLeft:'-100px'}}>Branch Name:</label>
    <select
      id="branch"
      className="form-select"
      value={branch}
      onChange={handleBranchChange}
      style={{ width: '60%',marginLeft:'-100px' }}
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
    <label htmlFor="client" style={{marginLeft:'-200px'}}>Client Name:</label>
    <select
      id="client"
      className="form-select"
      value={client}
      onChange={handleClientChange}
      style={{ width: '60%',marginLeft:'-200px' }}
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
    <label htmlFor="year" style={{marginLeft:'-300px'}}>Year:</label>
    <select
      id="year"
      className="form-select"
      value={year}
      onChange={handleYearChange}
       style={{ width: '60%',marginLeft:'-300px' }}
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
                                    checked={selectedRequest.some(
                                      selected => selected.client_id === request.client_id && 
                                                  selected.month === request.month && 
                                                  selected.year === request.year
                                    )}
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
                                <td> {(() => {
                                switch (request.warning_status) {
                                  case 0:
                                    return <span style={{ color: 'orange' }}>Default</span>;
                                  case 1:
                                    return <span style={{ color: 'red' }}>Warning</span>;
                                  case 2:
                                    return <span style={{ color: 'yellow' }}>inactive</span>;
                                  default:
                                    return null; // Handle unknown status values if necessary
                                }
                              })()}</td>
                                <td>{request.year}</td>
                                <td>{request.month}</td>
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

                              <td> {(() => {
                                switch (request.completed_status) {
                                  case 0:
                                    return <span style={{ color: 'orange' }}>Default</span>;
                                  case 1:
                                    return <span style={{ color: 'green' }}>Completed</span>;
                                  case 2:
                                    return <span style={{ color: 'red' }}>InComplete</span>;
                                  default:
                                    return null; // Handle unknown status values if necessary
                                }
                              })()}</td>
                                <td> {(() => {
                                switch (request.trigger_terminationstatus) {
                                  case 0:
                                    return <span style={{ color: 'orange' }}>Default</span>;
                                  case 1:
                                    return <span style={{ color: 'green' }}>Completed</span>;
                                  case 2:
                                    return <span style={{ color: 'red' }}>Terminated</span>;
                                  default:
                                    return null; // Handle unknown status values if necessary
                                }
                              })()}</td>
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
                <button className="btn btn-outline-success" style={{ width: '150px', marginLeft: '10px' }} onClick={markRecordsAsPending}>
                  Mark As Pending
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
          {showMessage && (
        <MessageBox
          message={message}
          type={messageType}
          onClose={clearMessage}
        />
      )}
       {showConfirmation && (
        <MessageBox
          message="Are you sure you want to Mark it as Pending?"
          type="confirmation"
          onClose={handleCancelDelete}
          onConfirm={handleConfirmPending}
          onCancel={handleCancelDelete}
        />
      )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default MonthlyReconciliation;