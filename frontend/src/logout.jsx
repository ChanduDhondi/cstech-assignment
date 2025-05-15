import { useEffect } from "react";
import { Link } from "react-router-dom";

function Logout({ setIsAuthenticated }) {
  useEffect(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            You're Loggout
          </h2>
          <div className="flex justify-center my-[1rem]">
            <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Logout;
