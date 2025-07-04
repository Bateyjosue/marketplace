'use client'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">About Marketplace Clone</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          This project is a learning exercise that recreates core features of Facebook&nbsp;Marketplace using Next.js&nbsp;14, React&nbsp;Server&nbsp;Components, Supabase, and Tailwind&nbsp;CSS.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Our Goal</h2>
        <p>
          Provide a familiar buying and selling experience while exploring modern web-development techniques such as the Next.js&nbsp;App&nbsp;Router, server actions, remote image storage with Supabase, and optimistic UI updates.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tech Stack</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Next.js&nbsp;14 with the App&nbsp;Router</li>
          <li>React Server & Client components</li>
          <li>Supabase (PostgreSQL + Storage)</li>
          <li>Tailwind&nbsp;CSS & Shadcn/ui components</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Features Implemented</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Listing creation with image upload and live preview</li>
          <li>Category filters and search</li>
          <li>Listing details with messaging dialog</li>
          <li>Email-based messaging (placeholder)</li>
          <li>Responsive pixel-perfect design inspired by Facebook Marketplace</li>
        </ul>
      </section>

      <footer className="text-center text-sm text-gray-400 pt-10 border-t">
        © {new Date().getFullYear()} Marketplace Clone – Built for demo purposes only.
      </footer>
    </div>
  )
} 