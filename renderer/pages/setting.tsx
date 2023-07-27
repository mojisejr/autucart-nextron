import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { BsBook, BsGear, BsQuestionCircle } from "react-icons/bs";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { IO } from "../enums/ipc-enums";

const Setting = () => {
  const [portlist, setPortList] = useState<any>();

  useEffect(() => {
    ipcRenderer.invoke(IO.GetPortList);
    ipcRenderer.on(IO.UpdatePortList, (event, portlist) => {
      setPortList(portlist);
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
              {/* {user != undefined ? (
                <div className="font-bold">User: {user.stuffId}</div>
              ) : null} */}
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
            <div>Setting</div>
            <div>
              <select>
                <option></option>
                {portlist.map((p) => (
                  <option>{p.path}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
