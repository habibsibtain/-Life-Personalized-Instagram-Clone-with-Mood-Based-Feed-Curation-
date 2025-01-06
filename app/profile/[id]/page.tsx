'use client'
import SwitchTabs from "@/components/SwitchTabs";
import MainLayout from "@/Layouts/MainLayout";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

type UserDetails = {
  _id?: string;
  fullname?: string;
  username?: string;
  email?: string;
  profilePic?: string;
  coverPic?: string;
  following?: string[];
  followers?: string[];
}

interface Post {
  _id?: string;
  userId?: string;
  mediaURL?: string;
  caption?: string;
  createdAt?: string;
  username?: string;
  fullname?: string;
}

const Page = () => {
  const id = useParams()
  const [posts, setPosts] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState<UserDetails>({});
  const [followed, setFollowed] = React.useState(false);

  


  const follow = async()=>{
    const targetedUserId = id.id
    const token = localStorage.getItem('token')
    await axios.post('/api/users/follow', {targetedUserId},{
      headers:{
        Authorization:`Bearer ${token}`,
      }
    }).then((res)=>{
      setFollowed(true)
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }
  const unfollow = async()=>{
    const targetedUserId = id.id
    const token = localStorage.getItem('token')
    await axios.post('/api/users/unfollow', {targetedUserId},{
      headers:{
        Authorization:`Bearer ${token}`,
      }
    }).then((res)=>{
      console.log(res)

      setFollowed(false)
    }).catch((err)=>{
      console.log(err)
    })
  }
  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const loggedInUserId = localStorage.getItem("userId");
      await axios.get(`/api/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((res) => {
        const user = res.data.users.filter((user: UserDetails) => user._id === id.id);
        const userPosts = res.data.allPosts.filter((posts: Post) => posts.userId === id.id);
        setPosts(userPosts);
        setUserDetails(user[0]);

        if(user[0].followers?.includes(loggedInUserId)){
          setFollowed(true)
        }
      }).catch((err) => {
        console.log(err);
      })
    }
    fetchUser();
  }, [followed]);

  

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
            <button onClick={()=>{
              if(followed){
                unfollow()
              }else{
                follow()
              }
              }} className="border text-sm mt-2 w-[4.7rem] h-[1.7rem] rounded-lg  border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all font-semibold">
              {followed ? "Following" : "Follow"}
            </button>
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
