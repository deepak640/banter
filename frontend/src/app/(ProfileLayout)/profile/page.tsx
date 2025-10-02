'use client'
import React, { useState } from 'react'
import PersonalDetails from '../../_components/profile/PersonalDetails'
import Security from '../../_components/profile/Security'
import TwoFactorAuth from '../../_components/profile/TwoFactorAuth'
import More from '../../_components/profile/More'
import { User, Shield, Key } from 'lucide-react'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal')

  const sidebarItems = [
    { id: 'personal', label: 'Personal details', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'two-factor', label: 'Two factor auth', icon: Key },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalDetails />
      case 'security':
        return <Security />
      case 'two-factor':
        return <TwoFactorAuth />
      case 'more':
        return <More />
      default:
        return <PersonalDetails />
    }
  }

  return (
    <div className="bg-gray-100 flex flex-col justify-center min-h-screen py-12">
      <div className="w-[90%] mx-auto h-screen bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/4 bg-green-50 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Settings</h2>
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 p-2 md:p-4 rounded-lg text-base md:text-lg font-medium transition-colors duration-300 ${
                    activeTab === item.id
                      ? 'bg-green-200 text-green-800'
                      : 'text-gray-600 hover:bg-green-100'
                  }`}>
                  <item.icon className="w-6 h-6" />
                  <span className=' md:block'>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-3/4">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
