import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Use Prisma to find the user by username
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          // If user is not found, return null
          if (!user) {
            return null;
          }

          // Compare the provided password with the stored hashed password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (isPasswordValid) {
            // Return the user data to include in the session
            return {
              id: user.id.toString(),
              name: user.username,
              username: user.username,
              role: user.role
            };
          } else {
            // If the password is invalid, return null
            return null;
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: '/login', // Redirect to a custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        username: token.username as string,
        role: token.role as string,
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
