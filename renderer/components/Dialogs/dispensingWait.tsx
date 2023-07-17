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
    ipcRenderer.invoke(IO.WaitForDispensingLockBack, slotNo, hn);
  }, []);

  return (
    <>
      <div className="">
        <div className="font-bold p-3 rounded-md shadow-md">
          Dispensing ... lock back to clear or continue.
        </div>
      </div>
    </>
  );
};

export default DispensingWait;
