import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUser, FaCog, FaBoxOpen, FaComment, FaListUl, FaChartLine } from 'react-icons/fa';
import './DashBoard.css'; 
const Dashboard = () => {
  const location = useLocation();

  
  const hiddenRoutes = ["/Login","/FirstLogin"]; // Add more routes as needed

  
  const hideNavbar = hiddenRoutes.includes(location.pathname);
  const isInitialRoute = location.pathname === '/';

  
  return !hideNavbar &&  !isInitialRoute &&  (
    <Navbar expand="lg" variant="dark" bg="primary" className="custom-navbar">
      <Container>
        <Navbar.Brand className="brand">License Portal</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <NavDropdown title={<span><FaUser /> Users</span>} id="users-dropdown">
              <NavDropdown.Item href="/UserList">User List</NavDropdown.Item>
              <NavDropdown.Item href="/AddUser">Add User</NavDropdown.Item>
              <NavDropdown.Item href="/RoleCreation">Role Creation</NavDropdown.Item>
              <NavDropdown.Item href="/Permission">Permission</NavDropdown.Item>
              
            </NavDropdown>
            <NavDropdown title={<span><FaCog /> Configurations</span>} id="configurations-dropdown">
              <NavDropdown.Item href="/ClientMaster">Client Master</NavDropdown.Item>
              <NavDropdown.Item href="/ClientCategoryConfiguration">Client Category</NavDropdown.Item>
              <NavDropdown.Item href="/ClientBranchConfiguration">Client Branch</NavDropdown.Item>
              <NavDropdown.Item href="/ProductCreation">Product Configuration</NavDropdown.Item>
              <NavDropdown.Item href="/LicenseMaster">License Master</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={<span><FaBoxOpen />Vendor Creation</span>} id="configurations-dropdown">
            <NavDropdown.Item href="/AddVendor">Add Vendor</NavDropdown.Item>
            <NavDropdown.Item href="/VendorCreation">Vendor Details</NavDropdown.Item>
            </NavDropdown>
           
            <NavDropdown title={<span><FaComment /> License Termination</span>} id="license-termination-dropdown">
              <NavDropdown.Item href="/MessageCreation">Send message</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={<span><FaListUl /> Requests</span>} id="requests-dropdown">
              <NavDropdown.Item href="/LicenseRenewalRequest">License Renewal Requests</NavDropdown.Item>
              <NavDropdown.Item href="/LicenseRequestPage">New License Request</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={<span><FaChartLine /> Reconciliation</span>} id="reconciliation-dropdown">
              <NavDropdown.Item href="/MonthlyReconciliation">Monthly Reconciliation</NavDropdown.Item>
              <NavDropdown.Item href="/MonthlyReconciliationPending">Monthly Pending Reconciliation</NavDropdown.Item>
              <NavDropdown.Item href="/AnnualReconciliation">Annual Reconciliation</NavDropdown.Item>
              <NavDropdown.Item href="/AnnualReconciliationPending">Annual Pending Reconciliation </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={<span><FaChartLine /> Logs</span>} id="Logs-dropdown">
              <NavDropdown.Item href="/LoginLogs">Login Logs</NavDropdown.Item>
              <NavDropdown.Item href="/ResetLogs">Reset password Logs</NavDropdown.Item>
              <NavDropdown.Item href="/NewLicenseRequestLogs">New LicenseRequestLogs</NavDropdown.Item>
              <NavDropdown.Item href="/MonthlyReconciliationLogs">Monthly Reconciliation Logs</NavDropdown.Item>
              <NavDropdown.Item href="/AnnualReconciliationLogs">Annual Reconciliation Logs</NavDropdown.Item>
              <NavDropdown.Item href="/HolderCreationLogs">Holder Creation Logs</NavDropdown.Item>
              <NavDropdown.Item href="/UserAddLogs">User Creation Logs</NavDropdown.Item>
             
             
             
            </NavDropdown>
            <NavDropdown title={<span><FaUser/> My Profile</span>} id="license-profile-dropdown">
              <NavDropdown.Item href="/Login">LogOut </NavDropdown.Item>
             
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Dashboard;
