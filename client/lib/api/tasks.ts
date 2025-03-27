export async function fetchTasks() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status}`);
  }

  return response.json();
}

export async function fetchMyTasks() {
  // If you prefer a "my-tasks" route, for example:
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/my-tasks`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch my tasks: ${response.status}`);
  }

  return response.json();
}

export async function logoutUser() {
  // Adjust this to your logout endpoint if you have one
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to log out: ${response.status}`);
  }
}
