"use client";
import SwitchTabs from "@/components/SwitchTabs";
import MainLayout from "@/Layouts/MainLayout";
import axios from "axios";
import Image from "next/image";
import React from "react";

type UserDetails = {
  _id?: string;
  fullname?: string;
  username?: string;
  following?: string[];
  followers?: string[];
};

type Post = {
  _id?: string;
  userId?: string;
  videoUrl?: string;
  caption?: string;
  createdAt?: string;
  username?: string;
  fullname?: string;
};

const Page = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [userDetails, setUserDetails] = React.useState<UserDetails>({});

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPosts(res.data.posts);
        setUserDetails(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <MainLayout>
        <div className="flex flex-col p-8  lg:ml-60  ">
          <div className="flex gap-4 ">
            <Image
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              width={100}
              height={100}
              alt="Tailwind CSS Navbar component"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <p className="font-bold">{userDetails.fullname}</p>
              <p className="text-sm text-gray-500">{userDetails.username}</p>
             
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3 ">
            <div className="flex gap-4">
              <p className="text-sm font-semibold">
                {userDetails.following?.length} <span className="text-gray-500">Following</span>
              </p>
              <p className="text-sm font-semibold">
                {userDetails.followers?.length} <span className="text-gray-500">Followers</span>
              </p>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>

          <div className="mt-8 ">
            <SwitchTabs posts={posts} />
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Page;
