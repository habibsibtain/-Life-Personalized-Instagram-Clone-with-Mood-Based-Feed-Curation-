"use client";
import React from "react";

interface SwitchTabsProps {
  posts: Post[]
}

type Post = {
  _id?: string
  userId?: string
  caption?: string
  createdAt?: string
  mediaURL?: string
}

const SwitchTabs: React.FC<SwitchTabsProps> = ({posts}) => {
  const [activeTab, setActiveTab] = React.useState<"tab1" | "tab2">("tab1");


  return (
    <div className="flex flex-col ">
      <div className="flex gap-6 w-[10rem] transition-opacity duration-1000 ease-in-out  ">
        <button
          onClick={() => setActiveTab("tab1")}
          className={`flex-1 py-2 transition-colors text-center font-semibold ${
            activeTab === "tab1"
              ? "border-b-2 border-red-600 text-red-600"
              : "text-gray-500"
          }`}
        >
          Videos
        </button>

        <button
          onClick={() => setActiveTab("tab2")}
          className={`flex-1 py-2 transition-colors text-center font-semibold ${
            activeTab === "tab2"
              ? "border-b-2 border-red-600 text-red-600"
              : "text-gray-500"
          }`}
        >
          Posts
        </button>
      </div>

      <div>
        {activeTab === "tab1" ? (
          <div className="  mt-4 grid lg:grid-cols-4 grid-cols-3 lg:gap-6 gap-5">
            {Array.isArray(posts) && posts.length > 0 ?(

               posts.map((e: Post , index: number) => (
                <div key={index} >
                  <video 
                  src={e.mediaURL}
                  playsInline
                  controls
                  className="w-full lg:h-[20rem] rounded-xl cursor-pointer"

                  />
                </div>
              ))
            ):(
              <div className="flex itmes-center justify-center ">
                  No Posts yet
              </div>
            )
           
          }
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-8 gap-6 ">
            {/* {[...Array(10)].map((_, index) => (
              <div className="">
                <p className="text-xs text-gray-500">Video </p>
              </div>
            ))} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwitchTabs;
