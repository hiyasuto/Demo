"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMsal } from "@azure/msal-react";

export default function Navigation() {
  const pathname = usePathname();
  const { instance, accounts } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/customers", label: "Customers" },
    { href: "/deals", label: "Deals" },
    { href: "/interactions", label: "Interactions" },
    { href: "/search", label: "Search" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Azure Sales Log
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {accounts.length > 0 && (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {accounts[0].name || accounts[0].username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
