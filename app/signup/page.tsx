'use client'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const router = useRouter()
  const [signupDetails, setSignupDetails] = React.useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  })

  const handleSignup = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await axios
      .post('http://localhost:3000/api/auth/signup', signupDetails)
      .then((res) => {
        console.log(res)
        localStorage.setItem('token', res.data.token)
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen p-4 ">
        <div className="h-auto border p-4 rounded-xl border-slate-600 shadow-lg shadow-red-600">
          <form onSubmit={handleSignup} className="flex flex-col mb-4 ">
          <h1 className="text-2xl font-bold text-red-600 mb-6">SignUp</h1>
          <label htmlFor="Fullname" className="text-white text-sm">
              Full Name
            </label>
            <input
              type="text"
              id="Fullname"
              className=" mt-2 mb-4  rounded-lg p-2 outline-none text-sm"
              onChange={(e) =>
                setSignupDetails({
                  ...signupDetails,
                  fullname: e.target.value,
                })
              }
              value={signupDetails.fullname}
            />
          <div className="mb-8 flex flex-col w-[20rem] ">
            <label htmlFor="Username" className="text-white text-sm">
              Username
            </label>
            <input
              type="text"
              id="Username"
              className=" mt-2 mb-4  rounded-lg p-2 outline-none text-sm"
              onChange={(e) =>
                setSignupDetails({
                  ...signupDetails,
                  username: e.target.value,
                })
              }
              value={signupDetails.username}
            />
            <label htmlFor="email" className="text-white text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              className=" mt-2 mb-4 rounded-lg p-2 outline-none text-sm"
              onChange={(e) =>
                setSignupDetails({
                  ...signupDetails,
                  email: e.target.value,
                })
              }
              value={signupDetails.email}
            />
            <label htmlFor="password" className="text-white text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              className=" mt-2 rounded-lg p-2 outline-none text-sm"
              onChange={(e) =>
                setSignupDetails({
                  ...signupDetails,
                  password: e.target.value,
                })
              }
              value={signupDetails.password}
            />
            <div className="mt-4">
              <button type="submit" className="border w-[5rem] h-[2rem] rounded-lg  border-red-600 text-red-600 hover:bg-red-600 hover:text-white  font-semibold ">
                SignUp
              </button>
            </div>
          </div>
          <p className=" text-sm flex gap-2 justify-center"> Already have an account? <Link href={'/login'}> Login </Link> </p>
          </form>
        </div>
      </div> 
    </>
  )
}

export default Page;
