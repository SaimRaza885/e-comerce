import Loding_logo from "/logo.webp";

const Loading = () => {
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Logo */}
        <img
          src={Loding_logo}
          alt="Loading Logo"
          className="w-20 h-20 object-contain animate-pulse"
          decoding="async"
        />

        {/* Spinning ring */}
        <div className="absolute w-28 h-28 rounded-full border-4 border-gray-300 border-t-accent animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
