import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

type Props = {
    color?: "yellow" | "red" | "green" | "blue";
}

const MacToastButton = ({color="red"} : Props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Toast.Provider swipeDirection="right">
            <button
                className={`bt red w-3 h-3 bg-${color}-500 rounded-full cursor-pointer focus:shadow`}
                onClick={() => {
                    setOpen(true);
                }}
            >
            </button>

            <Toast.Root
                className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
                open={open}
                onOpenChange={setOpen}
            >
                <Toast.Title className="mb-[5px] text-[15px] font-medium text-slate12 [grid-area:_title]">
                    종료할수없습니다.
                </Toast.Title>
                <Toast.Description asChild>

                </Toast.Description>
                <Toast.Action
                    className="[grid-area:_action]"
                    asChild
                    altText="Goto schedule to undo"
                >
                </Toast.Action>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
        </Toast.Provider>
    );
};

export default MacToastButton;
