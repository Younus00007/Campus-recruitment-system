import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Front from "./pages/Front";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobList from "./pages/JobList";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ApplicationPage from './pages/ApplicationPage';
import PostJob from "./pages/Postjob";
import Home from "./pages/Home";
import CandidateList from './pages/CandidateList';
import AddCandidate from './pages/AddCandidate';
import EditCandidate from './pages/EditCandidate';
import CandidateDetails from './pages/CandidateDetails';
import CandidateRec from "./pages/CandidateRec";
import CandidateDetailsRec from "./pages/CandidateDetailsRec";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateLogin from "./pages/CandidateLogin";
import CandidateProfile from "./pages/CandidateProfile";

const Layout = ({ children }) => {
    const location = useLocation();

    // Hide Navbar on these routes
    const hideNavbarRoutes = ["/", "/login", "/register"];

    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            {children}
        </>
    );
};

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Front />} />
                    <Route path='/home' element={<Home /> }/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/candidate-List" element={<CandidateList/>}/>
                    <Route path="/add-candidate" element={<AddCandidate/>}/>
                    <Route path="/edit/:id" element={<EditCandidate />} />
                    <Route path="/candidate/:id" element={<CandidateDetails />} />
                    <Route path="/candidatesfrorec/:id" element={<CandidateDetailsRec />} />
                    <Route path="/candidate-List-Rec" element={<CandidateRec/>}/>    
                    <Route path="/candidate-Login" element={<CandidateLogin/>} />
                               
                    <Route path="/candidate-Profile" element={<CandidateProfile/>} />
                               
                    
                    
                    
                    
                    <Route 
    path="/dashboard/candidate" 
    element={<ProtectedRoute allowedRole="candidate"><CandidateDashboard /></ProtectedRoute>} 
/>
<Route 
    path="/dashboard/recruiter" 
    element={<ProtectedRoute allowedRole="recruiter"><RecruiterDashboard /></ProtectedRoute>} 
/>
<Route 
    path="/dashboard/admin" 
    element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} 
/>
<Route 
    path="/apply" 
    element={<ProtectedRoute><ApplicationPage /></ProtectedRoute>} 
/>

                    <Route 
                        path="/jobs" 
                        element={<JobList />} 
                    />
                    <Route 
                        path="/profile" 
                        element={<Profile />} 
                    />
                    <Route 
                    path="/postjobs"
                    element={<PostJob />}
                    />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
