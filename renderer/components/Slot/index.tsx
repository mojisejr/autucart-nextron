import { useState } from "react";
import LockedSlot from "./locked";
import EmptySlot from "./empty";
import Modal from "../Modals";
import ClearSlot from "../Dialogs/clearSlot";
import InputSlot from "../Dialogs/inputSlot";

interface SlotProps {
  slotData: {
    slotNo: number;
    locked: boolean;
    hn?: string;
    date?: string;
    time?: string;
  };
}

const Slot = ({ slotData }: SlotProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  function handleSlot() {
    if (openModal) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
  }

  return (
    <button onClick={handleSlot}>
      {slotData.locked ? (
        <LockedSlot
          slotNo={slotData.slotNo}
          hn={slotData.hn}
          date={slotData.date}
          time={slotData.time}
        />
      ) : (
        <EmptySlot slotNo={slotData.slotNo} />
      )}
      <Modal isOpen={openModal} onClose={handleSlot}>
        <>
          {slotData.locked ? (
            <ClearSlot slotNo={slotData.slotNo} onClose={handleSlot} />
          ) : (
            <InputSlot slotNo={slotData.slotNo} onClose={handleSlot} />
          )}
        </>
      </Modal>
    </button>
  );
};

export default Slot;
