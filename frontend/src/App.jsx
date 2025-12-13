import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VisitantesProvider } from "./Context/VisitantesContext"; 
import Home from "./Paginas/Home";
import Dashboard from "./Paginas/Dashboard";
import Visitantes from "./Paginas/Visitantes";
import Login from "./Paginas/Login";

function App() {
  return (
    <AppRouter/>  
  );
}

export default App;