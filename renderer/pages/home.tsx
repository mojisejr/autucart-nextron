import React, { useEffect, useState } from "react";
import Head from "next/head";
import Slot from "../components/Slot";
import Image from "next/image";
import { BsBook, BsGear, BsQuestionCircle } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ipcRenderer } from "electron";
import { ISlot } from "../interfaces/slot";

function Home() {
  const [slots, setSlotsData] = useState<ISlot[]>([]);

  useEffect(() => {
    ipcRenderer.invoke("getSlotsState").then((slots) => {
      setSlotsData(slots);
    });
    ipcRenderer.on("locked", (event, args) => {
      ipcRenderer.invoke("getSlotsState").then((slots) => {
        setSlotsData(slots);
      });
    });

    ipcRenderer.on("unlocked", (event, args) => {
      ipcRenderer.invoke("getSlotsState").then((slots) => {
        setSlotsData(slots);
      });
    });
  }, []);
  return (
    <>
      <Head>
        <title>Smart Drug Cart V1.0</title>
      </Head>
      <div className=" grid grid-cols-12 text-2xl text-center h-screen">
        <div className="col-span-2">
          <div className="w-full p-[2rem] flex flex-col gap-3 justify-center items-center">
            <Image
              src="/images/deprecision.png"
              width={85}
              height={85}
              alt="logo"
            />
            <div className="flex flex-col gap-2 text-[16px]">
              <div className="font-bold">Main Menu</div>
              <button className="flex justify-start items-center gap-2 p-2 hover:bg-gray-200 hover:rounded-md">
                <BsGear size={20} />
                <span>Setting</span>
              </button>
              <button className="flex justify-start items-center gap-2 p-2 hover:bg-gray-200 hover:rounded-md">
                <BsBook size={20} />
                <span>Documents</span>
              </button>
              <button className="flex justify-start items-center gap-2 p-2 hover:bg-gray-200 hover:rounded-md">
                <BsQuestionCircle size={20} />
                <span>About</span>
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-10 bg-[#F3F3F3] rounded-l-[50px]">
          <div className="w-full h-full p-[2rem] flex flex-col gap-[1.2rem]">
            <div className="self-start font-bold text-3xl">Drawers</div>
            <ul className="flex gap-2">
              {slots.map((s, index) => (
                <Slot key={index} slotData={s} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Home;
