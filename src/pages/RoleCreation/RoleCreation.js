import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";

function RoleCreation() {
  const [role_id, setid] = useState('');
  const [role_name, setRole] = useState('');
  
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  const [roleList, setRoleList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const URLfetchrole = URL + "api/rolecreation/fetchRoleList";
  const URLaddrole = URL + "api/rolecreation/addrole";

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
    setRole('');
  };

  useEffect(() => {
    fetchRoleList();
  }, [currentPage, perPage]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);

    try {
      const response = await axios.post(URLaddrole, {
        role_name: role_name
      });

      if (response.data.Valid) {
        setShowMessage(true);
        setMessage('Role Saved Successfully.');
        setMessageType('success');
        fetchRoleList();
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

  const fetchRoleList = async () => {
    try {
      const response = await axios.post(URLfetchrole, {
        role_id: role_id,
        role_name: role_name
      });

      if (response.data[0].Valid) {
        const startIndex = (currentPage - 1) * perPage;
        const roleForCurrentPage = response.data[0].ResultSet.slice(startIndex, startIndex + perPage);
        setRoleList(roleForCurrentPage);
        const totalrole = response.data[0].TotalCount;
        const totalPages = Math.ceil(totalrole / perPage);
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
        <div className="col-md-6 mx-auto">
          <h2 className="text-center mb-4">Role Creation</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card card-theme theme">
            <div className="card-header">
              <div className="row">
                <div className="col-6">
                  <h4>Role Creation</h4>
                </div>
                <div className="card-body">
                  <form id="role" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Role Name<span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => setRole(e.target.value)}
                        type="text"
                        value={role_name}  // Bind the value to role_name state
                        autoComplete="off"
                        className="form-control"
                        name="role_name"
                        required
                        id="txtRoleName"
                        placeholder="Enter Role Name"
                      />
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-outline-success" style={{ marginRight: '10px' }}>ADD</button>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-bordered" id="tbUser" width="100%" cellSpacing="0">
                              <thead>
                                <tr>
                                  <th scope="col">Role ID</th>
                                  <th scope="col">Role Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {roleList.map(role => (
                                  <tr key={role.role_id}>
                                    <td>{role.role_id}</td>
                                    <td>{role.role_name}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pagination">
                      <button type="button" onClick={prevPage} disabled={currentPage === 1}>
                        Prev
                      </button>
                      <span>{currentPage}</span>
                      <button type="button" onClick={nextPage} disabled={roleList.length < perPage}>
                        Next
                      </button>
                    </div>
                  </form>
                  {showMessage && (
                    <MessageBox
                      message={message}
                      type={messageType}
                      onClose={clearMessage}
                    />
                  )}
                  {isError && <p>{content}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleCreation;
