import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    // remove token
    localStorage.removeItem("token");

    // redirect to login
    window.location.href = "https://zerodha-clone-frontend-one.vercel.app";
  }, []);

  return <h2>Logging out...</h2>;
};

export default Logout;
