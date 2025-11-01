import type { ReactElement } from "react";

export function SidebarItem({ text, icon , onClick}: {
    text: string;
    icon?: ReactElement
    onClick: ()=> void
}) {


    return (
        <div className="flex items-center   py-2  bg-gray-200 hover:bg-gray-600 rounded-lg hover:cursor-pointer max-w-48 pl-4 " onClick={onClick} >

            <div className="pr-2 ">
                {icon}
            </div>
            <div className="pr-2">
                {text}
            </div>
        </div>
    )
} 