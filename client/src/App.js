import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    } 
  },[]);

  return isLoggedIn ? (
    <Router>
      
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="*" element={<div>404 Page not found :(</div>} />
        </Routes>
    </Router>
  ) : (
    <Router>
      <Routes>
          <Route path="/" element={<SignIn setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
