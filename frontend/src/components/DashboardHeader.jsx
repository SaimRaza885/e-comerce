import { Link } from "react-router-dom";

const DashboardHeader = ({ onCreate ,}) => {
  return (
    <>
    <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
      <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex gap-4 items-center">

      <Link to={"/product/create"}>
      <button
        onClick={onCreate}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        >
        Create Product
      </button>
        </Link>
        <Link to={"/admin/dashboard/orders"}>
        <button
        onClick={onCreate}
        className="bg-accent hover:scale-105 text-white px-4 py-2 rounded transition"
        >
        View All Orders
      </button>
        </Link>
        </div>
    </div>
    </>
  );
};

export default DashboardHeader;
