import { Dispatch } from "@reduxjs/toolkit";
import { Properties } from "csstype";
import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Api from "@/Api";
import { loginThunk } from "@/store/reducer/user";

const style: { [key: string]: Properties } = {
  container: {
    width: "100%",
    textAlign: "center",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  Wrapper: {
    maxWidth: "400px",
    width: "90vw",
    margin: "0 auto",
    position: "relative",
  },
  Title: {
    fontSize: "revert",
    fontWeight: "initial",
  },
  AvatarContainer: {
    left: "31%",
    bottom: "100%",
    textAlign: "center",
  },
};

export function LoginPage() {
  useAuth();
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername("");
  }, []);
  const [password, setPassword] = useState("1");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch<any>>();
  const toast = useToast();
  async function handleLogin() {
    if (!username || !password) {
      toast({
        title: "Warning.",
        description: "Please Input Username & password.",
        status: "error",
        position: "top",
        duration: 1000,
      });
      return;
    }
    dispatch(
      loginThunk({
        username,
        password,
      })
    );
  }
  function handleRegister() {
    return navigate("/register");
  }
  async function handleInputUsername(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setUsername(input);
    const userImage = await Api.getUserImage(input);
    setImageUrl(userImage);
  }
  return (
    <div style={style.container} data-testid="login">
      <div style={style.Wrapper}>
        <div style={style.AvatarContainer}>
          <Avatar size="xl" name="?" src={imageUrl} />
        </div>
        <h1 style={style.Title}>Login</h1>
        <FormControl id="username" isRequired>
          <FormLabel>User Name</FormLabel>
          <Input
            type="text"
            autoComplete="true"
            autoFocus
            value={username}
            onChange={handleInputUsername}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="button">
          <FormLabel></FormLabel>
          <Stack spacing={2} direction="row" align="center">
            <Button onClick={handleLogin} colorScheme="green">
              Login
            </Button>
            <Button
              onClick={handleRegister}
              colorScheme="green"
              variant="outline"
            >
              Register
            </Button>
          </Stack>
        </FormControl>
      </div>
    </div>
  );
}
