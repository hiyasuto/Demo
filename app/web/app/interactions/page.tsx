"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";

interface Interaction {
  id: number;
  customerId: number;
  customerName: string;
  dealId: number;
  dealTitle: string;
  type: string;
  subject: string;
  date: string;
  notes: string;
  tags: string[];
}

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      // Mock data - replace with actual API call
      setInteractions([
        {
          id: 1,
          customerId: 1,
          customerName: "Contoso Ltd.",
          dealId: 1,
          dealTitle: "Azure Migration Project",
          type: "Meeting",
          subject: "Initial Requirements Discussion",
          date: "2025-03-15",
          notes: "Discussed migration timeline and resource requirements.",
          tags: ["technical", "requirements"],
        },
        {
          id: 2,
          customerId: 2,
          customerName: "Fabrikam Inc.",
          dealId: 2,
          dealTitle: "Cloud Infrastructure Setup",
          type: "Email",
          subject: "Follow-up on Proposal",
          date: "2025-03-18",
          notes: "Sent detailed proposal document with pricing.",
          tags: ["proposal", "pricing"],
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch interactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "meeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "email":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "phone":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "demo":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Interactions
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Log Interaction
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            interaction.type
                          )}`}
                        >
                          {interaction.type}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {interaction.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {interaction.subject}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {interaction.customerName} • {interaction.dealTitle}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {interaction.notes}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {interaction.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Log Interaction Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Log Interaction
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">Select a customer</option>
                    <option value="1">Contoso Ltd.</option>
                    <option value="2">Fabrikam Inc.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deal
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">Select a deal</option>
                    <option value="1">Azure Migration Project</option>
                    <option value="2">Cloud Infrastructure Setup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="meeting">Meeting</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="demo">Demo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Brief subject line"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Detailed notes about the interaction"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="technical, proposal, pricing"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Interaction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
