import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {Loginpage} from "./Pages/loginpage.tsx";
import {Route , Routes} from "react-router-dom";
import {SubjectPage} from "./Pages/subjectPage.tsx";
import {HomePage} from "./Pages/HomePage.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Routes>
            <Route path="/login" element={<Loginpage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/subject/:id" element={<SubjectPage/>}/>
        </Routes>
      {/*<Loginpage/>*/}
    </>
  )
}

export default App
