export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold">
                    Welcome to Task Manager
                </h1>
                <p className="text-gray-600">
                    Organize your tasks and boost your productivity.
                </p>
                <div>
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    <a href="/login">Login/Signup</a>
                  </button>
                </div>
            </main>
        </div>
    );
}
