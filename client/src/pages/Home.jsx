import React from "react";
import { Link } from "react-router-dom";
import HomeImg from "../assets/HomeImg.jpg";

const Home = () => {
  return (
    <div>
      <div
        className="bg-cover h-screen w-full flex justify-between flex-col pt-4"
        style={{ backgroundImage: `url(${HomeImg})` }}
      >
        <span className="text-2xl font-bold ml-6 text-[#0D47A1]">GoRide</span>
        <div className="bg-white pb-6 py-4 px-4 rounded-lg">
          <h2 className="text-xl font-bold">Get Started With GoRide</h2>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-[#0D47A1] text-white py-3 rounded-lg mt-2"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
