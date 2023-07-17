import { ipcRenderer } from "electron";
import { IO } from "../../enums/ipc-enums";

interface ClearOrContinueProps {
  slotNo: number;
  hn: string;
  onClose: () => void;
}

const ClearOrContinue = ({ slotNo, hn, onClose }: ClearOrContinueProps) => {
  function handleClear() {
    // console.log("clear");
    ipcRenderer.invoke(IO.DispensingClear, slotNo, hn);
    onClose();
  }
  function handleContinue() {
    ipcRenderer.invoke(IO.DispensingContinue, slotNo, hn);
    onClose();
  }

  return (
    <>
      <div className="">
        <div className="font-bold p-3 rounded-md shadow-md">
          <button className="p-3 bg-gray-200" onClick={() => handleClear()}>
            Clear
          </button>
          <button className="p-3 bg-gray-200" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default ClearOrContinue;
