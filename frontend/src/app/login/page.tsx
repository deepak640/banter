"use client"
import LoginForm from "@/app/_components/auth/login"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="h-screen flex justify-center">
      <div className="flex flex-col justify-center w-5/12 max-w-md p-8 mx-auto rounded-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">ChatApp</h1>
          <p className="mt-2 text-gray-600">Connect with friends in real-time</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <Link href="/login" className="flex-1 py-2 px-4 text-sm font-medium rounded-md bg-white shadow-sm text-center">
            Login
          </Link>
          <Link href="/register" className="flex-1 py-2 px-4 text-sm font-medium rounded-md text-gray-500 text-center">
            Register
          </Link>
        </div>
        <div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
