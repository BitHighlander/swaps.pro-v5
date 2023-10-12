import React from "react";

const ForkMeBanner: React.FC = () => {
  return (
    <a
      href="https://github.com/BitHighlander/swaps.pro-v4"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        transform: "rotate(45deg)", // Rotate the image by 45 degrees
        transformOrigin: "bottom left", // Set the rotation origin
        position: "fixed",
        bottom: 0,
        left: 0,
        border: 0,
        zIndex: 9999, // Ensure it appears on top of other content
      }}
    >
      <img
        loading="lazy"
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_left_darkblue_121621.png"
        alt="Fork me on GitHub"
      />
    </a>
  );
};

export default ForkMeBanner;
