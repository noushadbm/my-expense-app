import React, { createContext, useState, ReactNode } from "react";

export type LoggedInUserData = {
  id: number;
  name: string;
  email: string;
  loggedInTime: Date;
};

type AuthContextType = {
  loggedInUser: LoggedInUserData | null;
  login: (username: string, password: string) => Promise<LoggedInUserData>;
  logout: (id: string) => void;
};

export const AuthContext = createContext<AuthContextType>({
    loggedInUser: null,
    login: async () => ({ id: 0, name: '', email: '', loggedInTime: new Date() }),
    logout: () => {},
});

type ProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: ProviderProps) => {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUserData | null>(null);

  const login = async (username: string, password: string): Promise<LoggedInUserData> => {
    // Example: replace with real API request
    const response = await fakeApiLogin(username, password);
    const user: LoggedInUserData = { ...response.user, loggedInTime: new Date() };
    setLoggedInUser(user);
    console.log("User logged in:", user);
    return user; // 👈 return so caller can wait
  };
  const logout = () => setLoggedInUser(null);

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Fake API for demo
const fakeApiLogin = (username : string, password: string) =>
  new Promise<{ user: { id: number; name: string; email: string } }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          user: { id: 1, name: "Abdul", email: 'test@test.com' },
        }),
      1000
    )
);