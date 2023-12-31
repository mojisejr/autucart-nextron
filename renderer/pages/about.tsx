import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

import { BsBook, BsHouseDoor, BsQuestionCircle } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";
import Loading from "../components/Shared/Loading";

import { useApp } from "../contexts/appContext";
import Indicator from "../components/Indicators/battery";
import Navbar  from "../components/Shared/Navbar";

function About() {
  const { user, logged } = useApp();


  return (
    <>
      <Head>
        <title>Smart Medication Cart V1.0</title>
      </Head>
      <div className=" grid grid-cols-12 text-2xl text-center h-screen">
        <div className="col-span-2  flex flex-col justify-between">
          <div className="w-full px-3 py-10 flex flex-col gap-3 justify-center items-center">
            <Image
              src="/images/deprecision.png"
              width={86}
              height={85}
              alt="logo"
            />
            <Navbar active={3} />
       

               <div className="w-full px-3 flex  flex-col gap-2 justify-start items-center">
                <Indicator title="batt." value={98} unit="%"/>
                <Indicator title="temp." value={25} unit="*C"/>
                <Indicator title="humid." value={67} unit="%"/>
              </div>
          </div>
        </div>
        <div className="col-span-10 bg-[#F3F3F3] rounded-l-[50px]">
          <div className="w-full h-full p-[2rem] flex flex-col gap-[1.2rem] overflow-y-auto">
            <h1 className="text-5xl">ABOUT</h1>
            <div className="w-full h-full flex justify-center items-start">
                <div className="grid grid-cols-2 max-w-xl text-xl place-items-start">
                    <div>Application:</div>
                    <div>Smart Medication Cart</div>
                    <div>Version:</div>
                    <div>1.0</div>
                    <div>Copyright: </div>
                    <div>Deprecision.ltd</div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        limit={1}
        autoClose={1000}
        position="top-center"
        hideProgressBar
      />
   
    
    </>
  );
}

export default About;
