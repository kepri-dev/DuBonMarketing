import React from "react";
import { Navigate } from "react-router-dom";

export const withHirer = (Component) => {
  return (props) => {
    if (
      props.user &&
      (props.user.role === "hirer" || props.user.role === "For Brands")
    ) {
      return <Component {...props} />;
    }
    return <Navigate to="/profils" />;
  };
};
