export default function BankPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Bank Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Account Balance</h2>
          <p className="text-2xl text-green-600">$12,345.67</p>
        </div>

        {/* Recent Transactions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Recent Transactions</h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Grocery Store</span>
              <span className="text-red-500">-$82.35</span>
            </li>
            <li className="flex justify-between">
              <span>Salary Deposit</span>
              <span className="text-green-500">+$3,000.00</span>
            </li>
            <li className="flex justify-between">
              <span>Electric Bill</span>
              <span className="text-red-500">-$145.00</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Transfer Money</button>
            <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Pay Bills</button>
            <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600">
              View Statements
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
