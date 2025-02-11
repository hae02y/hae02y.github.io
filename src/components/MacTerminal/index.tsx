import React from 'react';
import DynamicTyper from "@site/src/components/DynamicTyper";

const MacTerminal = ({ title, version }) => {
    return (
        <div className="w-full h-[100%] text-white rounded-lg shadow-lg p-4">
            {/* 윈도우 컨트롤 바 */}
            <div className="flex items-center mb-4 h-[10%]">
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-grow text-center text-sm text-gray-400">
                    My Blog! {version}
                </div>
            </div>
            {/* 내용 */}
            <div className="text-left bg-black w-full h-[80%] rounded-md p-4 font-mono text-lg leading-loose">
                <span className="text-green-400">{title}@macbook</span>
                <span className="text-white">:~$ <DynamicTyper /></span>

            </div>
        </div>
    );
};

export default MacTerminal;