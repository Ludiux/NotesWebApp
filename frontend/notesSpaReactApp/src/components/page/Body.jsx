import React, {useEffect, useState} from 'react'
import {categories, notes} from "../../services/api.js";
import {Alert, Snackbar} from "@mui/material";
import {useForm} from "react-hook-form";

const Body = ({refresh, setRefresh, selectedCategory, categoriesList}) => {
    const [noteList, setNoteList] = useState([]);
    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm();
    const [updateNote, setUpdateNote] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [view, setView] = useState("active");
    const [openCategoryNoteId, setOpenCategoryNoteId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    // Filter Notes by Category
    // Get Notes Filtered by Active or Archived
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                let res;

                if (selectedCategory) {
                    res = await categories.getNotesByCategory(selectedCategory);
                } else if (view === "active") {
                    res = await notes.getActive();
                } else {
                    res = await notes.getArchived();
                }

                setNoteList(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotes();
    }, [view, selectedCategory, refresh]);

    // Delete Note Function
    const DeleteBtn = async (id) => {
        try {
            await notes.delete(id);

            setNoteList(prev => prev.filter(note => note.id !== id));

            console.log("Note deleted");
        } catch (error) {
            console.error("Delete failed:", error.response?.data);
        }
    }

    // Give category to note
    const AssignCategoryBtn = async (noteId, categoryId) => {
        if (!categoryId) return;

        try {
            await categories.addToNote(noteId, categoryId);
            setRefresh(prev => !prev);
        } catch (err) {
            console.error(err);
        }
    };

    // Fill Note Form
    useEffect(() => {
        if (selectedNote) {
            reset({
                title: selectedNote.title,
                content: selectedNote.content,
            });
        }
    }, [selectedNote, reset]);

    // Update Note
    const HandleUpdate = async (data) => {
        if (!selectedNote) return;

        try {
            const response = await notes.update(selectedNote.id, {
                title: data.title,
                content: data.content,
            });

            console.log("UPDATED:", response.data);

            setUpdateNote(false);
            setSelectedNote(null);
            reset();
            setRefresh(prev => !prev);

        } catch (error) {
            console.error("Update failed:", error.response?.data);
        }
    };

    // Refresh Notes Function
    const RefreshButton = async () => {
        setRefresh(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setRefresh(false);

    }


    return (
        <div className="bg-[#003052] w-full h-full flex flex-row justify-center items-center ">


            {updateNote &&
                (<div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="w-135 h-160 mx-4 rounded-md flex flex-col bg-[#9a513e]">
                        <form onSubmit={handleSubmit(HandleUpdate)}>
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
                                    onClick={() => {
                                        setSelectedNote(null);
                                        setUpdateNote(false)
                                    }
                                    }
                                    disabled={isSubmitting}
                                    type="button"
                                    className={`font-medium font-roboto mx-4 text-xl text-white bg-[#9a3e59] hover:bg-fuchsia-800 cursor-pointer rounded-lg w-fit h-fit py-2 px-2`}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`font-medium font-roboto text-xl  text-white bg-[#1e74fd] hover:bg-blue-600 cursor-pointer rounded-lg w-fit h-fit py-2 px-2`}>
                                    {isSubmitting ? "Editing..." : "Edit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>)

            }
            <div
                className="flex flex-col items-start justify-baseline h-160 w-80 rounded-md bg-[#2f4476]">
                <ol className="w-70 mx-4 mt-20 text-surface overflow-y-scroll dark:text-white">
                    {noteList.map(note => (
                        <li key={note.id}
                            className="w-full border-b-4 my-4 rounded border-neutral-100 px-2 py-1 font-roboto font-medium text-xl dark:border-white/10">
                            <h1>
                                {note.title}
                            </h1>

                        </li>
                    ))}
                </ol>
            </div>
            <div
                className="w-385  h-fit flex justify-start align-middle items-start relative bottom-0 overflow-x-scroll rounded-md left-5">
                <button
                    className="bg-green-500 rounded-full fixed left-94 top-40 w-10 h-10 text-white text-2xl cursor-pointer hover:bg-green-600"
                    onClick={RefreshButton}>
                    <div
                        className="rotate-0 transition-transform flex align-middle justify-center items-center hover:rotate-180">
                        <img src="/assets/media/img/refresh.png" className="w-7 h-7 " alt={"Refresh"}/>
                    </div>
                </button>
                <ol className="flex items-start justify-center">
                    {noteList.map(note => (
                        <li key={note.id} className="relative mx-4">

                            {/* Category button and dropdown container */}
                            <div className="relative left-102">
                                <button
                                    onClick={() => {
                                        setOpenCategoryNoteId(
                                            openCategoryNoteId === note.id ? null : note.id
                                        );
                                    }}
                                    className="bg-fuchsia-800 rounded-lg w-fit h-fit py-1 px-3 mb-2 text-white font-semibold font-mono"
                                >
                                    Add Category!
                                </button>

                                {openCategoryNoteId === note.id && (
                                    <div
                                        className="absolute z-50 mt-1 bg-[#0044a1] p-2 rounded-md w-fit left-0 top-full">
                                        <select
                                            value={selectedCategoryId}
                                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                                            className="rounded-md text-center bg-[#0044a1] text-xl text-white p-0 font-semibold font-roboto"
                                        >
                                            <option value="">Select category</option>
                                            {categoriesList.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={async () => {
                                                if (!selectedCategoryId) return;
                                                await AssignCategoryBtn(note.id, selectedCategoryId);
                                                setOpenCategoryNoteId(null);
                                                setSelectedCategoryId("");
                                            }}
                                            className="ml-2 bg-[#3e9a7f] px-3 py-1 rounded font-semibold font-mono text-[#003052]"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Note card */}
                            <div className="w-135 h-160 mx-4 rounded-md flex z-0 flex-col bg-[#9a513e]">
                                <h1 className="text-[#879a3e] text-4xl font-bold text-center pt-3 underline decoration-4  decoration-[#9a3e59]">
                                    {note.title}
                                </h1>
                                <p className="text-[#879a3e] max-w-135 wrap-break-word max-h-full overflow-y-scroll text-left text-xl px-4 pt-3 underline decoration-3 decoration-[#9a3e59]">
                                    {note.content}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setUpdateNote(true);
                                    setSelectedNote(note);
                                }}
                                className="w-20 h-10 bg-[#9a3e59] relative bottom-12 left-90 rounded-xl transition-colors hover:bg-yellow-700 cursor-pointer text-white font-roboto font-semibold">
                                Edit
                            </button>

                            <button
                                onClick={() => DeleteBtn(note.id)}
                                className="w-20 h-10 bg-yellow-600 relative bottom-12 left-95 rounded-xl transition-colors hover:bg-red-400 cursor-pointer text-white font-roboto font-semibold">
                                Delete
                            </button>

                            <button
                                onClick={async () => {
                                    if (view === "active") {
                                        await notes.archive(note.id);
                                    } else {
                                        await notes.unarchive(note.id);
                                    }
                                    setRefresh(prev => !prev);
                                }}
                                className="w-20 h-10 relative bottom-12 left-25 bg-[#1e74fd] cursor-pointer transition-colors hover:bg-blue-600 text-white font-semibold font-mono rounded-xl">
                                {view === "active" ? "Archive" : "Restore"}
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setView("active")}
                    className={`px-6 py-1 fixed top-40 right-31 font-mono font-semibold rounded ${view === "active" ? "bg-green-500" : "bg-gray-500"}`}
                >
                    Active
                </button>

                <button
                    onClick={() => setView("archived")}
                    className={`px-3 py-1 fixed top-40 right-4 font-mono font-semibold rounded ${view === "archived" ? "bg-yellow-500" : "bg-gray-500"}`}
                >
                    Archived
                </button>
            </div>
        </div>
    )
}
export default Body
