import { useContext } from "react";
import { FacialDataContext } from "../context/FacialDataProvider";

export const useFacialData = () => {
    return useContext(FacialDataContext)
}