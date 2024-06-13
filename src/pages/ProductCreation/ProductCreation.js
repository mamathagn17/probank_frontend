import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";
function ProductCreation() {
  
  const [product_name, setProduct] = useState('');
  const [product_id, setProductID] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [ProductList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const perPage=10;
  const URLProduct = URL + "api/productconfig/ProductConfig";
  const URLfetchproduct=URL+"api/productconfig/fetchProductList";
 
 

  useEffect(() => {
    // Fetch user list when component mounts
    fetchProductList();
  }, [currentPage]); 

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
    setProduct('');
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const fetchProductList = async () => {
    try {
      const response = await axios.post(URLfetchproduct, {
        product_id:product_id,
        product_name:product_name,
        status:status
      
      });

      if (response.data[0].Valid) {
      
      const startIndex = (currentPage - 1) * perPage;
      const productForCurrentPage = response.data[0].ResultSet.slice(startIndex, startIndex + perPage);
      setProductList(productForCurrentPage);
      const totalproducts= response.data[0].TotalCount;
      const totalPages = Math.ceil(totalproducts / perPage);
      setTotalPages(totalPages);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(false);
    
    

    try {
      const response = await axios.post(URLProduct, {
       product_name:product_name
      });

      if (response.data.Valid) 
      {  setShowMessage(true);
       
      setMessage('product added Successfully..');
      setMessageType('success');
      //navigate('/');
        } 
    else {
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
    <div className="container" data-aos="fade-up">

    
    <div className="row">
        <div className="col-md-6 mx-auto">
            <h2 className="text-center mb-4">Product Creation</h2>
        </div>
    </div>

    
    <div className="row">
        <div className="col-md-6 mx-auto">
            <div className="card card-theme theme">
                <div className="card-header">
                    <div className="row">
                    <div className="col-6">
              <h4>Product Creation</h4>
            </div>
            
          
                <div className="card-body">
                    <form id="clientcategory" onSubmit={handleSubmit}>
                        
                       
                        <div className="mb-3">
                            <label for="name" className="form-label">Product Name<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setProduct(e.target.value)}
                              type="text"
                              autoComplete="off"
                              className="form-control"
                              value={product_name}
                              name="product_name"
                              required
                              id="txtproductName"
                              placeholder="Enter product Name"
                            />
                        </div>
                        
                        
                        
                        <div className="text-center">
                        <button type="submit" className="btn btn-outline-success" style={{ marginRight: '10px' }}>ADD </button>
                       
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
                          
                <th scope="col">Product ID</th>
                <th scope="col">Product  Name</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {ProductList.map(product => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.status}</td>
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
            <button onClick={nextPage} disabled={ProductList.length < perPage}>
              Next
            </button>
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

export default ProductCreation;