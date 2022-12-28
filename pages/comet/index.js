import React from "react";
import Comet from "../../components/comet/Comet";
import Conditionalheader from "../../components/layout/Conditionalheader";

function index() {
  return (
    <>
      <Conditionalheader />
      <Comet />
    </>
  );
}

export default index;
