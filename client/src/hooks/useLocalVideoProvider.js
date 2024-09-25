import { useContext } from "react";
import { LocalVideoContext } from "../context/LocalVideoProvider";

export const useLocalVideo = () => {
    return useContext(LocalVideoContext)
}