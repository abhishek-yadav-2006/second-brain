import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null)

    const router = useNavigate()


    async function signup() {
        try {
            console.log("hi")
            const username = usernameRef.current?.value;
            const password = passwordRef.current?.value;
         const response   =    await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                password
            })
           
             const jwt = response.data.token;
            localStorage.setItem("token", jwt)
            console.log(jwt)
            alert("user signed up")
            router("/dashboard")

        }
        catch (err) {
            throw err
        }
    }



    return (
        <div className="flex h-screen w-screen justify-center bg-gray-200 items-center">

            <div className="border bg-white  rounded-xl min-w-48 p-8 ">
                <div className="p-1 mb-1 border">

                    <Input ref={usernameRef} placeholder="Username" />
                </div>
                <div className="p-1 border">

                    <Input ref={passwordRef} placeholder="Password" />
                </div>
                <div className="flex justify-center pt-4 items-center">
                    <Button text="Signup" onClick={signup} varient="primary" size="md" fullwidth={true} />
                </div>
            </div>

        </div>
    )
}