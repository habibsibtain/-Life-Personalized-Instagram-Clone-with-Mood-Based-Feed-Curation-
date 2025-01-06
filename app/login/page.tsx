"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [loginDetails, setLoginDetails] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(`/api/auth/login`, loginDetails)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("userId", res.data.user._id);
          localStorage.setItem("token", res.data.token);
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <div className="flex justify-center h-screen items-center p-4 ">
        <div className="grid grid-row-2 lg:grid-cols-2 border p-4 rounded-xl border-slate-600 shadow-lg shadow-red-600 w-[90%] lg:w-[50rem] ">
          <form
            onSubmit={handleLogin}
            className="flex flex-col lg:border-r p-4  border-slate-600  "
          >
            <h1 className="text-2xl font-bold text-red-600 mb-6">LogIn</h1>
            <div className="mb-8 flex flex-col ">
              <label htmlFor="Username" className="text-white text-sm">
                Username
              </label>
              <input
                type="text"
                id="Username"
                className=" mt-2 mb-4 w-full rounded-lg p-2 outline-none text-sm"
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, username: e.target.value })
                }
                value={loginDetails.username}
              />
              <label htmlFor="email" className="text-white text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                className=" mt-2 mb-4 rounded-lg p-2 outline-none text-sm"
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, email: e.target.value })
                }
                value={loginDetails.email}
              />
              <label htmlFor="password" className="text-white text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                className=" mt-2 rounded-lg p-2 outline-none text-sm"
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, password: e.target.value })
                }
                value={loginDetails.password}
              />
              <div className="mt-4">
                <button
                  type="submit"
                  className={`border 
                p-2 rounded-lg  border-red-600 text-red-600 hover:bg-red-600 hover:text-white  font-semibold ${
                  loading ? "opacity-50 cursor-not-allowed " : ""
                }`}
                >
                  {loading ? "Logging in..." : "LogIn"}
                </button>
              </div>
            </div>
            <p className={`text-sm flex gap-2 justify-center`}>
              {" "}
              Do not have an account?{" "}
              <Link
                href={"/signup"}
                className={`text-red-600 ${
                  loading ? "opacity-50 cursor-not-allowed " : ""
                }`}
              >
                {" "}
                SignUp{" "}
              </Link>{" "}
            </p>
          </form>
          <div className="flex justify-center items-center">
            {/* <SignIn /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
