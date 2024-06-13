import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import URL from "../../URL";

function NewLicenseRequestLogs() {
  const [requestList, setRequestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const URLAPIRequestLogs = URL + "api/Licenserequest/licenserequestloginlogs";
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestLogsList();
  }, [currentPage]);

  const fetchRequestLogsList = async () => {
    try {
      const response = await axios.post(URLAPIRequestLogs, {
        currentPage: currentPage,
        perPage: perPage
      });

      if (response.data.Valid) {
        const { ResultSet, TotalCount } = response.data;
        setRequestList(ResultSet);
        setTotalPages(Math.ceil(TotalCount / perPage));
      } else {
        handleRequestError('Error occurred while fetching data.');
      }
    } catch (error) {
      handleRequestError('Error occurred while fetching data.');
    }
  };
  const formatDate = (datetimeString) => {
    if (!datetimeString) return '';
    
    const dateTimeParts = datetimeString.split('T');
    const dateParts = dateTimeParts[0].split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const time = dateTimeParts[1].split('.')[0]; 
    return `${formattedDate} ${time}`; 
  }
  

  const handleRequestError = (errorMessage) => {
    console.error(errorMessage);
    setMessage(errorMessage);
    setMessageType('error');
    setShowMessage(true);
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };


  const handleDownload = async () => {
    try {
      const response = await axios.get(URL + 'api/Licenserequest/downloadLicenseRequestLogs', {
        responseType: 'blob', 
      });

      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'LicenseRequest_logs.csv');
      document.body.appendChild(link);
      link.click();

  
      document.body.removeChild(link);
    } catch (error) {
      handleRequestError('Error occurred while downloading LicenseRequest logs.');
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
                  <h4>New License Request Logs</h4>
                </div>
                <div className="col-md-6 text-end">
                  <button  className="btn btn-outline-success" style={{ marginRight: '10px' }} onClick={handleDownload}>
                    Download
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
                           
                            <th>Sl.No</th>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>Request ID</th>
                            <th> Datetime</th>
                            <th>Action</th>
                        
                           
                          </tr>
                        </thead>
                        <tbody>
                          {requestList.map((user, index) => (
                            <tr key={index}>
                              
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>{user.user_id}</td>
                              <td>{user.user_name}</td>
                              <td>{user.recid}</td>
                              <td>{formatDate(user.request_datetime)}</td>
                              <td>{user.action}</td>
                              
                             
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
     
     
      
    </div>
  );
}

export default NewLicenseRequestLogs;