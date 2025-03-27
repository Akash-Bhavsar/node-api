"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTasks, logoutUser } from "@/lib/api/tasks";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        if (err instanceof Error) {
          // If 401 or 403, route user to /login
          if (err.message.includes("401") || err.message.includes("403")) {
            router.push("/login");
            return;
          }
          setError(err.message);
        } else {
          setError("Unknown error occurred while fetching tasks.");
        }
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/home");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-lightGreen p-4">
        <h2 className="text-xl font-semibold text-foreground">Loading tasks...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-redish p-4">
        <h2 className="text-xl font-semibold text-background">
          Error loading tasks: {error}
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-3xl bg-green-25  mx-auto rounded-md shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-redish hover:bg-redish text-white py-2 px-4 rounded focus:outline-none transition"
          >
            Logout
          </button>
        </div>

        {/* Task List */}
        <h2 className="text-xl font-semibold text-foreground mb-4">My Tasks</h2>
        {tasks.length === 0 ? (
          <div className="text-foreground">No tasks available.</div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 border border-yellowish rounded-lg shadow-sm"
              >
                <div className="font-bold text-lg text-foreground">{task.title}</div>
                <p className="text-foreground">{task.description}</p>
                <span
                  className={
                    task.status === "completed"
                      ? "text-greenish font-semibold"
                      : "text-orange-500 font-semibold"
                  }
                >
                  {task.status.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
