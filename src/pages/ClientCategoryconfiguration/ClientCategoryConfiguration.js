import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../Component/MessageBox/MessageBox';
import '../../Component/MessageBox/MessageBox.css';
import URL from "../../URL";
function ClientCategoryConfiguration() {
  const [category_id, setid] = useState('');
  const [category_name, setCategory] = useState('');
  
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const URLClientcategory= URL + "api/clientcategoryconfiguration/ClientCategory";
  const URLfetchcategory=URL+"api/clientcategoryconfiguration/fetchCategoryList";
 

  

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
    setShowMessage(false);
    setCategory('');
    setCategory('');
  };
  
  useEffect(() => {
    
    fetchCategoryList();
  }, [currentPage,perPage]); 
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
      const response = await axios.post( URLClientcategory, {
       category_name:category_name
      });

      if (response.data.Valid) {
        setCategory('');
       
        setShowMessage(true);
      setMessage('Category Name Saved Successfully..');
      setMessageType('success');
      fetchCategoryList();

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
  const fetchCategoryList = async () => {
    try {
      const response = await axios.post(URLfetchcategory, {
        category_id:category_id,
        category_name:category_name
      
      });

      if (response.data[0].Valid) {
      
      const startIndex = (currentPage - 1) * perPage;
      const categoryForCurrentPage = response.data[0].ResultSet.slice(startIndex, startIndex + perPage);
      setCategoryList(categoryForCurrentPage);
      const totalcategory= response.data[0].TotalCount;
      const totalPages = Math.ceil(totalcategory / perPage);
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
            <h2 className="text-center mb-4">Client Category Configuration</h2>
        </div>
    </div>

    
    <div className="row">
        <div className="col-md-6 mx-auto">
            <div className="card card-theme theme">
                <div className="card-header">
                    <div className="row">
                    <div className="col-6">
             
            </div>
            
          
                <div className="card-body">
                    <form id="clientcategory" onSubmit={handleSubmit}>
                        
                       
                        <div className="mb-3">
                            <label for="name" className="form-label">Category Name<span className="text-danger">*</span></label>
                            <input
                              onChange={(e) => setCategory(e.target.value)}
                              type="text"
                              autoComplete="off"
                              value={category_name}
                              className="form-control"
                              name="category_name"
                              required
                              id="txtCategoryName"
                              placeholder="Enter Category Name"
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
                          
                <th scope="col">Category ID</th>
                <th scope="col">Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map(category => (
                <tr key={category.category_id}>
                  <td>{category.category_id}</td>
                  <td>{category.category_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination">
      <button type="button" onClick={prevPage} disabled={currentPage === 1}>
  Prev
</button>

            <span>{currentPage}</span>
            <button type="button" onClick={nextPage} disabled={categoryList.length < perPage}>
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

export default ClientCategoryConfiguration;
