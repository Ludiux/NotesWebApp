import React from 'react'


const Header = ({setLoginState}) => {

    const CurrentCategory = "Category";

    return (
        <div className="bg-[#003052] w-full h-60 flex justify-between items-start">
            <div
                className="w-80 h-35 mt-10 ml-10 rounded-md bg-[#0044a1] flex flex-col items-center justify-center">
                <button
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
                className="bg-[#9a513e] mt-10 mr-10 w-30 h-15  text-white text-xl font-semibold font-mono rounded-md">Logout
            </button>
        </div>
    )
}
export default Header
