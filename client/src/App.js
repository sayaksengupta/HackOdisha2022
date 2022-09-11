import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  

  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="*" element={<div>404 Page not found :(</div>} />
        </Routes>
    </Router>
  )
}

export default App;
