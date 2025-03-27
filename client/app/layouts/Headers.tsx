"use client";

import React from "react";
import Link from "next/link";
import { useSessionStatus as isSessionExpired } from "@/lib/api/auth";
import { logoutUser } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
    const is_session_expired = isSessionExpired();
    const router = useRouter();
    const handleLogout = async () => {
        try {
          await logoutUser();
          router.push("/home");
        } catch (err) {
          console.error("Error during logout:", err);
        }
      };
    return (
        <header className="bg-green-50 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-green-500 text-2xl font-bold">
                    Task Manager
                </Link>
                <nav>
                    <Link
                        href="/"
                        className="text-green-500 mr-4 text-xl hover:text-yellowish"
                    >
                        Home
                    </Link>
                    {!is_session_expired ? <Link
                            href="/dashboard"
                            className="text-green-500 text-xl mr-4 hover:text-yellowish"
                        >
                           Dashboard
                        </Link> : null}
                    {is_session_expired ? (
                        <Link
                            href="/login"
                            className="text-green-500 text-xl mr-4 hover:text-yellowish"
                        >
                            Login / Sign Up
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="text-green-500 text-xl mr-4 hover:text-yellowish"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
