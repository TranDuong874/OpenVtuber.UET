import '../../css/App.css';
import InputControl from './InputControl';
import InputDisplay from './InputDisplay';

const InputPane = () => {
    return (  
        <div className="input-pane">
          {/* <InputDisplay></InputDisplay>  */}
          <InputControl></InputControl>
        </div>
    );
}
 
export default InputPane;