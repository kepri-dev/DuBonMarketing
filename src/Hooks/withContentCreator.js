import React from "react";
import { Navigate } from "react-router-dom";

export const withContentCreator = (Component) => {
  return (props) => {
    if (
      props.user &&
      (props.user.role === "contentCreator" ||
        props.user.role === "For Creators")
    ) {
      return <Component {...props} />;
    }
    return <Navigate to="/dashbord-creator" />;
  };
};
