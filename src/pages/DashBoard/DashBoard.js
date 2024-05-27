//import React from "react";
import React, { useState, useEffect } from 'react';
import { useLocation} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import URL from "../../URL";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUser, FaCog, FaBoxOpen, FaComment, FaListUl, FaChartLine } from 'react-icons/fa';
import './DashBoard.css'; 
//const Dashboard = () => {
//   const location = useLocation();

  
//   const hiddenRoutes = ["/Login","/FirstLogin"]; // Add more routes as needed

  
//   const hideNavbar = hiddenRoutes.includes(location.pathname);
//   const isInitialRoute = location.pathname === '/';

  
//   return !hideNavbar &&  !isInitialRoute &&  (
//     <Navbar expand="lg" variant="dark" bg="primary" className="custom-navbar">
//       <Container>
//         <Navbar.Brand className="brand">License Portal</Navbar.Brand>
//         <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//         <Navbar.Collapse id="responsive-navbar-nav">
//           <Nav className="ml-auto">
//             <NavDropdown title={<span><FaUser /> Users</span>} id="users-dropdown">
//               <NavDropdown.Item href="/UserList">User List</NavDropdown.Item>
//               <NavDropdown.Item href="/AddUser">Add User</NavDropdown.Item>
//               <NavDropdown.Item href="/RoleCreation">Role Creation</NavDropdown.Item>
//               <NavDropdown.Item href="/Permission">Permission</NavDropdown.Item>
              
//             </NavDropdown>
//             <NavDropdown title={<span><FaCog /> Configurations</span>} id="configurations-dropdown">
//               <NavDropdown.Item href="/ClientMaster">Client Master</NavDropdown.Item>
//               <NavDropdown.Item href="/ClientCategoryConfiguration">Client Category</NavDropdown.Item>
//               <NavDropdown.Item href="/ClientBranchConfiguration">Client Branch</NavDropdown.Item>
//               <NavDropdown.Item href="/ProductCreation">Product Configuration</NavDropdown.Item>
//               <NavDropdown.Item href="/LicenseMaster">License Master</NavDropdown.Item>
//             </NavDropdown>
//             <NavDropdown title={<span><FaBoxOpen />Vendor Creation</span>} id="configurations-dropdown">
//             <NavDropdown.Item href="/AddVendor">Add Vendor</NavDropdown.Item>
//             <NavDropdown.Item href="/VendorCreation">Vendor Details</NavDropdown.Item>
//             </NavDropdown>
           
//             <NavDropdown title={<span><FaComment /> License Termination</span>} id="license-termination-dropdown">
//               <NavDropdown.Item href="/MessageCreation">Send message</NavDropdown.Item>
//             </NavDropdown>
//             <NavDropdown title={<span><FaListUl /> Requests</span>} id="requests-dropdown">
//               <NavDropdown.Item href="/LicenseRenewalRequest">License Renewal Requests</NavDropdown.Item>
//               <NavDropdown.Item href="/LicenseRequestPage">New License Request</NavDropdown.Item>
//             </NavDropdown>
//             <NavDropdown title={<span><FaChartLine /> Reconciliation</span>} id="reconciliation-dropdown">
//               <NavDropdown.Item href="/MonthlyReconciliation">Monthly Reconciliation</NavDropdown.Item>
//               <NavDropdown.Item href="/MonthlyReconciliationPending">Monthly Pending Reconciliation</NavDropdown.Item>
//               <NavDropdown.Item href="/AnnualReconciliation">Annual Reconciliation</NavDropdown.Item>
//               <NavDropdown.Item href="/AnnualReconciliationPending">Annual Pending Reconciliation </NavDropdown.Item>
//             </NavDropdown>
//             <NavDropdown title={<span><FaChartLine /> Logs</span>} id="Logs-dropdown">
//               <NavDropdown.Item href="/LoginLogs">Login Logs</NavDropdown.Item>
//               <NavDropdown.Item href="/ResetLogs">Reset password Logs</NavDropdown.Item>
//               <NavDropdown.Item href="/NewLicenseRequestLogs">New LicenseRequestLogs</NavDropdown.Item>
//               <NavDropdown.Item href="/MonthlyReconciliationLogs">Monthly Reconciliation Logs</NavDropdown.Item>
//               <NavDropdown.Item href="/AnnualReconciliationLogs">Annual Reconciliation Logs</NavDropdown.Item>
//               <NavDropdown.Item href="/HolderCreationLogs">Holder Creation Logs</NavDropdown.Item>
//               <NavDropdown.Item href="/UserAddLogs">User Creation Logs</NavDropdown.Item>
             
             
             
//             </NavDropdown>
//             <NavDropdown title={<span><FaUser/> My Profile</span>} id="license-profile-dropdown">
//               <NavDropdown.Item href="/Login">LogOut </NavDropdown.Item>
             
//             </NavDropdown>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }
// Define sample data

