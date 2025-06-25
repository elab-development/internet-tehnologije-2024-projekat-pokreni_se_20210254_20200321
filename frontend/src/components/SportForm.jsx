import { useState } from "react";
import { createSport } from "../services/sportService";
import { getUserRole } from "../services/authService";

const SportForm = () => {
  const [name, setName] = useState("");
  const role = getUserRole();

  if (role !== "admin") return <h3>Access Denied</h3>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSport({ name });
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="sport-form">
      <input type="text" placeholder="Sport Name" value={name} 
        onChange={(e) => setName(e.target.value)} required />
      <button type="submit">Create Sport</button>
    </form>
  );
};

export default SportForm;