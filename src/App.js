import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import FirstLogin from './pages/FirstLogin/FirstLogin';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import DashBoard from './pages/DashBoard/DashBoard';
import UserList from './pages/UserList/UserList';
import LicenseRequestPage from './pages/LicenseRequestPage/LicenseRequestPage';
import LicenseRenewalRequest from './pages/LicenseRenewalRequest/LicenseRenewalRequest';
import VendorCreation from './pages/VendorCreation/VendorCreation';
import MessageCreation from './pages/MessageCreation/MessageCreation';
import ClientCategoryConfiguration from './pages/ClientCategoryconfiguration/ClientCategoryConfiguration';
import ClientBranchConfiguration from './pages/ClientBranchConfiguration/ClientBranchConfiguration';
import Clientmaster from './pages/ClientMaster/ClientMaster';
import ProductCreation from './pages/ProductCreation/ProductCreation';
import LicenseMaster from './pages/LicenseMaster/LicenseMaster';
import RoleCreation from './pages/RoleCreation/RoleCreation';
import MonthlyReconciliation from './pages/MonthlyReconciliation/MonthlyReconciliation';
import MonthlyReconciliationPending from './pages/MonthlyReconciliationPending/MonthlyReconciliationPending';
import AnnualReconciliation from './pages/AnnualReconciliation/AnnualReconciliation';
import AnnualReconciliationPending from './pages/AnnualReconciliationpPending/AnnualReconciliationPending';
import AddVendor from './pages/AddVendor/AddVendor';
import AddUser from './pages/AddUser/AddUser';
import LoginLogs from './pages/LoginLogs/LoginLogs';
import ResetLogs from './pages/ResetLogs/ResetLogs';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import NewLicenseRequestLogs from './pages/NewLicenseRequestLogs/NewLicenseRequestLogs';
import MonthlyReconciliationLogs from './pages/MonthlyReconciliationLogs.js/MonthlyReconciliationLogs';
import AnnualReconciliationLogs from './pages/AnnualReconciliationLogs/AnnualReconciliationLogs';
import HolderCreationLogs from './pages/HolderCreationLogs/HolderCreationLogs';
function App() {
  return (
    <BrowserRouter>
      <div><DashBoard/></div>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route eaxct path='/FirstLogin' element={<FirstLogin/>}/>
        <Route eaxct path='/UserList' element={<UserList/>}/>
        <Route exact path="/VendorCreation" element={<VendorCreation />}/>
        <Route exact path="/LicenseRequestPage" element={<LicenseRequestPage />}/>
        <Route exact path="/LicenseRenewalRequest" element={<LicenseRenewalRequest />}/>
        <Route exact path="/AddVendor" element={<AddVendor/>}/>
        <Route exact path="/Login" element={<Login />}/>
        <Route exact path="/MessageCreation" element={<MessageCreation />}/>
        <Route exact path="/ClientCategoryConfiguration" element={<ClientCategoryConfiguration />}/>
        <Route exact path="/ClientBranchConfiguration" element={<ClientBranchConfiguration />}/>
        <Route exact path="/Clientmaster" element={<Clientmaster />}/>
        <Route exact path="/ProductCreation" element={<ProductCreation />}/>
        <Route exact path="/LicenseMaster" element={<LicenseMaster />}/>
        <Route exact path="/RoleCreation" element={<RoleCreation />}/>
        <Route exact path="/MonthlyReconciliation" element={<MonthlyReconciliation />}/>
        <Route exact path="/MonthlyReconciliationPending" element={<MonthlyReconciliationPending/>}/>
        <Route exact path="/AnnualReconciliation" element={<AnnualReconciliation/>}/>
        <Route exact path="/AnnualReconciliationPending" element={<AnnualReconciliationPending/>}/>
        <Route exact path="/AddUser" element={<AddUser/>}/>
        <Route exact path="/LoginLogs" element={<LoginLogs/>}/>
        <Route exact path="/ResetLogs" element={<ResetLogs/>}/>
        <Route exact path="/ForgetPassword" element={<ForgetPassword/>}/>
        <Route exact path="/NewLicenseRequestLogs" element={<NewLicenseRequestLogs/>}/>
        <Route exact path="/MonthlyReconciliationLogs" element={<MonthlyReconciliationLogs/>}/>
        <Route exact path="/AnnualReconciliationLogs" element={<AnnualReconciliationLogs/>}/>
        <Route exact path="/HolderCreationLogs" element={<HolderCreationLogs/>}/>
      
      
      


      </Routes>
    </BrowserRouter>
  );
}

export default App;
