import Layout from '@/app/components/layout/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">The Evolution of Sports and Academics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">For Students</h2>
            <p className="mb-4 text-black">Join our platform to track your sports progress and connect with mentors.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">For Mentors</h2>
            <p className="mb-4 text-black">Share your expertise and guide the next generation of athletes.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
