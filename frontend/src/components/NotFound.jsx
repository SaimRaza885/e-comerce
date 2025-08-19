// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-mint-50 px-4">
      <h1 className="text-6xl font-bold text-mint-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="bg-mint-500 hover:bg-mint-600 bg-accent/90 font-medium px-6 py-3 rounded-full shadow transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
