import Header from "./components/page/Header.jsx";
import Body from "./components/page/Body.jsx";
import {useEffect, useState} from "react";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import {Alert, Snackbar} from "@mui/material";


function App() {
    const [loginState, setLoginState] = useState(false);
    const [register, setRegister] = useState(false);
    const [success, setSuccess] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);


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
                <Header setLoginState={setLoginState} categoriesList={categoriesList}
                        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                        refresh={refresh} setRefresh={setRefresh}
                        setCategoriesList={setCategoriesList}/>
                <Body setRefresh={setRefresh} refresh={refresh}
                      categoriesList={categoriesList}
                      selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}

                />
            </div>
            {(!loginState || register) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                    {register ? (
                        <Register setLoginState={setLoginState} setRegister={setRegister} setSuccess={setSuccess}/>
                    ) : (
                        <Login setLoginState={setLoginState} setRegister={setRegister} setRefresh={setRefresh}/>
                    )}
                </div>
            ) : null}

            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={success === true}
                autoHideDuration={2000}
                onClose={() => {
                    setSuccess(false)
                }}
            >
                <Alert severity="success">You Registered Correctly!</Alert>
            </Snackbar>
        </div>
    )
}

export default App
