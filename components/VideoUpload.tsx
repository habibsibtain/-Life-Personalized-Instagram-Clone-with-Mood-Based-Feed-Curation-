"use client";
import React, { useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";


const VideoUpload: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter();

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please select a valid video file.");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!videoFile || !caption) {
      alert("Please add a caption and select a video file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("upload_preset", "LifeMedia"); // Replace with your unsigned preset name

    try {
      // Upload to Cloudinary
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/dcphrjb6y/video/upload`, // Replace with your cloud name
        formData
      );

      // Capture the uploaded video URL from Cloudinary response
      const mediaUrl = uploadRes.data.secure_url;

      // Send video URL and caption to your backend to save post information
      const response = await axios.post(
        `/api/posts/upload`,
        { mediaURL: mediaUrl, caption },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Video uploaded successfully!");
        setCaption("");
        setVideoFile(null);
        setVideoPreviewUrl(null);
      } else {
        alert("Failed to save post.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred during the upload.");
    } finally {
      setUploading(false);
    }
    router.push("/");
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col lg:flex-row gap-4">
      <div className="lg:w-[30%]">
        <div className="border border-dashed border-gray-300 p-2 w-full max-w-md mx-auto h-[20rem] rounded-xl shadow-md flex justify-center items-center flex-col">
          {videoPreviewUrl ? (
            <video src={videoPreviewUrl} controls autoPlay className=" h-[18rem] items-center rounded-xl" />
          ) : (
            <>
              <FaCloudUploadAlt className="text-4xl self-center mb-6" />
              <h2 className="text-lg font-semibold mb-4">Select Video to Upload</h2>
              <div className="self-center text-gray-500 text-sm mt-8 mb-6">
                <p>Up to 30 mins</p>
                <p>Less than 2 GB</p>
              </div>
              <div className="flex items-center self-center justify-center w-[7rem] h-[2.5rem]">
              <label className="text-red-600 cursor-pointer mb-4 flex border border-red-600 w-[7rem] h-[2.5rem] items-center justify-center  rounded-lg hover:bg-red-600 hover:text-white active:w-[6.8rem] active:h-[2.3rem] transition-all duration-300 ease-in-out ">
                Select File
                <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
              </label>

              </div>
            </>
          )}
        </div>
      </div>
      <div className="lg:w-[70%] p-6">
        <label htmlFor="caption">Caption</label>
        <textarea
          className="w-full mt-2 rounded-lg p-2 outline-none text-sm"
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
        <div className="flex gap-4 justify-end mt-4">
          <div className="flex items-center justify-center">
          <button
            className={`border p-2 rounded-lg border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold active:p-[0.48rem] transition-all duration-300 ease-in-out ${uploading ? "pointer-events-none " : ""}`}
            onClick={() => {
              setCaption("");
              setVideoFile(null);
              setVideoPreviewUrl(null);
            }}
            disabled={uploading}
          >
            Discard
          </button>

          </div>
          <button
            type="submit"
            disabled={uploading}
            onClick={()=>{
              console.log('clicked')
            }}
            className={`border p-2 text-center  rounded-lg border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold ${uploading ? "pointer-events-none" : ""}`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default VideoUpload;
