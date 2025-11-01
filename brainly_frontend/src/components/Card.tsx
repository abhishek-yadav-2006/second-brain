import { ShareIcon } from "../icons/ShareIcon";

import { Delete } from "../icons/Delete"
import axios from "axios";
import { BACKEND_URL } from "../config";
// import {Content} from "../compon"


interface CardProps {
  _id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
}


function deletecontent(id: string) {

  axios
    .delete(`${BACKEND_URL}/api/v1/content/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    })
    .then(() => {
      console.log("Content deleted:", id);
    })
    .catch((err) => {
      console.error("Delete failed", err);
    });
}



export function Card({ _id, title, link, type }: CardProps) {
  return (
    <div className="ml-6">
      <div className="bg-white   rounded-md max-w-72 p-4 min-h-48">
        <div className="flex justify-between items-center">
          <div className="flex items-center pr-2">
            
            {title}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-gray-500">
              <a href={link} target="_blank">
                <ShareIcon size="md" />
              </a>
            </div>
            <div className="text-gray-500 cursor-pointer" onClick={() => deletecontent(_id)}>
              <Delete size="md" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          {type === "youtube" && (
            <div className="w-full h-64 overflow-hidden rounded-md">
              <iframe
                className="w-full h-full"
                allowFullScreen
                src={link.replace("watch", "embed").replace("?v=", "/")}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          )}

          {type === "twitter" && (
            <div className="w-full h-64 overflow-auto rounded-md">
              <blockquote className="twitter-tweet">
                <a href={link.replace("x.com", "twitter.com")}></a>
              </blockquote>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}






