import { useState } from "react";
import LockedSlot from "./locked";
import EmptySlot from "./empty";
import Modal from "../Modals";
import InputSlot from "../Dialogs/inputSlot";

interface SlotProps {
  slotData: {
    id?: string;
    locked: boolean;
    hn?: string;
    timestamp?: Date;
    registered: boolean;
  };
}

const Slot = ({ slotData }: SlotProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  function handleSlot() {
    if (slotData.locked && !slotData.registered)
      if (openModal) {
        setOpenModal(false);
      } else {
        setOpenModal(true);
      }
  }

  return (
    <button onClick={handleSlot}>
      {slotData.locked && slotData.registered ? (
        <LockedSlot
          slotNo={slotData.id}
          hn={slotData.hn}
          date={new Date(slotData.timestamp).toLocaleDateString()}
          time={new Date(slotData.timestamp).toLocaleTimeString()}
        />
      ) : (
        <EmptySlot slotNo={slotData.id} />
      )}
      <Modal isOpen={openModal} onClose={handleSlot}>
        <InputSlot slotNo={slotData.id} onClose={handleSlot} />
      </Modal>
    </button>
  );
};

export default Slot;
