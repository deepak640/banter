'use client'
import React, { useState } from 'react'
import PersonalDetails from '../../_components/profile/PersonalDetails'
import Security from '../../_components/profile/Security'
import TwoFactorAuth from '../../_components/profile/TwoFactorAuth'
import More from '../../_components/profile/More'
import { User, Shield, Key, MoreHorizontal } from 'lucide-react'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal')

  const sidebarItems = [
    { id: 'personal', label: 'Personal details', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'two-factor', label: 'Two factor auth', icon: Key },
    { id: 'more', label: 'More', icon: MoreHorizontal },
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
    <div className="bg-gray-100 py-10">
      <div className="w-[90%] mx-auto bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        <div className="w-1/4 bg-green-50 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Settings</h2>
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg text-lg font-medium transition-colors duration-300 ${
                    activeTab === item.id
                      ? 'bg-green-200 text-green-800'
                      : 'text-gray-600 hover:bg-green-100'
                  }`}>
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage