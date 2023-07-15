import { useForm, SubmitHandler } from "react-hook-form";
import { MdQrCodeScanner } from "react-icons/md";
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";
import { useApp } from "../../contexts/appContext";
import { AUTHENTICATION } from "../../enums/ipc-enums";

type Inputs = {
  stuffId: string;
};

const Auth = () => {
  const { setUser } = useApp();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const user = await ipcRenderer.invoke(AUTHENTICATION.Login, data.stuffId);
    if (user != null || user != undefined) {
      toast(`loggedin! ${user.stuffId}`);
      setUser(user);
    } else {
      toast(`invalid user`);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="text-xl font-bold shadow-md p-3 rounded-md">Login</div>
        <form
          className="flex flex-col p-3 gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className="p-2 bg-gray-100 rounded-md text-[#000]"
            placeholder="STAFF ID"
            {...register("stuffId", { required: true })}
          ></input>
          <button
            className="font-bold p-2 bg-[#eee] hover:bg-[#5495F6] hover:text-white rounded-md"
            type="submit"
          >
            Login
            {/* <MdQrCodeScanner size={30} /> */}
          </button>
        </form>
      </div>
    </>
  );
};

export default Auth;
