"use client"
import React from 'react'
import LoginForm from "@/app/auth/_components/login"
import RegisterForm from "@/app/auth/_components/register"
import useQueryParams from "@/Hooks/useQueryparams"

const Authform = () => {
  const { setParams, getParam } = useQueryParams()
  const isLogin = getParam("type") ?? "login"

  return (
    <div className="h-screen flex justify-center">
      <div className="flex flex-col justify-center w-5/12 max-w-md p-8 mx-auto rounded-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">ChatApp</h1>
          <p className="mt-2 text-gray-600">Connect with friends</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setParams({ type: "login" })}
            className={`flex-1 py-2 text-sm font-medium rounded-md ${isLogin === "login" ? "bg-white shadow-sm" : "text-gray-500"}`}
          >
            Login
          </button>
          <button
            onClick={() => setParams({ type: "register" })}
            className={`flex-1 py-2 text-sm font-medium rounded-md ${isLogin === "register" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
          >
            Register
          </button>
        </div>
        <div>
          {isLogin === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div >

  )
}

export default Authform
