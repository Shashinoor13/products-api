import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="text-gray-800 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Heubert Submission by Shashinoor</h2>
      </nav>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
