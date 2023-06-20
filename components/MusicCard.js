import React, { useState } from "react";

const MusicCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <div
        className="music--card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => props.toggleMusic(props.audio)}
      >
        <img
          className="music--card--image"
          src={props.cover}
          alt="Music Card"
        />
      </div>
    </div>
  );
};

export default MusicCard;
