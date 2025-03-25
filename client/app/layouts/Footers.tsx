import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-green-50 text-white p-4">
            <div className="container mx-auto flex items-center justify-center">
            <p className="text-green-500 text-xl">
            © {new Date().getFullYear()} Task Manager. All rights reserved.
            </p>
            </div>
        </footer>
    );
};

export default Footer;
