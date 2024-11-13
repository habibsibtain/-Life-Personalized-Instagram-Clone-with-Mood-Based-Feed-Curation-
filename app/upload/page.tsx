import VideoUpload from "@/components/VideoUpload";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen  p-4 overflow-auto mb-[4rem] ">
      <div className="flex flex-col border w-[90%] lg:w-[50rem] p-6 rounded-xl border-slate-600 shadow-lg shadow-red-600 h-full ">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Upload Video</h1>
          <p className="text-gray-400 ">Post a video to your account</p>
        </div>
            <VideoUpload />
        
      </div>
    </div>
  );
};

export default page;
