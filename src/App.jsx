import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home"; // Rename import
import Properties from "./pages/Properties";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-quicksand cursor-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />{" "}
          {/* Use renamed component */}
          <Route path="/properties" element={<Properties />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
