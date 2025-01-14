import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import TicketForm from "./components/TicketForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/property" element={<PropertyDetails />} />
        <Route path="/buy-tickets" element={<TicketForm />} />
      </Routes>
    </Router>
  );
}

export default App;