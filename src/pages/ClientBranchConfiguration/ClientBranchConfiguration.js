import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";

function ClientBranchConfiguration() {
  const [branch_name, setbranchname] = useState('');
  const [branch_code, setbranchcode] = useState('');
  const [client, setClient] = useState('');
  const [clients, setClients] = useState([]);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [requestList, setRequestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [branchList, setBranchList] = useState([]);
  const navigate = useNavigate();
  const perPage = 10;
  const URLAPIfetchclient = URL + "api/branch/fetchclient";
  const URLaddbranch = URL + "api/branch/addbranch";

  const URLAPIGetBranch =URL+ "api/branch/fetchbranch";

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchBranchList();
  }, [currentPage, perPage]);


  const nextPage = () => {
    if (requestList.length === perPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const fetchBranchList = async () => {
    try {
      const response = await axios.post(URLAPIGetBranch, {
        currentPage: currentPage,
        perPage: perPage,
      });

      if (response.data.Valid) {
        const { ResultSet } = response.data;
        setRequestList(ResultSet);
      } else {
        setIsError(true);
        setMessage('Error occurred while fetching branch data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setMessage('Error occurred while fetching branch data.');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(URLAPIfetchclient );
      setClients(response.data.clients);
    } catch (error) {
      setIsError(true);
      setMessage('Error occurred while fetching Branch.');
      console.error('Error:', error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);

    try {
      const response = await axios.post(URLaddbranch, {
        branch_name: branch_name,
        client_id: client,
        branch_code: branch_code
      });

      if (response.data.Valid) {
        setShowMessage(true);
        setMessage('Branch Saved Successfully..');
        setMessageType('success');
        fetchBranchList();
      } else {
        setShowMessage(true);
        setIsError(true);
        setMessage(response.data.message);
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card custom-card">
            <div className="card-header custom-card-header">
              <h4 className="text-center">Branch Configuration</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="txtBranchName" className="form-label">Branch Name<span className="text-danger">*</span></label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    name="branch_name"
                    value={branch_name}
                    onChange={(e) => setbranchname(e.target.value)}
                    required
                    id="txtBranchName"
                    placeholder="Enter Branch Name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clientSelect" className="form-label">Client ID<span className="text-danger">*</span></label>
                  <select
                    id="clientSelect"
                    className="form-select"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    required
                  >
                    <option value="">Select a client ID</option>
                    {clients.map(client => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.client_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="txtBranchName" className="form-label">Branch Code<span className="text-danger">*</span></label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    name="branch_name"
                    value={branch_code}
                    onChange={(e) => setbranchcode(e.target.value)}
                    required
                    id="txtBranchName"
                    placeholder="Enter Branch Code"
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-outline-primary">Save</button>
                </div>
              </form>
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
                            <th>slno</th>
                            <th>Branch ID</th>
                            <th>Branch Name</th>
                            <th>Client Name</th>
                            <th>Branch Code</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requestList.map((request, index) => (
                            <tr key={index}>
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>{request.branch_id}</td>
                              <td>{request.branch_name}</td>
                              <td>{request.client_name}</td>
                              <td>{request.branch_code}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>
            <span>{currentPage}</span>
            <button onClick={nextPage} >
              Next
            </button>
          </div>
                </div>
              </div>
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

export default ClientBranchConfiguration;