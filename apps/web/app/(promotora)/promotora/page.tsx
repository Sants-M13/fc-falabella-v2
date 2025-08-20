import { LogoutButton } from '@/components/auth/logout-button';

export default function PromotoraPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Promotora Dashboard
            </h1>
            <LogoutButton />
          </div>
          
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Welcome Promotora</h2>
            <p className="text-gray-600">
              This is the promotora dashboard where you can manage your store&apos;s 
              products, inventory, and view reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}