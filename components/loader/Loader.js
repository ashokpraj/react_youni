import React from "react";

function Loader() {
  return (
    <>
      <div className="cssloader_main">
        {" "}
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>{" "}
        </div>{" "}
      </div>
    </>
  );
}

export default Loader;
