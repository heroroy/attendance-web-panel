import './index.css'
import {Loginpage} from "./Pages/loginpage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SubjectPage} from "./Pages/subjectPage.tsx";
import {HomePage} from "./Pages/HomePage.tsx";

function App() {
    return (
        <div className='w-screen h-screen bg-amber-50 flex flex-row'>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Loginpage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/subject/:id" element={<SubjectPage/>}/>
                </Routes>
            </BrowserRouter>
            <h1>
                hehehe
            </h1>
        </div>

    )
}

export default App
