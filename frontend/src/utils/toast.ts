import toast from "react-hot-toast";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: "top-center",
  });
};
export const toastError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: "top-center",
  });
};
