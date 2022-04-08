import type { NextPage } from "next";
import { useColorMode, Button, Input, Alert, Box } from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useState } from "react";
import useAuth from "hooks/useAuth";

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [resultMessage, setResultMessage] = useState("");

  const { user, login, register, logout } = useAuth();

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const users = trpc.useQuery(["user.all"]);

  const handleRegister = async () => {
    const { name, email, password } = registerForm;
    const registerResult = await register(name, email, password);
    setResultMessage("registerResult:" + JSON.stringify(registerResult));
  };

  const handleLogin = async () => {
    const { email, password } = loginForm;
    const loginResult = await login(email, password);
    setResultMessage("loginResult:" + JSON.stringify(loginResult));
  };

  if (!users.data) {
    return <>Loading...</>;
  }

  return (
    <div>
      <Button onClick={toggleColorMode}>Toggle {colorMode === "light" ? "Dark" : "Light"}</Button>
      <Box w="100%" p={4}>
        <Alert status="success">
          <pre>User: {JSON.stringify(user, null, 2)}</pre>
        </Alert>
        {resultMessage && <Alert status="info">{resultMessage}</Alert>}
        {user && (
          <Button colorScheme="red" onClick={() => logout()}>
            Logout
          </Button>
        )}
      </Box>
      {!user && (
        <>
          <h1>Register:</h1>
          <Input
            placeholder="Name"
            value={registerForm.name}
            onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Input
            placeholder="Email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
          />
          <Button onClick={handleRegister}>Create user</Button>
          <h1>Login:</h1>
          <Input
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
          />
          <Button onClick={handleLogin}>Login user</Button>
        </>
      )}
    </div>
  );
};

export default Home;
