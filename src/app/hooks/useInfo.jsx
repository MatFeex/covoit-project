import {useContext} from "react";
import InfoContext from "../context/InfoContext";

const useInfo = () => {
    return useContext(InfoContext);
}

export default useInfo;
