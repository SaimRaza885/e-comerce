import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, User, Lock, LogOut } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/my-orders", label: "My Orders", icon: ShoppingBag },
  { to: "/account/profile", label: "Profile", icon: User },
  { to: "/account/change-password", label: "Change Password", icon: Lock },
];

const AccountSidebar = () => (
  <aside className="w-full md:w-56 shrink-0">
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:sticky md:top-28">
      <h2 className="text-sm font-bold text-gray-900 mb-4 px-3">My Account</h2>
      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
        <Link
          to="/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-1"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </Link>
      </nav>
    </div>
  </aside>
);

export default AccountSidebar;
