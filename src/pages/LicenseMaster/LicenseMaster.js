import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";

function LicenseMaster() {
    const [client, setClient] = useState('');
    const [licenseName, setLicenseName] = useState('');
    const [products, setProducts] = useState([]);
    const [licenseDescription, setLicenseDescription] = useState('');
    const [licenseCost, setLicenseCost] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [requestList, setRequestList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Define currentPage state
    const [perPage, setPerPage] = useState(10); // Define perPage state
    const URLfetchproducts = URL + "api/licensemaster/fetchproducts";
    const URLaddlicensetype = URL + "api/licensemaster/addlicensetype";
    const URLAPIGetLicense = URL+"api/licensemaster/fetchlicense";

    useEffect(() => {
        fetchLicenseList();
      }, [currentPage, perPage]);
    
      const fetchLicenseList = async () => {
        
        try {
          const response = await axios.post(URLAPIGetLicense, {
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

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(URLfetchproducts);
            setProducts(response.data.products);
        } catch (error) {
            setIsError(true);
            setMessage('Error occurred while fetching products.');
            console.error('Error:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post( URLaddlicensetype , {
                license_name: licenseName,
                product_id: client,
                license_description: licenseDescription,
                license_cost: licenseCost
            });

            if (response.data.Valid) {
                setShowMessage(true);
                setMessage('License type added successfully.');
                setMessageType('success');
                clearForm();
            } else {
                setShowMessage(true);
                setIsError(true);
                setMessage(response.data.message);
            }
        } catch (error) {
            setIsError(true);
            setMessage('Error occurred while adding license type.');
            console.error('Error:', error);
        }
    };

    const clearForm = () => {
        setLicenseName('');
        setClient('');
        setLicenseDescription('');
        setLicenseCost('');
    };

    const clearMessage = () => {
        setMessage('');
        setMessageType('');
        setShowMessage(false);
    };

    return (
        <div className="container" data-aos="fade-up">
            <div className="row">
                <div className="col-12 col-sm-12">
                    <div className="card card-theme theme">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <h4>License Type Master</h4>
                                </div>
                            </div>
                        </div>
                        <form>
                            <div className="card-body pack-short-info">
                                <div className="row">
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="txtLicenseName" className="form-label">License Name<span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            id="txtLicenseName"
                                            value={licenseName}
                                            onChange={(e) => setLicenseName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label className="form-label">Products:</label>
                                        <select
    value={client}
    onChange={(e) => setClient(e.target.value)}
    className="form-select"
>
    <option value="">Select a product</option> {/* Add a default option */}
    {products.map(product => (
        <option key={product.product_id} value={product.product_id}>
            {product.product_name}
        </option>
    ))}
</select>
                                    </div>
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="txtLicenseDescription" className="form-label">License Description<span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            id="txtLicenseDescription"
                                            value={licenseDescription}
                                            onChange={(e) => setLicenseDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="txtLicenseCost" className="form-label">License Cost<span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            id="txtLicenseCost"
                                            value={licenseCost}
                                            onChange={(e) => setLicenseCost(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-success"
                                            onClick={handleSubmit}
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
                        cellSpacing="0"
                      >
                        <thead>
                          <tr>
                            <th>slno</th>
                            <th>License ID</th>
                            <th>License Name</th>
                            <th>Product Name</th>
                            <th>License Cost</th>
                            <th>License Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requestList.map((request, index) => (
                            <tr key={index}>
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>{request.license_typeid}</td>
                              <td>{request.license_name}</td>
                              <td>{request.product_name}</td>
                              <td>{request.license_cost}</td>
                              <td>{request.license_description}</td>
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
            </div>
        </div>
    );
}

export default LicenseMaster;