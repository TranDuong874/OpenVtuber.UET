import { useModel } from "./useModel"

export const useKizunaiiMapping = (facial_data) => {
    const {modelObject, setModelObject} = useModel();
    const {x, y, z} = facial_data.euler_angle;
}