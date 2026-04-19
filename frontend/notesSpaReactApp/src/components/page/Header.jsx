import React, {useState} from 'react'
import {useForm} from "react-hook-form";
import {notes} from "../../services/api.js";
import {Alert, Snackbar} from "@mui/material";


const Header = ({setLoginState, setRefresh}) => {
    const [newNote, setNewNote] = useState(false);
    const CurrentCategory = "Category";
    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm();


    const HandleDoneBtn = async (data) => {

        await new Promise(resolve => setTimeout(resolve, 600));
        try {
            const response = await notes.create({
                title: data.title,
                content: data.content,
            });

            setRefresh(true);
            await new Promise(resolve => setTimeout(resolve, 600));
            setRefresh(false);

            reset();

            console.log("NOTE RESPONSE:", response.data);
            setNewNote(false);
        } catch (error) {
            console.error('Note Creation failed:', error.response?.data);
        }

    }

    return (
        <div className="bg-[#003052] w-full h-60 flex justify-between items-start">
            <div
                className="w-80 h-35 mt-10 ml-10 rounded-md bg-[#0044a1] flex flex-col items-center justify-center">

                <button
                    onClick={() => setNewNote(true)}
                    className="bg-[#1e74fd] my-0.75 font-mono font-semibold text-3xl text-white w-76 h-15 rounded-md">
                    New Note
                </button>

                <button
                    className="bg-[#1e74fd] my-0.75 font-mono font-semibold text-3xl text-white w-76 h-15 rounded-md">
                    New Category
                </button>

            </div>

            <div className="w-310 h-24 mt-10 rounded-md bg-[#0044a1] flex flex-col items-center justify-center">
                <h1 className="text-[#003052] text-5xl font-semibold font-roboto">{CurrentCategory}</h1>
            </div>

            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    setLoginState(false);
                }}
                className="bg-[#9a513e] mt-10 mr-14 w-30 h-14  text-white text-xl font-semibold font-mono rounded-md">
                Logout
            </button>

            {newNote &&
                (<div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="w-135 h-160 mx-4 rounded-md flex flex-col bg-[#9a513e]">
                        <form onSubmit={handleSubmit(HandleDoneBtn)}>
                            <input
                                {...register("title", {
                                        required: true,
                                    }
                                )}
                                className="text-[#879a3e] appearance-none bg-transparent border-none focus:outline-none text-4xl font-bold text-center pt-3 underline decoration-[#9a3e59]"
                                placeholder="Title"/>
                            <Snackbar
                                open={Object.keys(errors).length > 0}
                                autoHideDuration={2000}
                                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                            >
                                <Alert severity="error">
                                    Field is Required
                                </Alert>
                            </Snackbar>
                            <textarea
                                {...register("content")}
                                className="text-[#879a3e] appearance-none bg-transparent border-none focus:outline-none resize-none w-full h-130 overflow-y-scroll text-left text-xl px-4 pt-3 underline decoration-[#9a3e59]"
                                placeholder="Text"
                            />
                            <div className={`relative top-2 ${isSubmitting ? "left-65" : "left-80"}`}>
                                <button
                                    onClick={() => setNewNote(false)}
                                    disabled={isSubmitting}
                                    type="button"
                                    className={`font-medium font-roboto mx-4 text-xl text-white bg-[#9a3e59] hover:bg-fuchsia-800 cursor-pointer rounded-lg w-fit h-fit py-2 px-2`}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`font-medium font-roboto text-xl  text-white bg-[#1e74fd] hover:bg-blue-600 cursor-pointer rounded-lg w-fit h-fit py-2 px-2`}>
                                    {isSubmitting ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>)
            }
        </div>
    )
}
export default Header
