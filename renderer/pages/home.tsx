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
import { logEvents } from "../utils/event-log";
import Link from "next/link";

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
    if (slots !== undefined && slots.length > 0) {
      const found = slots.filter((s) => s.registered == true);
      if (slots.length > 0 && found.length > 0) {
        setDisableDispensing(false);
      } else {
        setDisableDispensing(true);
      }
    }

    ipcRenderer.on(DB.GetAllSlots, (event, slots) => {
      console.log("get slot states");
      console.log(slots);
      setSlotsData(slots);
      ipcRenderer.removeAllListeners(DB.GetAllSlots);
      // logEvents();
    });
  }, [slots]);

  useEffect(
    () => {
      ipcRenderer.on(DB.SlotRegistered, handleRegister);

      ipcRenderer.on(IO.Opening, handleOpening);

      ipcRenderer.on(IO.Closed, handleClosed);

      ipcRenderer.on(IO.Unlocked, handleUnlocked);

      ipcRenderer.on(IO.Dispensed, handleDispensed);

      ipcRenderer.on(IO.Dispensing, handleDispensing);

      ipcRenderer.on(IO.DispensingClosed, handleDispensingClosed);

      ipcRenderer.on(IO.DispensingFinished, handleDispensingFinished);

      ipcRenderer.on(DB.GetAllSlots, handleGetAllSlots);
    },

    [
      /*isLockWait.wait*/
    ]
  );

  const handleRegister = (
    event: Electron.IpcRendererEvent,
    id: number,
    hn: string
  ) => {
    console.log("REGISTERED");
    ipcRenderer.invoke(IO.Unlock, id, hn, true);
    setIsLockWait({ slot: id, hn, wait: true });
    logEvents();
  };

  const handleOpening = (
    event: Electron.IpcRendererEvent,
    id: number,
    hn: string
  ) => {
    console.log("OPENING");
    setIsLockWait({ slot: id, hn, wait: true });
    logEvents();
  };

  const handleClosed = (
    event: Electron.IpcRendererEvent,
    id: number,
    hn: string
  ) => {
    console.log("CLOSED");
    setIsLockWait({ slot: null, hn: null, wait: false });
    logEvents();
  };

  const handleUnlocked = (
    event: Electron.IpcRendererEvent,
    id: number,
    hn: string
  ) => {
    console.log("UNLOCKED");
    setIsLockWait({ slot: id, hn, wait: true });
    logEvents();
  };

  const handleDispensed = (
    event: Electron.IpcRendererEvent,
    id: number,
    hn: string
  ) => {
    console.log("Dispensed");
    setIsDispensingWait({ slot: id, hn: hn, wait: true });
    logEvents();
  };

  const handleDispensing = (
    event: Electron.IpcRendererEvent,
    id: number,
    hn: string
  ) => {
    ipcRenderer.off(IO.Dispensing, handleDispensing);
    console.log("DISPENSING");
    setIsDispensingWait({ slot: id, hn: hn, wait: true });
    logEvents();
  };

  const handleDispensingClosed = (
    event: Electron.IpcRendererEvent,
    id: number,
    hn: string
  ) => {
    ipcRenderer.off(IO.Dispensing, handleDispensing);
    console.log("DISPENSING CLOSED");
    setIsDispensingWait({ slot: id, hn: hn, wait: false });
    setIsDispensingClosed({ slot: id, hn: hn, open: true });
    logEvents();
  };

  const handleDispensingFinished = (
    event: Electron.IpcRendererEvent,
    id: number,
    hn: string
  ) => {
    ipcRenderer.off(IO.Dispensing, handleDispensing);
    console.log("DISPENSING FINISHED");
    setIsDispensingWait({ slot: id, hn: hn, wait: false });
    setIsDispensingClosed({ slot: id, hn: hn, open: false });
    logEvents();
  };

  const handleGetAllSlots = (event: Electron.IpcRendererEvent, slots) => {
    ipcRenderer.off(IO.Dispensing, handleDispensing);
    console.log("get slot states");
    console.log(slots);
    setSlotsData(slots);
    logEvents();
  };

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
              <Link href="/setting">
                <div className="flex justify-start items-center gap-2 p-2 hover:bg-gray-200 hover:rounded-md cursor-pointer">
                  <BsGear size={20} />
                  <span>Setting</span>
                </div>
              </Link>
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
            <>
              {slots === undefined ? (
                <div>Error: undefined</div>
              ) : (
                <>
                  {slots.length <= 0 ? (
                    <div>Loading...</div>
                  ) : (
                    <ul className="flex gap-2 flex-wrap">
                      {slots.map((s, index) => (
                        <Slot key={index} slotData={s} />
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>

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
