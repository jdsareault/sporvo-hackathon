import Layout from '@/app/components/layout/Layout'

export default function NotFound() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <h2 className="text-2xl mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <a
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Go Home
                </a>
            </div>
        </Layout>
    )
} 