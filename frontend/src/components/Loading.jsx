const Loading = () => {
  return (
    <div className="w-full h-screen -z-50 bg-black flex items-center justify-center transition-all duration-500">
      <div className="border-4 w-20 h-20 rounded-full bg-transparent border-white border-t-transparent animate-spin" />
    </div>
  );
};

export default Loading;
