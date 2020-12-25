import React from "react";
import { Redirect } from "react-router-dom";
import { logOut } from "../api/api";

function LogOut() {
  logOut();
  return <Redirect to="/login" />;
}

export default LogOut;
