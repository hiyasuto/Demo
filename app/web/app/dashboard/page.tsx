"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalCustomers: number;
  totalDeals: number;
  totalInteractions: number;
  recentInteractions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalDeals: 0,
    totalInteractions: 0,
    recentInteractions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        setStats({
          totalCustomers: 25,
          totalDeals: 42,
          totalInteractions: 156,
          recentInteractions: 12,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Dashboard
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Total Customers
                </h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalCustomers}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Active Deals
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.totalDeals}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Total Interactions
                </h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalInteractions}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Recent (7 days)
                </h3>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.recentInteractions}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/customers"
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Manage Customers
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and edit customer information
                </p>
              </a>

              <a
                href="/deals"
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Track Deals
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor sales opportunities
                </p>
              </a>

              <a
                href="/interactions"
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Log Interaction
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Record customer communications
                </p>
              </a>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
