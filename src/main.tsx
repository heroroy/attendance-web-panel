import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {store} from "./redux/store.ts";
import {Provider} from "react-redux";
import 'rsuite/dist/rsuite.min.css';
import Attendance from "./App.tsx";
createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <Attendance/>
        </StrictMode>
    </Provider>
)
