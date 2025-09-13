"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../Hooks/useAuth";
import { useUserById, useUpdateUser } from "../../../services/user.service";
import { toastError } from "../../../utils/toast";
import Image from "next/image";
import avatar from "../../../images/avtar.jpg";
import { Camera } from "lucide-react";

const PersonalDetails = () => {
  const { user } = useAuth();
  const _id = user?._id ?? "";
  const { data: profile, isLoading } = useUserById(_id);
  const { mutateAsync: updateUser, isPending } = useUpdateUser(_id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone || "");
      setPreview(profile.photo || null);
    }
  }, [profile]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toastError("Name is required");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email.trim()) {
      toastError("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      toastError("Invalid email format");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phone.trim()) {
      toastError("Phone number is required");
      return;
    } else if (!phoneRegex.test(phone)) {
      toastError("Phone number must be 10 digits");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    if (photo) {
      formData.append("file", photo);
    }

    try {
      await updateUser(formData);
    } catch (error: any) {
      toastError(error?.response?.data?.message || "An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-gray-800">Personal Details</h1>
      <p className="mt-2 text-gray-600">
        Update your profile information here.
      </p>
      <div className="mt-8 flex gap-10">
        <div className="w-1/4 flex flex-col items-center">
          <div
            className="relative w-36 h-36 cursor-pointer"
            onClick={handleImageClick}
          >
            <Image
              src={preview ?? avatar}
              alt="User Avatar"
              layout="fill"
              objectFit="cover"
              className="rounded-full shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-800 text-center">
            {name}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="w-3/4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-300"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-300"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="text-lg font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center p-4 mt-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetails;
