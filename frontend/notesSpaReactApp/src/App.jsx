import Header from "./components/page/Header.jsx";
import Body from "./components/page/Body.jsx";
import {useEffect, useState} from "react";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";


function App() {
    const [loginState, setLoginState] = useState(false);
    const [register, setRegister] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoginState(true);
            setRegister(false);
        }
    }, []);
    return (
        <div className="bg-[#003052] w-screen h-screen relative">
            <div className="flex flex-col items-center justify-center h-full">
                <Header setLoginState={setLoginState}/>
                <Body/>
            </div>
            {(!loginState || register) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                    {register ? (
                        <Register setLoginState={setLoginState} setRegister={setRegister}/>
                    ) : (
                        <Login setLoginState={setLoginState} setRegister={setRegister}/>
                    )}
                </div>
            ) : null}

        </div>
    )
}

export default App
