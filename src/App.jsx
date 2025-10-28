// App.jsx - Updated
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import Properties from "./pages/Properties";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-quicksand cursor-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
