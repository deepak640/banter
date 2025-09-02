"use client"
import { useAddUser, useUpdateUser } from "@/services/user.service"
import { toastError, toastSuccess } from "@/utils/toast"
import type React from "react"
import { useState } from "react"
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff } from "react-icons/fi"
import { useRouter } from "next/navigation"


export default function RegisterForm() {

  const [step, setStep] = useState(1) // 1 for registration, 2 for profile pic
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [id, setId] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { mutateAsync: registerUser } = useAddUser()
  const { mutateAsync: updateUser } = useUpdateUser(id)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate passwords
    if (name === "confirmPassword" && formData.password !== value) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
    } else if (name === "confirmPassword") {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }))
    }

    if (name === "password" && value.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }))
    } else if (name === "password") {
      setErrors((prev) => ({ ...prev, password: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Attach originFileObj property for compatibility with some upload components
      Object.defineProperty(file, "originFileObj", {
        value: file,
        writable: false,
        enumerable: false,
        configurable: true,
      })
      setProfileImage(file)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      // Validate before submission
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
        return
      }
      if (formData.password.length < 6) {
        setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }))
        return
      }
      try {
        const { data } = await registerUser(formData)
        if (data) {
          setId(data?.user._id)
          toastSuccess("User registered successfully")
          setStep(2) // Move to profile picture upload step
        }
      } catch (error: any) {
        toastError(error.response.data.message)
      }
    } else if (step === 2) {
      try {
        if (profileImage) {
          const form = new FormData()
          form.append("file", profileImage)
          await updateUser(form)
          const router = useRouter()
          router.push("/auth?type=login")
        }
      } catch (error: any) {
        toastError(error.response?.data?.message || "An error occurred during profile update.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" style={{ viewTransitionName: "auth-container" }}>
      {step === 1 && (
        <>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiUser />
              </div>
              <input
                id="name"
                autoComplete="off"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="register-email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiMail />
              </div>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="register-password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiLock />
              </div>
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                autoComplete="off"
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiLock />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                autoComplete="off"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              autoComplete="off"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiUserPlus className="mr-2" />
            Create Account
          </button>
        </>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Upload Profile Picture</h2>
          <div className="flex justify-center items-center">
            <label htmlFor="profile-image" className="cursor-pointer">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl border-4 border-gray-300 shadow-lg">
                  <FiUser />
                </div>
              )}
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <p className="text-sm text-gray-600">Click the circle to upload your profile picture.</p>
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Finish Registration
          </button>
        </div>
      )}
    </form>
  )
}
