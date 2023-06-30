import { useForm, SubmitHandler } from "react-hook-form";
import { MdQrCodeScanner } from "react-icons/md";
import { ipcRenderer } from "electron";

type Inputs = {
  hn: string;
};

interface InputSlotProps {
  slotNo: number;
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
    ipcRenderer.invoke("lockSlot", slotNo, data.hn);
    onClose();
  };

  return (
    <>
      <form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="p-2 bg-gray-100 rounded-md text-[#000]"
          placeholder="patient Id"
          {...register("hn", { required: true })}
        ></input>
        <button type="submit">
          <MdQrCodeScanner size={30} />
        </button>
      </form>
    </>
  );
};

export default InputSlot;