const Dashboard = () => {
  const [routes, setRoutes] = useState([]);
  const location = useLocation();
  const hiddenRoutes = ['/Login', '/FirstLogin'];
  const hideNavbar = hiddenRoutes.includes(location.pathname);
  const isInitialRoute = location.pathname === '/';
  useEffect(() => {
    const storedRoutes = JSON.parse(localStorage.getItem('routes'));
    console.log(storedRoutes);
    if (storedRoutes) {
      setRoutes(storedRoutes);
    } else {
      fetchDynamicRoutes();
    }
  }, []);

  const fetchDynamicRoutes = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await axios.post(URL + 'api/permission/dynamicRoutes', { userInfo });
      if (response.data.isValid) {
        setRoutes(response.data.routes);
        localStorage.setItem('routes', JSON.stringify(response.data.routes)); // Store routes in local storage
      } else {
        console.error(response.data.responseText);
      }
    } catch (error) {
      console.error('Error fetching dynamic routes:', error);
    }
  };
const sampleData = [
  {
    icon: <FaUser />,
    title: "Users",
    children: [
      { title: "User List", link: "/UserList" },
      { title: "Add User", link: "/AddUser" },
      { title: "Role Creation", link: "/RoleCreation" },
      { title: "permission", link: "/Permission" },
    ],
  },
  {
    icon: <FaCog />,
    title: "Configurations",
    children: [
      { title: "Client Master", link: "/ClientMaster" },
      { title: "Client Category", link: "/ClientCategoryConfiguration" },
      { title: "Client Branch", link: "/ClientBranchConfiguration" },
      { title: "Product Configuration", link: "/ProductCreation" },
      { title: "License Master", link: "/LicenseMaster" },
    ],
  },
  {
    icon: <FaBoxOpen />,
    title: "Vendor Details",
    children: [
      { title: "Add Vendor", link: "/AddVendor" },
      { title: "Vendor Creation", link: "/VendorCreation" },
    ],
  },
  {
    icon: <FaComment />,
    title: "License Termination",
    children: [{ title: "Send message", link: "/MessageCreation" }],
  },
  {
    icon: <FaListUl />,
    title: "Requests",
    children: [
      { title: "New License Request", link: "/LicenseRequestPage" },
      { title: "License Renewal Requests", link: "/LicenseRenewalRequest" },
     
    ],
  },
  {
    icon: <FaChartLine />,
    title: "Reconciliation",
    children: [
      { title: "Monthly Reconciliation", link: "/MonthlyReconciliation" },
      {
        title: "Montly Reconciliation - Pending",
        link: "/MonthlyReconciliationPending",
      },
      { title: "Annual Reconciliation", link: "/AnnualReconciliation" },
      {
        title: "Annual Reconciliation Pending",
        link: "/AnnualReconciliationPending",
      },
    ],
  },
  {
    icon: <FaChartLine />,
    title: "Logs",
    children: [
      { title: "Login Logs", link: "/LoginLogs" },
      {
        title: "Reset Password Logs",
        link: "/ResetLogs",
      },
      { title: "New License Request Logs", link: "/NewLicenseRequestLogs" },
      {
        title: "Monthly Reconciliation Logs",
        link: "/MonthlyReconciliationLogs",
      },
      {
        title: "Annual Reconciliation Logs",
        link: "/AnnualReconciliationLogs",
      },
      {
        title: "Holder Creation Logs",
        link: "/HolderCreationLogs",
      },
      {
        title: "User Creation Logs",
        link: "/UserAddLogs",
      },
      {
        title: "User Creation Logs",
        link: "/Permission",
      },
    ],
  },
  {
    icon: <FaUser />,
    title: "My Profile",
    children: [
      { title: "Logout", link: "/Login" },
     
    ],
  },
];

// return !hideNavbar &&  !isInitialRoute &&  (
//   <Navbar expand="lg" variant="dark" bg="primary" className="custom-navbar">
//     <Container>
//       <Navbar.Brand className="brand">License Portal</Navbar.Brand>
//       <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//       <Navbar.Collapse id="responsive-navbar-nav">
//         <Nav className="ml-auto">
//           {sampleData.map((item, index) => (
//             <NavDropdown
//               key={index}
//               title={
//                 <span>
//                   {item.icon} {item.title}
//                 </span>
//               }
//               id={`${item.title.toLowerCase()}-dropdown`}
//             >
//               {item.children &&
//                 item.children.map((child, idx) => (
//                   <NavDropdown.Item key={idx} href={child.link}>
//                     {child.title}
//                   </NavDropdown.Item>
//                 ))}
//             </NavDropdown>
//           ))}
//         </Nav>
//       </Navbar.Collapse>
//     </Container>
//   </Navbar>
// );
// };
return !hideNavbar && !isInitialRoute && (
  <Navbar expand="lg" variant="dark" bg="primary" className="custom-navbar">
    <Container>
      <Navbar.Brand className="brand">License Portal</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {routes.map((routeGroup, index) => (
            <NavDropdown
              key={index}
              title={<span>{routeGroup.icon} {routeGroup.title}</span>}
              id={`${routeGroup.title.toLowerCase()}-dropdown`}
            >
              {routeGroup.children && routeGroup.children.map((child, idx) => (
                <NavDropdown.Item key={idx} href={child.link}>
                  {child.title}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ))}
          <NavDropdown title={<span><FaUser /> My Profile</span>} id="license-profile-dropdown">
            <NavDropdown.Item href="/Login">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
};

export default Dashboard;
