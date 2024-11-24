import './index.css'
import {Loginpage} from "./Pages/loginpage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SubjectPage} from "./Pages/subjectPage.tsx";
import {HomePage} from "./Pages/HomePage.tsx";
import {Provider, ReactReduxContext} from "react-redux";
import {store} from "./redux/store.ts";
import AppBar from "./Component/AppBar.tsx";

function App() {
    return (
        <Provider store={store}>
            <div className='w-screen h-screen flex flex-col items-center'>
                <AppBar className='w-full'/>
                <BrowserRouter>
                    <div className='max-w-[1800px] p-16 flex flex-1 flex-col items-center'>
                        <Routes>
                            <Route path="/" element={<Loginpage/>}/>
                            <Route path="/home" element={<HomePage/>}/>
                            <Route path="/subject/:id" element={<SubjectPage/>}/>
                        </Routes>
                    </div>
                </BrowserRouter>
            </div>

        </Provider>
    )
}

export default App
