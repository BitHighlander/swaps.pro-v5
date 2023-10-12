import React, { useState, useEffect } from "react";

// @ts-ignore
import completedGif from "lib/assets/gif/completed.gif"; // Import the GIF here
// @ts-ignore
import shiftingGif from "lib/assets/gif/shifting.gif";

//@ts-ignore
const BeginSwap = ({ txHash }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const transactionUrl = "https://etherscan.io/tx/" + txHash; // Replace with your transaction URL

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsCompleted(true);
    }, 4000); // 4 seconds timeout

    return () => clearTimeout(timeoutId); // Clear the timeout if the component is unmounted
  }, []);

  return (
    <div>
      {isCompleted ? (
        <div>
          <img src={completedGif} alt="completedGif" />
          <a href={transactionUrl} target="_blank" rel="noopener noreferrer">
            View Transaction
          </a>
        </div>
      ) : (
        <div>
          Waiting for confirmations...
          <img src={shiftingGif} alt="shiftingGif" />
        </div>
      )}
    </div>
  );
};

export default BeginSwap;
