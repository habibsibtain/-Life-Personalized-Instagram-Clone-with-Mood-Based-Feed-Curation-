'use client'
import React from "react";
import { HiHome } from "react-icons/hi2";
import { MdPeopleAlt } from "react-icons/md";
import { BsFire } from "react-icons/bs";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";

type UserDetails = {
  _id?: string;
  fullname?: string;
  username?: string;
  email?: string;

}
const Sidebar = () => {
  const [userDetails, setUserDetails] = React.useState<UserDetails>({});

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      await axios.get(`/api/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((res) => {
        setUserDetails(res.data.users);
      }).catch((err) => {
        console.log(err);
      })
    }
    fetchUser();
  }, []);
  return (
    <>
      <div className="drawer lg:drawer-open fixed w-60">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side min-h-screen bg-base-200">
          <ul className="menu bg-base-200 text-base-content w-60 p-4 border-b border-slate-700">
            {/* Sidebar content here */}
            <li className="font-bold text-red-600">
              <a>
                <HiHome />
                For You
              </a>
            </li>
            <li className="font-bold">
              <a>
                {" "}
                <MdPeopleAlt /> Following
              </a>
            </li>
            <li className="font-bold">
              <a>
                {" "}
                <BsFire /> Trending
              </a>
            </li>
          </ul>

          <ul className="menu bg-base-200 text-base-content w-60 p-4 border-b border-slate-700 ">
            {/* Sidebar content here */}
            <p className="pl-4 mb-2">Suggested Accounts</p>
            {Array.isArray(userDetails) && userDetails.length > 0 ?
              (
                userDetails.slice(0,3).map((e, index) => (
                  
              <li key={index}>
                <Link href={`/profile/${e._id}`} className="flex gap-4">
                  <Image
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Tailwind CSS Navbar component"
                    width={100}
                    height={100}
                    className="w-9 h-9 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{e.fullname}</p>
                    <p className="text-sm">{e.username}</p>
                  </div>
                </Link>
              </li>
              
                ))
              
            ):(
              <>
              <p className="pl-4 ">No suggested accounts</p>
              </>
            )
            }
           

            <a className="text-sm text-red-600 pl-4 mt-2 font-semibold cursor-pointer">
              {" "}
              See all{" "}
            </a>
          </ul>
          <ul className="menu bg-base-200 text-base-content w-60 p-4 ">
            {/* Sidebar content here */}
            <li>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
              quaerat neque iste tempora
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
