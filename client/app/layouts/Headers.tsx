import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
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
                    <Link
                        href="/login"
                        className="text-green-500 text-xl mr-4 hover:text-yellowish"
                    >
                        Login/Sign Up
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
