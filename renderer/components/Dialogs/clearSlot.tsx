import { useForm, SubmitHandler } from "react-hook-form";
import { MdQrCodeScanner } from "react-icons/md";
import { ipcRenderer } from "electron";

type Inputs = {
  hn: string;
};

interface ClearSlotProps {
  onClose: () => void;
}

const ClearSlot = ({ onClose }: ClearSlotProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    ipcRenderer.invoke("unlockSlot", data.hn, true);
    onClose();
  };

  return (
    <>
      <div className="font-bold p-3 rounded-md shadow-md">Dispensing</div>
      <form
        className="flex gap-2 flex-col p-3 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="p-2 bg-gray-100 rounded-md text-[#000]"
          placeholder="patient Id"
          {...register("hn", { required: true })}
        ></input>
        <button
          className="font-bold p-2 bg-[#eee] hover:bg-[#F9324A] hover:text-white rounded-md"
          type="submit"
        >
          Despensing
          {/* <MdQrCodeScanner size={30} /> */}
        </button>
      </form>
    </>
  );
};

export default ClearSlot;
