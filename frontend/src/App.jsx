import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VisitantesProvider } from "./Context/VisitantesContext"; 
import Home from "./Paginas/Home";
import Dashboard from "./Paginas/Dashboard";
import Visitantes from "./Paginas/Visitantes";
import Login from "./Paginas/Login";

function App() {
  return (
    <VisitantesProvider> {}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visitantes" element={<Visitantes />} />
          <Route path="/login" element={<Login />} /> 
        </Routes>
      </Router>
    </VisitantesProvider>
  );
}

export default App;