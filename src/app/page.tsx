import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Next.js</h1>
        <p className="text-center text-gray-600">
          This is a sample Next.js application created with App Router.
        </p>
      </main>
    </div>
  );
}