"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type UserDetails = {
  _id?: string;
  fullname?: string;
  username?: string;
  email?: string;
};

const Navbar = () => {
  const [userDetails, setUserDetails] = React.useState<UserDetails>({});
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    const fetchUser = async () => {
      await axios
        .get(`/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUserDetails(res.data.users);
        })
        .catch((err) => {
          localStorage.removeItem("token");
          console.log(err);
        });
    };
    fetchUser();
  }, []);


  return (
    <>
      <div className="navbar bg-base-100 border-b border-slate-700 fixed z-20 ">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl">
            LIFE
          </Link>
        </div>
        <div className="form-control navbar-center ">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="flex-none navbar-end gap-4">
          <>
            <Link href="/upload" className="w-[5rem] h-[2rem] flex items-center justify-center">
              <button className="border w-[5rem] h-[2rem] rounded-lg  border-red-600 text-red-600  font-semibold hover:bg-red-600 hover:text-white active:w-[4.8rem] active:h-[1.8rem] transition-all duration-300 ease-in-out  ">
                Upload
              </button>
            </Link>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link href="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </>
        </div>
      </div>
      <div className="min-h-[4rem]"></div>
    </>
  );
};

export default Navbar;
