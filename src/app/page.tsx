import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1a1a1a] text-[#fff]">
      Welcome to DroiddEx
      <Link href="/login">
        <button className="bg-[#ebb70c] text-[#fff] text-[18px] px-8 py-3 font-semibold rounded-lg cursor-pointer hover:bg-[#f0c200] transition duration-300 ease-in-out">
          Login
        </button>
      </Link>
      {/* <Link href="/login" className="mt-4">
        <button className="bg-[#ebb70c] text-[#fff] text-[18px] px-7 py-4 font-semibold rounded-lg cursor-pointer hover:bg-[#f0c200] transition duration-300 ease-in-out">
          Go to Admin
        </button>
      </Link> */}
    </div>
  );
};

export default page;
