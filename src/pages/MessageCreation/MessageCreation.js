import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";
function MessageCreation() {
  const [message_name, setMsg] = useState("");
  const [message_type, setMessageType] = useState(''); // Default message type
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [requestList, setRequestList] = useState([]);
  const URLAPIGetmsg = URL + "api/message/GetMsgList";
  const URLAPImsg = URL + "api/message/Message";
  const clearMessage = () => {
    setMessage('');
    setShowMessage(false);
  };
  const perPage = 10;

  useEffect(() => {
    fetchmsgList();
  }, [currentPage]); 
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedRequest([]);
    } else {
      setSelectedRequest(requestList);
    }
    setSelectAll(!selectAll);
  };
  const handleCheckboxToggle = (request) => {
    const isSelected = selectedRequest.some(selectedRequest => selectedRequest.message_id === request.message_id);

    if (isSelected) {
      setSelectedRequest(selectedRequest.filter(selectedRequest => selectedRequest.message_id !== request.message_id));
    } else {
      setSelectedRequest([...selectedRequest, request]);
    }
  };
  const fetchmsgList = async () => {
    try {
      const response = await axios.post(URLAPIGetmsg, {
        currentPage: currentPage,
        perPage: perPage,
        message_name: message_name,
        message_type: message_type
      });
  
      if (response.data.Valid) {
        const { ResultSet, TotalCount } = response.data;
        setRequestList(ResultSet);
        setTotalPages(Math.ceil(TotalCount / perPage));
      } else {
        setIsError(true);
        setContent('Error occurred while fetching data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setContent('Error occurred while fetching data.');
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);

    try {
      const response = await axios.post( URLAPImsg, {
        message_name: message_name,
        message_type: message_type
      });

      if (response.data.Valid) {
        setShowMessage(true);
        setMessage('Message saved successfully');
        setMessageType('');
        setMsg('');
        fetchmsgList();
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
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="card-header">
              <div className="row">
                <div className="col-12 col-md-6">
                  <h4>Cloud License Message</h4>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="txtmsg" className="form-label">
                     Message<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={(e) => setMsg(e.target.value)}
                    type="text"
                    autoComplete="off"
                    value={message_name}
                    className="form-control"
                    id="txtmsg"
                    style={{ width: '100%' }} // Set width to 100%
                    placeholder="Enter Message"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="selectMessageType" className="form-label">
                     Message Type<span className="text-danger">*</span>
                  </label>
                  <select
                    value={message_type}
                    onChange={(e) => setMessageType(e.target.value)}
                    className="form-select"
                    id="selectMessageType"
                   
                    style={{ width: '100%' }} // Set width to 100%
                    required
                  >
                     <option value="">Select Message Type</option>
                    <option value="warning">Warning</option>
                    <option value="terminate">terminate</option>
                  </select>
                </div>
              </div>
              <div className="card-footer text-end">
                <button type="submit" className="btn btn-primary">ADD</button>
              </div>
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
                              <input type="checkbox" onChange={handleSelectAllToggle} checked={selectAll} />
                            </th>
                            <th>slno</th>
                            <th>Message.ID</th>
                            <th>Message Name</th>
                            <th>Message Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requestList.map((request, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  onChange={() => handleCheckboxToggle(request)}
                                  checked={selectedRequest.some(selectedRequest => selectedRequest.message_id === request.message_id)}
                                />
                              </td>
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>{request.message_id}</td>
                              <td>{request.message_name}</td>
                              <td>{request.message_type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {showMessage && (
              <MessageBox
                message={message}
                type={message_type}
                onClose={clearMessage}
              />
            )}
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
  );
} 

export default MessageCreation;
