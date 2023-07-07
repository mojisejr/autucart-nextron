import { useForm, SubmitHandler } from "react-hook-form";
import { MdQrCodeScanner } from "react-icons/md";
import { ipcRenderer } from "electron";

type Inputs = {
  hn: string;
};

interface InputSlotProps {
  slotNo: string;
  onClose: () => void;
}

const InputSlot = ({ slotNo, onClose }: InputSlotProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    ipcRenderer.invoke("lockSlot", slotNo, data.hn, true);
    onClose();
  };

  return (
    <>
      <div className="">
        <div className="font-bold p-3 rounded-md shadow-md">
          Slot #{slotNo} - Register
        </div>
        <form
          className="flex flex-col gap-2 p-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className="p-2 bg-gray-100 rounded-md text-[#000]"
            placeholder="patient Id"
            {...register("hn", { required: true })}
          ></input>
          <button
            className="font-bold p-2 bg-[#eee] hover:bg-[#5495F6] hover:text-white rounded-md"
            type="submit"
          >
            Confirm
            {/* <MdQrCodeScanner size={30} /> */}
          </button>
        </form>
      </div>
    </>
  );
};

export default InputSlot;
