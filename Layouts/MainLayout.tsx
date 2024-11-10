import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function MainLayout({children}:{children:React.ReactNode}) {
  return (
    <>

      <Navbar />
      <Sidebar/>
      {children}

    </>
  )
}
