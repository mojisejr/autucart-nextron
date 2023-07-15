import { useForm, SubmitHandler } from "react-hook-form";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { IO } from "../../enums/ipc-enums";

interface LockWaitProps {
  slotNo: number;
  hn: string;
}

const LockWait = ({ slotNo, hn }: LockWaitProps) => {
  useEffect(() => {
    ipcRenderer.invoke(IO.WaitForLockBack, slotNo, hn);
  }, []);

  return (
    <>
      <div className="">
        <div className="font-bold p-3 rounded-md shadow-md">
          HN: {hn} slot: {slotNo}
        </div>
      </div>
    </>
  );
};

export default LockWait;
