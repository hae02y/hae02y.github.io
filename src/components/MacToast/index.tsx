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
            <button
                className={`w-3 h-3 bg-${color}-500 rounded-full cursor-pointer focus:shadow`}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {/* 버튼 내용은 원한다면 아이콘 등을 추가 */}
            </button>

            <Toast.Root
                className="relative bg-gray-900 border-l-4 border-red-500 p-4 rounded-md shadow-lg text-white font-mono"
                open={open}
                onOpenChange={setOpen}
            >
                <Toast.Title className="text-lg font-bold">
                    {title}
                </Toast.Title>
                <Toast.Description className="text-sm mt-1">
                    {message}
                </Toast.Description>
                <Toast.Action asChild altText="닫기">
                    <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                        onClick={() => setOpen(false)}
                    >
                        ✕
                    </button>
                </Toast.Action>
            </Toast.Root>

            <Toast.Viewport
                className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[2147483647] m-0 flex flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]"
            />
        </Toast.Provider>
    );
};

export default MacToastButton;
