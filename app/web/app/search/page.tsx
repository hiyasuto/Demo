"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import { useState } from "react";

interface SearchResult {
  type: string;
  id: number;
  title: string;
  description: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    dateFrom: "",
    dateTo: "",
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Mock search - replace with actual API call
      setTimeout(() => {
        setSearchResults([
          {
            type: "customer",
            id: 1,
            title: "Contoso Ltd.",
            description: "Technology company",
          },
          {
            type: "interaction",
            id: 1,
            title: "Initial Requirements Discussion",
            description: "Meeting with Contoso Ltd. about Azure Migration",
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Search failed:", error);
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "deal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "interaction":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Search
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                placeholder="Search customers, deals, interactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>

            <div className="flex space-x-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="customer">Customers</option>
                <option value="deal">Deals</option>
                <option value="interaction">Interactions</option>
              </select>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="From"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="To"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            result.type
                          )}`}
                        >
                          {result.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {result.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {result.description}
                      </p>
                    </div>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Enter a search query to find customers, deals, and interactions
              </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
