import React, {useState} from 'react'
import {useForm} from "react-hook-form";
import {auth} from "../../services/api.js";
import {Alert, Snackbar} from "@mui/material";

const Register = ({setRegister, setLoginState}) => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm();
    const [taken, setTaken] = useState(false);
    const [success, setSuccess] = useState(false);

    const LoginButton = () => {
        setLoginState(false);
        setRegister(false);
    }
    const onSubmit = async (data) => {
        await new Promise(resolve => setTimeout(resolve, 600));
        try {
            const response = await auth.register({
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password
            });
            localStorage.setItem('token', response.data.token);
            setRegister(false);
            setLoginState(false);
            setSuccess(true)

            console.log('Register successful!');
        } catch (error) {
            setTaken(true);

            console.error('Register failed:', error.response?.data);
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
                                {...register("name", {
                                    required: "Field is required",
                                })}
                                className="rounded-3xl border-none bg-yellow-400/50 font-roboto px-6 py-2 text-center text-inherit transition-colors duration-500 focus:bg-yellow-400/80 placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="text" placeholder="Enter your Full Name"/>
                        </div>
                        <div className="mb-4 text-lg">
                            <input
                                {...register("username", {
                                    required: "Field is required",
                                })}
                                className="rounded-3xl border-none bg-yellow-400/50 font-roboto px-6 py-2 text-center text-inherit transition-colors duration-500 focus:bg-yellow-400/80 placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="text" placeholder="Create a Username"/>
                        </div>
                        <div className="mb-4 text-lg">
                            <input
                                {...register("email", {
                                    required: "Field is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Please input a valid email address"
                                    }
                                })}
                                className="rounded-3xl border-none bg-yellow-400/50 font-roboto px-6 py-2 text-center text-inherit transition-colors duration-500 focus:bg-yellow-400/80 placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="email" placeholder="Enter your Email"/>
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
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=(?:.*\d){2,}).+$/,
                                        message: "Your password must contain at 1 Capital Letter and 2 numbers"
                                    },

                                })}
                                className="rounded-3xl border-none bg-yellow-400/50 font-roboto px-6 py-2 text-center text-inherit transition-colors duration-500 focus:bg-yellow-400/80 placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="Password" placeholder="Create a Password"/>
                        </div>
                        {errors.password && (
                            <div className="text-red-500 w-80">{errors.password.message}</div>
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
                                {isSubmitting ? "Loading..." : "Register"}
                            </button>
                        </div>
                        <button
                            onClick={LoginButton}
                            type="button"
                            className="cursor-pointer underline text-blue-500 hover:text-blue-400 relative -bottom-6 right-9.5">
                            <h1>Login!</h1>
                        </button>
                    </form>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={taken === true}
                autoHideDuration={2000}
                onClose={() => {
                    setTaken(false)
                }}
            >
                <Alert severity="error">Email or Username is already Taken</Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={success === true}
                autoHideDuration={2000}
                onClose={() => {
                    setTaken(false)
                }}
            >
                <Alert severity="success">You Registered Correctly!</Alert>
            </Snackbar>
        </>
    )
}
export default Register
