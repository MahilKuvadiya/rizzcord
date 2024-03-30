import React from "react";

const LoadingChatComponent = () => {
  return (
    <>
      <div className="bg-pastel-primary dark:bg-dark-primary flex flex-col h-full">
        {/*Chat header*/}
        <div
          className="w-full text-md font-rilo font-semibold px-3 flex items-center h-12 border-pastel-third/60
        dark:border-dark-third/60 border-b-2 bg-pastel-primary transition shadow-md
        dark:bg-dark-primary"
        >
          <div className="text-pastel-third/40 flex animate-pulse items-center">
            <p className="w-5 h-5 bg-pastel-secondary/40 rounded-lg animate-pulse mr-2"></p>
            <p className="w-40 h-4 bg-pastel-secondary/40 rounded-lg animate-pulse"></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingChatComponent;
