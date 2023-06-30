import { ipcRenderer } from "electron";

interface ClearSlotProps {
  slotNo: number;
  onClose: () => void;
}

const ClearSlot = ({ slotNo, onClose }: ClearSlotProps) => {
  function handleClearSlot() {
    ipcRenderer.invoke("unlockSlot", slotNo);
    onClose();
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <div className="text-xl text-[#ff2343]">clearing slot {slotNo}</div>
      <button
        className="p-3 bg-[#ff2343] text-white font-bold rounded-md"
        onClick={handleClearSlot}
      >
        Clear
      </button>
    </div>
  );
};

export default ClearSlot;
