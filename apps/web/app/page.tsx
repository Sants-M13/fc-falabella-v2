import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FC Falabella v2
          </h1>
          <p className="text-gray-600 mb-8">
            Product Management System
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Demo Users:</p>
            <p>Admin: admin@example.com</p>
            <p>Promotora: promotora@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
