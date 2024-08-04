import { useContext } from "react";
import { ModelContext } from "../context/ModelProvider";

export const useModel = () => {
    return useContext(ModelContext)
}