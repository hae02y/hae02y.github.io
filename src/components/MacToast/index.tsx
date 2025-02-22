import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

type Props = {
    color?: "yellow" | "red" | "green" | "blue";
    title?: string;
    message?: string;
};

const MacToastButton = ({
                            color = "red",
                            title = "경고",
                            message = "예기치 않은 오류가 발생했습니다."
                        }: Props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Toast.Provider swipeDirection="right">
            {/* 토스트를 띄우기 위한 버튼 */}
            <button
                className={`w-3 h-3 bg-${color}-500 rounded-full cursor-pointer focus:shadow-2xl`}
                onClick={() => setOpen(true)}
            ></button>

            {/* 토스트 컴포넌트 */}
            <Toast.Root
                className="relative flex flex-col items-center bg-[#DEDFE0] shadow-2xl dark:bg-[#616567] p-6 rounded-md shadow-xl text-gray-800 dark:text-gray-200 text-center"
                open={open}
                onOpenChange={setOpen}
            >
                {/* 상단 경고 아이콘 */}
                <div className="mb-2">
                    <span className="text-3xl">⚠️</span>
                </div>
                <Toast.Title className="text-xl font-bold">
                    {title}
                </Toast.Title>
                <Toast.Description className="mt-2 text-base">
                    {message}
                </Toast.Description>
                {/* 하단 Done 버튼 */}
                <div className="mt-4">
                    <Toast.Action asChild altText="Dismiss">
                        <button
                            className="px-6 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => setOpen(false)}
                        >
                            Done
                        </button>
                    </Toast.Action>
                </div>
            </Toast.Root>

            <Toast.Viewport
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2147483647] m-0 flex flex-col gap-2.5 p-6 outline-none"
            />
        </Toast.Provider>
    );
};

export default MacToastButton;
