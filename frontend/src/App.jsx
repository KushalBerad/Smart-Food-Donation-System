import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupForm from "./pages/SignupForm.jsx";
import CreateDonation from "./pages/donor/CreateDonation.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/create-donation" element={<CreateDonation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;