import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, Link } from "react-router-dom";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useNavigate();

  async function signin() {
    try {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/signin`,
        { username, password }
      );

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);

      alert("User signed in successfully");
      router("/dashboard");
    } catch (err) {
      alert("Invalid credentials or user not registered");
    }
  }

  return (
    <div className="flex h-screen w-screen justify-center bg-gray-200 items-center">
      <div className="border bg-white rounded-xl min-w-48 p-8">

        <div className="p-1 mb-2 border">
          <Input ref={usernameRef} placeholder="Username" />
        </div>

        <div className="p-1 mb-4 border">
          <Input ref={passwordRef} placeholder="Password" />
        </div>

        <Button
          text="Signin"
          onClick={signin}
          varient="primary"
          size="md"
          fullwidth={true}
        />

        
        <p className="text-sm text-center mt-4 text-gray-600">
          Not registered?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}
