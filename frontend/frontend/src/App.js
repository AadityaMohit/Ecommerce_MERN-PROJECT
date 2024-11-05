import Footer from "./components/Auth/Footer";
import HomePage from "./components/Auth/HomePage";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute
import Dashboard from "./components/Dashboard/Dashboard";
import Analytics from "./components/Dashboard/Analytics/Analytics";
import Settings from "./components/Dashboard/Setting";
import LatestProduct from "./products/LatestProduct";
import BillingSection from "./products/BillingSedtion";
import Pr from "./products/Pr";
import Message from "./components/Auth/Message";
import OrderStatus from "./products/OrderStatus";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
   
          <Route path="/signin" element={<Signup />} />
          <Route path="/products" element={<LatestProduct/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="orderstatus" element={<OrderStatus/>}/>
          <Route path="/billing" element={<BillingSection />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/message" element={<Message/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/setting" element={<Settings />} />
  <Route path="/pr" element={<Pr/>}/>
          <Route path="/homepage" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/> 
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        </Routes>
      </Router>
    
    </>
  );
}

export default App;
