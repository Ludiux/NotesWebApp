import React, {useEffect, useState} from 'react'
import {notes} from "../../services/api.js";

const Body = ({refresh, setRefresh}) => {
    const [noteList, setNoteList] = useState([]);

    useEffect(() => {
        notes.getAll()
            .then(res => {
                console.log("DATA:", res.data);
                setNoteList(res.data);

            })
            .catch(err => console.error(err));

    }, [refresh]);

    const RefreshButton = async () => {
        setRefresh(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setRefresh(false);

    }


    return (
        <div className="bg-[#003052] w-full h-full flex flex-col justify-center items-center">
            <div
                className="flex flex-col items-start justify-baseline h-170 w-80 rounded-md fixed left-10 bg-[#2f4476]">
                <ol className="w-70 mx-4  mt-20 text-surface overflow-y-scroll dark:text-white">
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
                className="w-385 h-full flex justify-start align-middle items-start relative bottom-2 overflow-x-scroll rounded-md left-45">
                <button
                    className="bg-green-500 rounded-full fixed left-94 bottom-10 w-10 h-10 text-white text-2xl cursor-pointer hover:bg-green-600"
                    onClick={RefreshButton}>
                    <div
                        className="rotate-0 transition-transform flex align-middle justify-center items-center hover:rotate-180">
                        <img src="/assets/media/img/refresh.png" className="w-7 h-7 " alt={"Refresh"}/>
                    </div>
                </button>
                <ol className="flex items-start justify-center">
                    {noteList.map(note => (
                        <li key={note.id}>
                            <div className="w-135 h-160 mx-4 rounded-md flex flex-col bg-[#9a513e]">
                                <h1 className="text-[#879a3e] text-4xl font-bold text-center pt-3 underline decoration-[#9a3e59]">
                                    {note.title}
                                </h1>
                                <p className="text-[#879a3e] max-w-135 wrap-break-word max-h-full overflow-y-scroll text-left text-xl px-4 pt-3 underline decoration-[#9a3e59]">
                                    {note.content}
                                </p>
                            </div>

                            <button
                                className="w-20 h-10 bg-yellow-600 relative bottom-12 left-116 rounded-xl text-white font-roboto font-semibold">
                                Delete
                            </button>
                        </li>
                    ))}

                </ol>
            </div>
        </div>
    )
}
export default Body
