import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";
import "../styles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { register, error, loading, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await register({ name, email, password });
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <h2>📋 Register</h2>
      <ErrorMessage message={error} type="error" />
      <form onSubmit={handleSubmit}>
        <InputField
          type="text"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          disabled={loading}
          fullWidth
        />
        <InputField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
          fullWidth
        />
        <InputField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={loading}
          fullWidth
        />
        <Button 
          type="submit" 
          disabled={loading}
          fullWidth
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;