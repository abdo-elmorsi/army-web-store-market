import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const options = {
  providers: [
    CredentialsProvider({
      name: 'credentials',

      async authorize({ user }) {
        try {
          const userData = JSON.parse(user);
          return {
            name: { ...userData },
          };
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session }) {
      const { user: { name } } = session;
      session.user = name;
      return session;
    },

    jwt({ token, trigger, session }) {
      if (trigger === 'update' && session) {
        const { user } = session;
        token.name = user;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
  },
};

const authHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;