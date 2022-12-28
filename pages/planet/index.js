import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Conditionalheader from "../../components/layout/Conditionalheader";
import Planet from "../../components/planet/Planet";

function index() {
  return (
    <>
      <Conditionalheader />
      <Planet />
    </>
  );
}

export default index;
