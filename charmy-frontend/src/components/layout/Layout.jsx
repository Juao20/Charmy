import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-20 pt-16 px-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}