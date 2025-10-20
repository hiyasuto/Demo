"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
  industry: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    industry: "",
    contactEmail: "",
    contactPhone: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Mock data - replace with actual API call
      setCustomers([
        {
          id: 1,
          name: "Contoso Ltd.",
          industry: "Technology",
          contactEmail: "contact@contoso.com",
          contactPhone: "+1-555-0100",
          createdAt: "2025-01-15",
        },
        {
          id: 2,
          name: "Fabrikam Inc.",
          industry: "Manufacturing",
          contactEmail: "info@fabrikam.com",
          contactPhone: "+1-555-0200",
          createdAt: "2025-02-10",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    try {
      // API call to create customer
      console.log("Creating customer:", newCustomer);
      setShowModal(false);
      setNewCustomer({ name: "", industry: "", contactEmail: "", contactPhone: "" });
      fetchCustomers();
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Customers
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Customer
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {customer.industry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {customer.contactEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {customer.contactPhone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {customer.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* Add Customer Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Add Customer
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Industry"
                  value={newCustomer.industry}
                  onChange={(e) => setNewCustomer({ ...newCustomer, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Contact Email"
                  value={newCustomer.contactEmail}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Contact Phone"
                  value={newCustomer.contactPhone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
