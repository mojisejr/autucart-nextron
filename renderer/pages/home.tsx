import React, { useEffect, useState } from "react";
import Head from "next/head";
import Slot from "../components/Slot";
import Image from "next/image";
import { ipcRenderer } from "electron";
import { BsBook, BsGear, BsQuestionCircle } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Modal from "../components/Modals";
import Auth from "../components/Dialogs/auth";
import LockWait from "../components/Dialogs/lockWait";
import DispenseSlot from "../components/Dialogs/dispenseSlot";
import DispensingWait from "../components/Dialogs/dispensingWait";

import { ISlot } from "../interfaces/slot";
import { DB, IO } from "../enums/ipc-enums";
import { useApp } from "../contexts/appContext";
import ClearOrContinue from "../components/Dialogs/clearOrContinue";

function Home() {
  const [slots, setSlotsData] = useState<ISlot[]>([]);
  const [openAuthModal] = useState<boolean>(true);
  const [openDispenseModal, setOpenDispenseModal] = useState<boolean>(false);
  const [disableDispensing, setDisableDispensing] = useState<boolean>(true);
  const [isLockWait, setIsLockWait] = useState<{
    slot?: number;
    hn?: string;
    wait: boolean;
  }>({ wait: false });

  const [isDispensingWait, setIsDispensingWait] = useState<{
    slot?: number;
    hn?: string;
    wait: boolean;
  }>({ wait: false });

  const [isDispensingClosed, setIsDispensingClosed] = useState<{
    slot?: number;
    hn?: string;
    open: boolean;
  }>({ open: false });

  const { user } = useApp();

  useEffect(() => {
    const found = slots.filter((s) => s.registered == true);
    if (slots.length > 0 && found.length > 0) {
      setDisableDispensing(false);
    } else {
      setDisableDispensing(true);
    }
  }, [slots]);

  useEffect(() => {
    ipcRenderer.on(DB.SlotRegistered, (event, id, hn) => {
      console.log("REGISTERED");
      ipcRenderer.invoke(IO.Unlock, id, hn, true);
      setIsLockWait({ slot: id, hn, wait: true });
    });

    ipcRenderer.on(IO.Opening, (event, id) => {
      console.log("OPENING");
      ipcRenderer.invoke(DB.GetAllSlots).then((slots: ISlot[]) => {
        const found = slots.filter((s) => s.id == id);
        setSlotsData(slots);
        setIsLockWait({ slot: found[0].id, hn: found[0].hn, wait: true });
      });
    });

    ipcRenderer.on(IO.Closed, (event, id, hn) => {
      console.log("CLOSED");
      ipcRenderer.invoke(DB.GetAllSlots).then((slots: ISlot[]) => {
        setSlotsData(slots);
        setIsLockWait({ slot: null, hn: null, wait: false });
      });
    });

    ipcRenderer.invoke(DB.GetAllSlots).then((slots) => {
      console.log("INITIAL");
      setSlotsData(slots);
    });

    ipcRenderer.on(IO.Unlocked, (event, id, hn) => {
      console.log("UNLOCKED");
      ipcRenderer.invoke(DB.GetAllSlots).then((slots) => {
        setIsLockWait({ slot: id, hn, wait: true });
        setSlotsData(slots);
      });
    });

    ipcRenderer.on(IO.Dispensing, (event, id, hn) => {
      console.log("DISPENSING");
      ipcRenderer.invoke(DB.GetAllSlots).then((slots: ISlot[]) => {
        setSlotsData(slots);
        setIsDispensingWait({ slot: id, hn: hn, wait: true });
      });
    });

    ipcRenderer.on(IO.DispensingClosed, (event, id, hn) => {
      console.log("DISPENSING CLOSED");
      ipcRenderer.invoke(DB.GetAllSlots).then((slots: ISlot[]) => {
        setSlotsData(slots);
        setIsDispensingWait({ slot: id, hn: hn, wait: false });
        setIsDispensingClosed({ slot: id, hn: hn, open: true });
      });
    });

    ipcRenderer.on(IO.DispensingFinished, (event, id, hn) => {
      console.log("DISPENSING FINISHED");
      ipcRenderer.invoke(DB.GetAllSlots).then((slots: ISlot[]) => {
        setSlotsData(slots);
        setIsDispensingWait({ slot: id, hn: hn, wait: false });
        setIsDispensingClosed({ slot: id, hn: hn, open: false });
      });
    });
  }, [isLockWait.wait]);

  const handleDispense = () => {
    setOpenDispenseModal(true);
  };

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
              {user != undefined ? (
                <div className="font-bold">User: {user.stuffId}</div>
              ) : null}
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
            <ul className="flex gap-2 flex-wrap">
              {slots.map((s, index) => (
                <Slot key={index} slotData={s} />
              ))}
            </ul>
            <button
              disabled={disableDispensing}
              onClick={() => handleDispense()}
              className="p-3 font-bold bg-[#eee] rounded-full shadow-xl hover:bg-[#5495F6] hover:text-[#fff] disabled:text-[#ddd] disabled:bg-[#eee]"
            >
              Dispense
            </button>
          </div>
        </div>
      </div>
      <ToastContainer limit={1} />
      {/* {!user ? (
        <>
          <Modal isOpen={openAuthModal} onClose={() => {}}>
            <Auth />
          </Modal>
        </>
      ) : null} */}
      <Modal
        isOpen={openDispenseModal}
        onClose={() => setOpenDispenseModal(false)}
      >
        <DispenseSlot onClose={() => setOpenDispenseModal(false)} />
      </Modal>
      <Modal isOpen={isLockWait.wait} onClose={() => {}}>
        <LockWait slotNo={isLockWait.slot} hn={isLockWait.hn} />
      </Modal>
      <Modal isOpen={isDispensingWait.wait} onClose={() => {}}>
        <DispensingWait
          slotNo={isDispensingWait.slot}
          hn={isDispensingWait.hn}
        />
      </Modal>
      <Modal isOpen={isDispensingClosed.open} onClose={() => {}}>
        <ClearOrContinue
          slotNo={isDispensingClosed.slot}
          hn={isDispensingClosed.hn}
          onClose={() => {}}
        />
      </Modal>
    </>
  );
}

export default Home;
