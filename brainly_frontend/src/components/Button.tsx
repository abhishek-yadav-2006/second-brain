import type { ReactElement } from "react"


type varients = "primary" | "secondary"

export interface ButtonProps {
    varient: varients,
    size: "sm" | "md" | "lg",
    text: string,
    startIcon?: any | ReactElement,
    endIcon?: any | ReactElement,
    onClick: () => void,
    fullwidth?: boolean
}

const varientstyles = {
    "primary": "bg-gradient-to-r from-[#3A0CA3] via-[#7209B7] to-[#F72585] rounded-md hover:from-[#7209B7] hover:to-[#F72585] transition-all duration-300  text-white  ",
    "secondary": "bg-purple-300 text-purple-600 "
}

const sizeStyles = {
    "sm": "py-1 px-2 rounded-xl",
    "md": "py-2 px-4 rounded-md",
    "lg": "py-4 px-6 rounded-sm"
}

// const defaultStyles = "rounded-md"


export function Button(props: ButtonProps) {
    return <button onClick={props.onClick} className={`${varientstyles[props.varient]} ${varientstyles} ${sizeStyles[props.size]} ${props.fullwidth? "w-full flex justify-center items-center": ""} `}>
        <div className=" flex  justify-center items-center" >
            {props.startIcon ? <div className="pr-2  flex items-center pt-50% ">


                {props.startIcon}</div> : null}{props.text} {props.endIcon}
        </div>


    </button>
}

{/* <Button varient="primary" size= "md" onclick={()=> {}} text={"sdf"} /> */ }