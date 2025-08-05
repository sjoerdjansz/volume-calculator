import { Routes, Route } from "react-router-dom";
import { Calculator } from "../pages/Calculator.jsx";
import { Signup } from "../pages/Signup.jsx";
import { Login } from "../pages/Login.jsx";
import { Layout } from "../components/layout/Layout.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Calculator />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
