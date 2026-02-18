import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishList, setWishList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setWishList(favorites);
  }, []);

  const removeFavorite = (carId) => {
    if (wishList) {
      const updated = wishList.filter((item) => item._id !== carId);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setWishList(updated);
      toast.success("Car Removed", { theme: "colored" });
      window.dispatchEvent(new Event("storage"));
    }
  };

  if (!wishList.length)
    return (
      <h2 className="text-center mt-10 text-2xl min-h-screen container">
        Wishlist is empty 💔
      </h2>
    );

  return (
    <div className="min-h-screen p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ❤️</h1>
      
      <div className="overflow-x-auto">
      <table className="w-full border overflow-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Car</th>
            <th className="p-3">Condition</th>
            <th className="p-3">Price</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {wishList.map((item) => (
            <tr onClick={()=> navigate(`/cars/${item._id}`)} key={item._id} className="text-center border-t hover:bg-slate-100 cursor-pointer text-sm sm:text-base">
              <td className="p-3">
                <img
                  src={item.images[0]}
                  alt={item.carName}
                  className="sm:w-24 sm:h-16 object-cover rounded mx-auto"
                  />
              </td>
              <td className="p-3">{item.carName} {item.brand}</td>
              <td className="p-3">{item.condition}</td>
              <td className="p-3">AED {item.price}</td>
              <td className="p-3">
                <button
                  onClick={(e) =>{e.stopPropagation(); removeFavorite(item._id);} }
                  className="bg-red-600 px-4 py-2 rounded-lg text-white z-50"
                  >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     </div>
    </div>
  );
};

export default Wishlist;
