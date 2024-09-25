import InputPane from './components/input-viewer/InputPane.js';
import AnimPane from './components/mmd-viewer/AnimPane.js';
import ModelFileTree from './components/mmd-viewer/ModelFileTree.js';


import './css/App.css';

function App() {
  return (
    <div className="App">
        <ModelFileTree></ModelFileTree>
        <AnimPane></AnimPane>
        <InputPane></InputPane>
    </div>
  );
}

export default App;
