import { useForm, SubmitHandler } from "react-hook-form";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { IO } from "../../enums/ipc-enums";

interface DispensingWaitProps {
  slotNo: number;
  hn: string;
}

const DispensingWait = ({ slotNo, hn }: DispensingWaitProps) => {
  useEffect(() => {
    ipcRenderer.invoke(IO.WaitForLockBack, slotNo, hn);
  }, []);

  function handleClear() {}
  function handleContinue() {}

  return (
    <>
      <div className="">
        <div className="font-bold p-3 rounded-md shadow-md">
          <button>Clear</button>
          <button>Continue</button>
        </div>
      </div>
    </>
  );
};

export default DispensingWait;
