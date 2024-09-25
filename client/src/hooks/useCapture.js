import { useContext } from "react";
import { CaptureContext } from "../context/CaptureProvider";

export const useCapture = () => {
    return useContext(CaptureContext)
}