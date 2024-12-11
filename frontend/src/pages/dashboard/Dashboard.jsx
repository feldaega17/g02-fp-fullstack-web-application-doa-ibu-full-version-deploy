import React from "react";
import Admin from "../../components/Admin";
import UserContainer from "../../components/users/UserContainer";

const Dashboard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="font-bold text-2xl text-neutral-50 text-center p-4 bg-green-700 rounded-lg mb-4">
          Admin Dashboard
        </h1>
        <div className="flex sm:h-[450px] md:h-[620px] lg:h-5/6 w-11/12 rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0">
          <Admin />
          {/* <UserContainer /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
