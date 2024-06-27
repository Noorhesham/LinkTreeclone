import React from "react";
import DisplayCard from "./DisplayCard";

const DisplyLinks = ({ links }: { links: any[] }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {links.map((link: any) => (
        <DisplayCard link={link} key={link._id} />
      ))}
    </div>
  );
};

export default DisplyLinks;
