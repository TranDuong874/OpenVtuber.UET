import '../../css/App.css';
import InputControl from './InputControl';
import InputDisplay from './InputDisplay';
import {useFacialData} from '../../context/FacialDataProvider';
import VideoUpload from '../my-ui/VideoUpload';

const InputPane = () => {
    return (  
        <div className="input-pane">
          <VideoUpload></VideoUpload>
          {/* <InputDisplay></InputDisplay>  */}
          {/* <InputControl></InputControl> */}
        </div>
    );
}
 
export default InputPane;