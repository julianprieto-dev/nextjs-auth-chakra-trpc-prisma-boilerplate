import React from "react";
import { getUserFromLocalStorage, removeUserFromLocalStorage, setUserToLocalStorage } from "utils/common";
import { trpc } from "utils/trpc";

export interface ContextUser {
  id: string;
  name: string | null;
  email: string;
  accessToken: string;
}

export type AuthContextType = {
  user: ContextUser | null;
  login: (email: string, password: string) => Promise<ContextUser>;
  register: (name: string, email: string, password: string) => Promise<ContextUser>;
  logout: () => Promise<void>;
};

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = React.useState<ContextUser | null>(getUserFromLocalStorage());
  const register = trpc.useMutation("user.register");
  const login = trpc.useMutation("user.login");

  const handleRegister = (name: string, email: string, password: string): Promise<ContextUser> => {
    return new Promise((resolve, reject) => {
      register.mutate(
        { name, email, password },
        {
          onSuccess: (response) => {
            setUserToLocalStorage(response);
            setUser(response);
            resolve(response);
          },
          onError: () => {
            reject("Error registering user.");
          },
        }
      );
    });
  };

  const handleLogin = (email: string, password: string): Promise<ContextUser> => {
    return new Promise((resolve, reject) => {
      login.mutate(
        { email, password },
        {
          onSuccess: (response) => {
            setUserToLocalStorage(response);
            setUser(response);
            resolve(response);
          },
          onError: () => {
            reject("Error registering user.");
          },
        }
      );
    });
  };

  const handleLogout = (): Promise<void> => {
    return new Promise((resolve) => {
      setUser(null);
      removeUserFromLocalStorage();
      resolve();
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
