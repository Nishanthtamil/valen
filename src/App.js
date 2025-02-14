import React from "react";
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import LandingPage from "./components/LandingPage";
import Stage1 from "./components/Stage1";
import Stage2 from "./components/Stage2";
import Stage3 from "./components/Stage3";
import Stage4 from "./components/Stage4";
import FinalDiaryScene from "./components/FinalDiaryScene";

function App() {
  return (
    <Router>
      <Routes>
        <Route path ='/' element={<LandingPage />}/>
        <Route path='/Stage1' element={<Stage1 />}/>
        <Route path='/Stage2' element={<Stage2/>}/>
        <Route path='/Stage3' element={<Stage3/>}/>
        <Route path='/Stage4' element={<Stage4/>}/>
        <Route path='/FinalDiaryScene' element={<FinalDiaryScene/>}/>
      </Routes>
    </Router>
  );
}

export default App;
