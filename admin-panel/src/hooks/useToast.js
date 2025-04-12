import { toast } from 'react-toastify';

const useToast = () => {
    const notifySuccess = (message) => {
        toast.success(message);
    };

    const notifyError = (message) => {
        toast.error(message);
    };

    const notifyInfo = (message) => {
        toast.info(message);
    };

    const notifyWarning = (message) => {
        toast.warning(message);
    };

    return { notifySuccess, notifyError, notifyInfo, notifyWarning };
};

export default useToast;
