import { ContextUser } from "contexts/AuthContext";

export const getUserFromLocalStorage = (): ContextUser | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? "") : null;
  }
  return null;
};

export const setUserToLocalStorage = (user: ContextUser) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const removeUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};
