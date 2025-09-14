export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">EHR Dashboard</h1>
        </div>
        <div className="flex items-center">
          <button className="text-gray-600 hover:text-gray-800">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}