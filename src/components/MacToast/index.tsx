import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

type Props = {
    color?: "yellow" | "red" | "green" | "blue";
    title?: string;
    message?: string;
    onClick?: () => void;
    showToast?: boolean;
};

const MacToastButton = ({
                             color = "red",
                             title = "Warning",
                             message = "An unexpected error occurred.",
                             onClick,
                             showToast = true,
                         }: Props) => {
    const [open, setOpen] = React.useState(false);

    const bgColorClass =
        color === "red"
            ? "bg-red-500"
            : color === "green"
                ? "bg-green-500"
                : color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-blue-500";

    if (!showToast) {
        return (
            <button
                className={`w-5 h-5 ${bgColorClass} rounded-full cursor-pointer border border-black`}
                onClick={onClick}
            ></button>
        );
    }

    return (
        <Toast.Provider swipeDirection="right">
            <button
                className={`w-5 h-5 ${bgColorClass} rounded-full cursor-pointer border border-black`}
                onClick={() => {
                    onClick?.();
                    setOpen(true);
                }}
            ></button>

            <Toast.Root
                className="border border-black bg-white text-black font-mono p-4 text-center text-sm uppercase"
                open={open}
                onOpenChange={setOpen}
            >
                <div className="mb-1 text-xl font-bold">⚠️ {title}</div>
                <Toast.Description className="text-xs">{message}</Toast.Description>
                <div className="mt-3">
                    <Toast.Action asChild altText="Dismiss">
                        <button
                            className="px-3 py-1 border border-black bg-black text-white font-mono text-xs hover:bg-white hover:text-black"
                            onClick={() => setOpen(false)}
                        >
                            CLOSE
                        </button>
                    </Toast.Action>
                </div>
            </Toast.Root>

            <Toast.Viewport
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2147483647] flex flex-col gap-2 outline-none"
            />
        </Toast.Provider>
    );
};

export default MacToastButton;
