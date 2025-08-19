import { useState, forwardRef } from "react";
import { MdArrowBack, MdSearch } from "react-icons/md";
import { Some_Fruits } from "../assets/data";

// Forward ref to handle click outside
const SearchBox = forwardRef(({ classes = "", isSearching = true, showBox }, ref) => {
  const [input, setInput] = useState("");

  const filteredFruits = input
    ? Some_Fruits.filter((fruit) =>
        fruit.name.toLowerCase().includes(input.toLowerCase())
      )
    : [];

  const removeLastChar = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4">
      <div ref={ref} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-7">
        {/* <button
          className="text-2xl absolute top-3 right-3 text-black cursor-pointer"
          onClick={() => showBox(false)}
        >
          X
        </button> */}

        <div className={`flex items-center gap-3 bg-gray-50 rounded-xl shadow-inner p-3 mb-4 ${classes}`}>
          <MdSearch className="text-gray-400 text-2xl" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search fruits..."
            className="w-full bg-transparent outline-none text-gray-800 text-lg placeholder-gray-400"
          />
          {input && (
            <button
              onClick={removeLastChar}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <MdArrowBack className="text-2xl" />
            </button>
          )}
        </div>

        {isSearching && input && (
          <div className="bg-white rounded-xl shadow-lg p-2 max-h-96 overflow-y-auto border border-gray-200">
            {filteredFruits.length > 0 ? (
              filteredFruits.map((fruit) => (
                <div
                  key={fruit.id}
                  onClick={() => setInput("")}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://via.placeholder.com/56?text=${fruit.name.charAt(0)}`}
                      alt={fruit.name}
                      className="object-cover rounded-full w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{fruit.name}</p>
                    <p className="text-sm text-gray-500">{fruit.pricePerKg}Rs / kg</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{fruit.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">No matching fruits found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default SearchBox;
