import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

declare module "next-auth" {
  /**
   * セッション型を拡張
   */
  interface Session {
    accessToken?: string;
		user?: User;
  }

  /**
   * ユーザー型を拡張
   */
  interface User {
    id?: string;
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
			profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.picture,
        };
      },
		}),
	],
	session: {
    strategy: "jwt",
    maxAge: 60 * 24 * 24
  },
	secret: process.env.NEXT_PUBLIC_SECRET || '',
  callbacks: {
		async jwt({ token, account, user }) {
			if (account && account.access_token && user) {
				token.id = user.id;
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.accessToken && token.id) {
				session.accessToken = token.accessToken as string;
				session.user = { ...session.user, id: String(token.id) };
			}
			return session;
		},
		async signIn({ user, account }) {
			const provider = account?.provider;
			const uid = user?.id;
			const name = user?.name;
			const avatar_url = user?.image; 
			
			try {
				const response = await axios.post(
					`${apiUrl}/auth/${provider}/callback`,
					{
						provider,
						uid,
						name,
						avatar_url
					}
				);
        console.log('Received response from backend:', response);
				if (response.status === 200) {
					return true;
				} else {
					return false;
				}
			} catch (error) {
				return false;
			}
		},
	},
});
export { handler as GET, handler as POST };
