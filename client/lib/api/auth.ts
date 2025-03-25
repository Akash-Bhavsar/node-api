export async function loginUser(email: string, password: string) {
    // For example, call your Node backend at /api/login
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

    window.location.href = "/dashboard";
    return data;
}

// Function to check if the token is expired
// export function isTokenExpired(): boolean {
//     const expirationTime = localStorage.getItem("tokenExpiration");
//     if (!expirationTime) {
//         return true; // No expiration time, treat as expired
//     }

//     const expiration = parseInt(expirationTime, 10);
//     return new Date().getTime() > expiration;
// }

// // Function to remove token and redirect to login
// export function logoutUser() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("tokenExpiration");
//     window.location.href = "/login";
// }

// Add an interval to check token expiration periodically
    // setInterval(() => {
    //     if (isTokenExpired()) {
    //         alert("Your session has expired. Please log in again.");
    //         logoutUser();
    //     }
    // }, 60 * 1000); // Check every minute

export async function signupUser(email: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        // credentials: 'include'
    });

    if (!res.ok) {
        throw new Error("Signup failed");
    }
    return res.json();
}
