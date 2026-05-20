import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      
      <h1 className="text-5xl font-bold text-blue-600 mb-10">
        Team Task Manager
      </h1>

      <div className="flex gap-6">
        
        <Link to="/login">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700">
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700">
            Signup
          </button>
        </Link>

      </div>

    </div>
  );
}

export default Home;