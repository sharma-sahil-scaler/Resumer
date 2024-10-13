import React, { useEffect, useState } from 'react'
import ProfileForm from './components/ProfileForm'
import './App.css'

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([])
  const [editingProfile, setEditingProfile] = useState<any | null>(null)

  const fetchProfiles = async () => {
    const response = await fetch('http://localhost:8000/api/profile')
    const data = await response.json()
    setProfiles(data)
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const handleCreateOrUpdateProfile = async (profile: any) => {
    try {
      if (editingProfile) {
        // Update existing profile
        await fetch(`http://localhost:8000/api/profile/${editingProfile.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profile),
        });
      } else {
        // Create new profile
        await fetch('http://localhost:8000/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profile),
        });
      }
      setEditingProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error('Error creating/updating profile:', error);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    await fetch(`http://localhost:8000/api/profile/${id}`, {
      method: 'DELETE',
    })
    fetchProfiles()
  }

  const handleEditProfile = (profile: any) => {
    setEditingProfile(profile)
  }

  return (
    <div>
      <h1>User Profiles</h1>
      <ProfileForm onSubmit={handleCreateOrUpdateProfile} />
      {/* <ProfileList profiles={profiles} onDelete={handleDeleteProfile} onEdit={handleEditProfile} /> */}
    </div>
  )
}

export default App
