import { useContext } from "react";
import { AuthContext, AuthContextType } from "contexts/AuthContext";

const useAuth = () => {
  const { user, login, register, logout } = useContext(AuthContext) as AuthContextType;

  return {
    user,
    login,
    register,
    logout,
  };
};

export default useAuth;
