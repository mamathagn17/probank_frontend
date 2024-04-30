import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import URL from "../../URL";

function HolderCreationLogs() {
  const [holderList, setHolderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const URLAPIHolderLogs = URL + "api/addvendor/addvendorlogs";
  const navigate = useNavigate();

  useEffect(() => {
    fetchHolderLogsList();
  }, [currentPage]);

  const fetchHolderLogsList = async () => {
    try {
      const response = await axios.post(URLAPIHolderLogs, {
        currentPage: currentPage,
        perPage: perPage
      });

      if (response.data.Valid) {
        const { ResultSet, TotalCount } = response.data;
        setHolderList(ResultSet);
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

  return (
    <div className="container" data-aos="fade-up">
     
      <div className="row">
        <div className="col-12 col-sm-12">
          <div className="card card-theme theme">
            <div className="card-header">
              <div className="row">
                <div className="col-12 col-md-6">
                  <h4>Holder Creation  Logs</h4>
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
                            <th>Actioned By</th>
                            <th>Holder ID</th>
                            <th>Holder Name</th>
                            <th> Datetime</th>
                            
                           
                          </tr>
                        </thead>
                        <tbody>
                          {holderList.map((user, index) => (
                            <tr key={index}>
                              
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>{user.user_id}</td>
                              <td>{user.user_name}</td>
                              <td>{user.license_holderid}</td>
                              <td>{user.name}</td>
                              <td>{formatDate(user.date_time)}</td>
                             
                              
                             
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

export default HolderCreationLogs;