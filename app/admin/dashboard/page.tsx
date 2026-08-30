'use client'

import React, { useEffect, useState } from 'react'
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Home, 
  ShieldAlert, 
  Layers
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface ProfileRow {
  id: string
  full_name: string
  role: string
  school_name: string
  created_at: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [usersCount, setUsersCount] = useState(0)
  const [schoolsCount, setSchoolsCount] = useState(0)
  const [lessonsCount, setLessonsCount] = useState(0)
  const [recentUsers, setRecentUsers] = useState<ProfileRow[]>([])

  useEffect(() => {
    if (!user) return

    const fetchAdminData = async () => {
      try {
        setLoading(true)

        // 1. Fetch counts
        const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
        const { count: sCount } = await supabase.from('schools').select('*', { count: 'exact', head: true })
        const { count: lCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true })

        setUsersCount(uCount || 0)
        setSchoolsCount(sCount || 0)
        setLessonsCount(lCount || 0)

        // 2. Fetch recent users
        const { data: users } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        setRecentUsers((users || []) as ProfileRow[])

      } catch (err) {
        console.error('Error fetching admin details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    )
  }

  const cards = [
    { label: 'Total Users', value: usersCount, icon: Users, color: 'bg-blue-500 text-blue-500' },
    { label: 'Registered Schools', value: schoolsCount, icon: Layers, color: 'bg-green-500 text-green-500' },
    { label: 'Created Lessons', value: lessonsCount, icon: BookOpen, color: 'bg-purple-500 text-purple-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <ShieldCheck className="size-8 text-orange-600" />
          Admin Console
        </h1>
        <p className="text-gray-500 mt-1">Platform management, registered users list, and system metrics.</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl ${card.color.split(' ')[0]}/10 ${card.color.split(' ')[1]}`}>
              <card.icon className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
          <Users className="size-5 text-gray-400" />
          Registered Users
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3">Name</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">School Name</th>
                <th className="pb-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="py-4 font-semibold text-gray-900">{user.full_name}</td>
                  <td className="py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                      user.role === 'admin' 
                        ? 'bg-red-50 text-red-700' 
                        : user.role === 'teacher' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500">{user.school_name || 'N/A'}</td>
                  <td className="py-4 text-right text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
