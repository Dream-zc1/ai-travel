import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      avatar?: string | null;
      bio?: string | null;
      region?: string | null;
      location?: string | null;
    };
  }

  interface User {
    role?: string;
    avatar?: string | null;
    bio?: string | null;
    region?: string | null;
    location?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    avatar?: string | null;
    bio?: string | null;
    region?: string | null;
    location?: string | null;
  }
}
