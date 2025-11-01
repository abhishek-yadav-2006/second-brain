
import { useRef, useState } from "react"
import { CrossIcon } from "../icons/CrossIcon"
import { Button } from "./Button"
import { Input } from "./Input"
import axios from "axios"
import { BACKEND_URL } from "../config"



export function CreateContentModel({ open, onClose }) {
    const titleRef = useRef<HTMLInputElement>(null)
    const linkRef = useRef<HTMLInputElement>(null)
    const [type, setType] = useState("youtube")
    function addcontent() {
        const title = titleRef.current?.value
        const link = linkRef.current?.value
         axios.post(`${BACKEND_URL}/api/v1/content`, {
            link,
            title,
            type
         }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
         })

    }
    return (
        <div>
            {open && <div>
                <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center" >

                  
                </div>
                <div className="w-screen h-screen  fixed top-0 left-0  flex justify-center" >

                      <div className="flex justify-center items-center">

                        <div className="bg-white opacity-100 border p-4 rounded">
                            <div className="flex justify-end pt-0 pb-1 cursor-pointer" onClick={onClose}>
                                <CrossIcon size="lg" />
                            </div>
                            <div className=" m-1 pt-2 border">
                                <Input ref={titleRef} placeholder={"title"} />

                            </div>
                            <div className=" m-1 pt-2 border">
                                <Input ref={linkRef} placeholder={"link"} />

                            </div>
                            <h1>type</h1>
                            <div className="flex gap-4 p-2 ">

                                <Button text="Youtube" size="md" varient={type === "youtube" ? "primary" : "secondary"} onClick={() => { setType("youtube") }} />
                                <Button text="Twitter" size="md" varient={type === "twitter" ? "primary" : "secondary"} onClick={() => { setType("twitter") }} />
                            </div>

                            <div className="flex  justify-center">

                                <Button size="md" onClick={addcontent} varient="primary" text="Submit" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

