import './index.css'
import {Loginpage} from "./Pages/loginpage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SubjectPage} from "./Pages/subjectPage.tsx";
import {HomePage} from "./Pages/HomePage.tsx";
import {useAppSelector} from "./redux/store.ts";
import AppBar from "./Component/AppBar.tsx";
import {ClassPage} from "./Pages/ClassPage.tsx";

function Attendance() {

    const {profile} = useAppSelector(state => state.auth)

    return (

        <div className='w-screen h-full flex flex-col items-center '>
            <BrowserRouter>
                {profile != null && <AppBar className='w-full sticky top-0 z-50'/> }
                <div className=' w-full p-20 flex flex-1 flex-col items-center'>
                    <Routes>
                        <Route path="/" element={<Loginpage/>}/>
                        <Route path="/home" element={
                            profile != null ? <HomePage/> : <Loginpage/>

                        }/>
                        <Route path="/subject/:id" element={<SubjectPage/>}/>
                        <Route path="/class/:id" element={<ClassPage/>}/>
                        <Route path="/*" element={<HomePage/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>

    )
}

export default Attendance
