import { FiPlusCircle } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav className="w-full h-14 bg-black flex items-center px-4">
      {/* Left: spacer for layout consistency */}
      <div className="w-9 lg:hidden" /> {/* leave space for sidebar trigger */}
      {/* Center: Search */}
      <div className="flex-1 px-4 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search Customer"
          className="text-sm w-full bg-transparent border border-grayCustom text-white placeholder-grayCustom rounded-custom px-4 py-1 focus:outline-none focus:ring focus:ring-grayCustom"
        />
      </div>
      {/* Right: Plus */}
      <button className="text-white hover:bg-gray-800 rounded-full p-1 transition">
        <FiPlusCircle className="text-2xl" />
      </button>
    </nav>
  );
};

export default Navbar;
