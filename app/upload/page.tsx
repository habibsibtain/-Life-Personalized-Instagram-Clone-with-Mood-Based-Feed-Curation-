import VideoUpload from "@/components/VideoUpload";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center  p-4 ">
      <div className="flex flex-col border  w-[50rem] p-6 rounded-xl border-slate-600 shadow-lg shadow-red-600">
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
