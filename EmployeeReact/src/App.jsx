import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import HomeNavbar from "./Components/NavBars/HomeNavbar";
import LoginForm from "./Components/Landing/LoginForm";
import SignupForm from "./Components/Landing/SignupForm";
import ManagerDashboard from "./Components/Manager/ManagerDashboard";
import EmployeeDashboard from "./Components/Employee/EmployeeDashboard";
import SuperAdminDashboard from "./Components/SuperAdminDashboard";
import Home from "./Components/Landing/HomePage";
import ManagerLeavePage from "./Components/Manager/ManagerLeavePage";
import ManagerAttendancePage from "./Components/Manager/ManagerAttendancePage";
import EmployeeLeavePage from "./Components/Employee/EmployeeLeavePage";
import EmployeeAttendancePage from "./Components/Employee/EmployeeAttendancePage";
import EmployeePayrollPage from "./Components/Employee/EmployeePayrollPage";
import ProfilePage from "./Components/ProfilePage";
import SuperAdminEmployeeManagement from "./Components/SuperAdminEmployeeManagement";
import SuperAdminAnnouncements from "./Components/SuperAdminAnnouncements";
import ManagerTaskAssignment from "./Components/Manager/ManagerTaskAssignment";
import EmployeeTaskView from "./Components/Employee/EmployeeTaskView";
import DockerTest from "./Components/DockerTest";
// Import Bootstrap CSS
// a
const ProtectedRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes(userRole)) {
    // If the user's role is allowed, render the nested route
    return <Outlet />;
  } else {
    // If the user's role is not allowed, show an access denied message
    return <Navigate to="/access-denied" replace />;
  }
};

const AccessDenied = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
      <h1 className="display-4 text-danger">403</h1>
      <h2 className="mb-4">Access Denied</h2>
      <p className="lead">You do not have permission to view this page.</p>
      <Link to="/" className="btn btn-primary mt-3">Go to Home</Link>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/docker-test" element={<DockerTest />} />


        {/* Routes accessible by Manager and Super Admin */}
        <Route element={<ProtectedRoute allowedRoles={["MANAGER", "SUPER_ADMIN"]} />}>
          <Route path="/managerdashboard" element={<ManagerDashboard />} />
          <Route path="/leave/approvals" element={<ManagerLeavePage />} />
          <Route path="/attendance/manage" element={<ManagerAttendancePage />} />
          <Route path="/managerprofile" element={<ProfilePage />} />
          <Route path="/manager/tasks" element={<ManagerTaskAssignment />} />
          
        </Route>

        {/* Routes accessible by Employee and Super Admin */}
        <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE", "SUPER_ADMIN"]} />}>
          <Route path="/employeedashboard" element={<EmployeeDashboard />} />
          <Route path="/leave" element={<EmployeeLeavePage />} />
          <Route path="/attendance" element={<EmployeeAttendancePage />} />
          <Route path="/payroll" element={<EmployeePayrollPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/employeeprofile" element={<ProfilePage />} />
          <Route path="/tasks" element={<EmployeeTaskView />} />
          
          <Route path="/documents" element={<div>Employee Documents Page (To be implemented)</div>} />
        </Route>
        
        {/* Routes accessible only by Super Admin */}
        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="/superadmindashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/employees" element={<SuperAdminEmployeeManagement />} />
          <Route path="/superadmin/announcements" element={<SuperAdminAnnouncements />} />
        </Route>

        {/* Fallback for any other path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
