import React from "react";
import Dashboardheader from "../../components/layout/Dashboardheader";
import Footer from "../../components/layout/Footer";
import SpiralView from "../../components/spiralView/SpiralView";

function index() {
  return (
    <>
      <Dashboardheader />
      <SpiralView />
      <Footer />
    </>
  );
}

export default index;
