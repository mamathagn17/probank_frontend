import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import URL from "../../URL";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUser, FaCog, FaBoxOpen, FaComment, FaListUl, FaChartLine } from 'react-icons/fa';
import './DashBoard.css';

const Dashboard = () => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const location = useLocation();
  const hiddenRoutes = ['/Login', '/FirstLogin'];
  const hideNavbar = hiddenRoutes.includes(location.pathname);
  const isInitialRoute = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('routes');
    // Redirect to login page
    window.location.href = '/Login';
  };

  useEffect(() => {
    const fetchDynamicRoutes = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
          // If userInfo is not available, redirect to login
          window.location.href = '/Login';
          return;
        }
        const response = await axios.post(URL + 'api/permission/dynamicRoutes', { userInfo });
        if (response.data.isValid) {
          setRoutes(response.data.routes);
          localStorage.setItem('routes', JSON.stringify(response.data.routes)); // Store routes in local storage
        } else {
          console.error(response.data.responseText);
        }
      } catch (error) {
        console.error('Error fetching dynamic routes:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching routes
      }
    };

    const storedRoutes = JSON.parse(localStorage.getItem('routes'));
    if (storedRoutes) {
      setRoutes(storedRoutes);
      setIsLoading(false); // Set loading to false after setting routes
    } else {
      fetchDynamicRoutes();
    }
  }, [location.pathname]); // Re-fetch routes when location changes

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while fetching routes
  }

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
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Dashboard;
