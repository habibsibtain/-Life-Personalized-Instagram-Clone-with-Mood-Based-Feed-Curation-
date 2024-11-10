import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      name?: string | null;
      email?: string | null;
    } 
  }
  interface User {
    _id?:  string;
    name: string;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
      _id?: string;
      name?: string | null;
      email?: string | null;
  }
}
