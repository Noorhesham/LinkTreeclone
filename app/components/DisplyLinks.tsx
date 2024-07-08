import React from "react";
import DisplayCard from "./DisplayCard";

const DisplyLinks = ({ links,theme }: { links: any[] ,theme?:string}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {links.map((link: any,i:number) => (
        <DisplayCard theme={theme} link={link} key={i} />
      ))}
    </div>
  );
};

export default DisplyLinks;
