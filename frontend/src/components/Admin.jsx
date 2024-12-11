import React from "react";
import { useNavigate } from "react-router-dom";
import Users from "./users/Users";
import LogoutButton from "./sidebar/LogoutButton";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-panel">
      <Users />
      <LogoutButton />
    </div>
  );
};

export default Admin;
