import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {auth} from "../../services/api.js";
import {Alert, Snackbar} from "@mui/material";

const Login = ({setLoginState, setRegister, setRefresh}) => {
    const [result, setResult] = useState('');
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm();

    const RegisterButton = () => {
        setLoginState(true);
        setRegister(true)
        console.log("Register button")
    }

    const onSubmit = async (data) => {
        await new Promise(resolve => setTimeout(resolve, 600));
        try {
            const response = await auth.login({
                identifier: data.identifier,
                password: data.password
            });
            console.log("LOGIN RESPONSE:", response.data);
            localStorage.setItem('token', response.data.accessToken);
            setLoginState(true)

            setRefresh(true);
            await new Promise(resolve => setTimeout(resolve, 600));
            setRefresh(false);

            console.log('Login successful!');
            setResult('success')
        } catch (error) {
            console.error('Login failed:', error.response?.data);
            setResult('error')
        }
    }


    return (
        <>
            <div className="w-screen h-screen bg-gray-500/10 shadow-lg backdrop-blur-sm z-10"></div>
            <div
                className="rounded-xl bg-gray-800/50 px-16 py-10 shadow-lg backdrop-blur-md z-11 max-sm:px-8 fixed top-[20%]">
                <div className="text-white">
                    <div className="mb-8 flex flex-col items-center">
                        <img src="/assets/media/img/notes.png"
                             width="150" alt="NotesApp Logo"/>
                        <h1 className="mb-2 text-2xl font-semibold font-mono">Bilten Notes</h1>
                        <span className="text-gray-300 font-roboto">Enter Login Details</span>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4 text-lg">
                            <input
                                {...register("identifier", {
                                    required: "Field is required",
                                })}
                                className="rounded-3xl border-none bg-yellow-400/50 font-roboto px-6 py-2 text-center text-inherit transition-colors duration-500 focus:bg-yellow-400/80 placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="text" placeholder="Username or Email"/>
                        </div>
                        {errors.identifier && (
                            <div
                                className="text-red-500 max-h-fit relative bottom-4 left-4">{errors.identifier.message}</div>
                        )}
                        <div className="mb-4 text-lg">
                            <input
                                {...register("password", {
                                    required: "Field is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    },
                                })}
                                className="rounded-3xl border-none bg-yellow-400/50 font-roboto px-6 py-2 text-center text-inherit transition-colors duration-500 focus:bg-yellow-400/80 placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="Password" placeholder="Password"/>
                        </div>
                        {errors.password && (
                            <div className="text-red-500">{errors.password.message}</div>
                        )}
                        <div className="mt-8 flex justify-center text-lg text-black">
                            <button type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-3xl cursor-pointer
                                     bg-yellow-400/50 font-roboto
                                     font-semibold px-10 py-2
                                     text-white shadow-xl
                                     backdrop-blur-md transition-colors
                                     duration-300 hover:bg-yellow-600">
                                {isSubmitting ? "Loading..." : "Login"}
                            </button>
                        </div>
                        <button
                            onClick={RegisterButton}
                            type="button"
                            className="cursor-pointer underline text-blue-500 hover:text-blue-400 relative -bottom-6 right-9.5">
                            <h1>Register Here!</h1>
                        </button>
                    </form>
                    <Snackbar
                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                        open={result === 'error'}
                        autoHideDuration={2000}
                        onClose={() => {
                            setResult('')
                        }}
                    >
                        <Alert severity="warning">Email/Username Or Password isn't correct</Alert>
                    </Snackbar>

                </div>
            </div>
        </>
    )
}
export default Login
