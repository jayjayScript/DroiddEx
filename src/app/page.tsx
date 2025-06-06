import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1a1a1a] text-[#fff]">
      Welcome to DroiddEx
      <Link href="/create-wallet">
        <button className="bg-[#ebb70c] text-[#fff] text-[18px] px-8 py-3 font-semibold rounded-lg cursor-pointer hover:bg-[#f0c200] transition duration-300 ease-in-out">
          Create Wallet
        </button>
      </Link>
    </div>
  );
};

export default page;
