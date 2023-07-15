import { FaLock } from "react-icons/fa";
interface LockedSlotProps {
  slotNo: number;
  hn: string;
  date: string;
  time: string;
}

export const LockedSlot = ({ slotNo, hn, date, time }: LockedSlotProps) => {
  return (
    <div className="relative min-w-[150px] min-h-[137px] bg-[#F6F6F6] shadow-xl rounded-xl p-3 cursor-default">
      <div className="flex justify-between">
        <div className="font-bold">HN</div>
        <div>
          <FaLock className="fill-[#00ff55]" size={25} />
        </div>
      </div>
      <div className="flex flex-col pt-3 justify-start items-start">
        <div className="font-bold text-[#5495f6]">{hn}</div>
      </div>
      <div className="flex flex-col leading-4 pt-2 items-start">
        <div className="text-[12px]">{date}</div>
        <div className="text-[12px]">{time}</div>
      </div>
      <div className="absolute bottom-2 right-2 text-[#5495F6] text-[40px] font-bold">
        {slotNo}
      </div>
    </div>
  );
};

export default LockedSlot;
