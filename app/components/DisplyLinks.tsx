import React from "react";
import DisplayCard from "./DisplayCard";

const DisplyLinks = ({ links,theme }: { links: any[] ,theme?:string}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {links.map((link: any) => (
        <DisplayCard theme={theme} link={link} key={link._id} />
      ))}
    </div>
  );
};

export default DisplyLinks;
