import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
// Import any other providers you want to use

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Add other providers here
  ],
  // Add any additional NextAuth configuration options here
  pages: {
    signIn: '/auth/signin',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // signOut: '/auth/signout'
  },
})

export { handler as GET, handler as POST } 