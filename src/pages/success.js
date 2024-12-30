export default function Success() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase.</p>
        <a href="/" className="mt-4 text-blue-500 hover:underline">
          Go back to home
        </a>
      </div>
    );
  }
  