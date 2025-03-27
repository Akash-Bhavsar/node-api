'use client'
import { useState, useEffect } from 'react';

export async function loginUser(username: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }
    const data = await res.json();

    localStorage.setItem("token", data.token);

    // Set token expiration in localStorage
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now
    localStorage.setItem("tokenExpiration", expirationTime.toString());
    return data;
}

// Function to check if the token is expired
export function isTokenExpired(): boolean {
    const expirationTime = localStorage.getItem("tokenExpiration");
    if (!expirationTime) {
        return true; // No expiration time, treat as expired
    }

    const expiration = parseInt(expirationTime, 10);
    return new Date().getTime() > expiration;
}

// Function to remove token and redirect to login
export function logoutUser() {
    localStorage.removeItem("tokenExpiration");
    window.location.href = "/login";
}

// Add an interval to check token expiration periodically
// Custom hook to manage session status
export function useSessionStatus() {
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        const checkSession = () => {
            if (isTokenExpired()) {
                console.log("Your session has expired. Please log in again.");
                logoutUser();
                setIsSessionExpired(true);
            } else {
                setIsSessionExpired(false);
            }
        };

        // Check session initially
        checkSession();

        // Check session every minute
        const intervalId = setInterval(checkSession, 60 * 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return isSessionExpired;
}

export async function signupUser(email: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error("Signup failed");
    }
    return res.json();
}

export async function listTasks() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
         },
         credentials: 'include'
    });

    if (!res.ok) {
        throw new Error("List tasks failed");
    }
    return res.json();
}
