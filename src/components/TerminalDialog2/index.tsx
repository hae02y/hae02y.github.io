import React, {ReactNode, useState} from 'react';
import { Dialog, DialogTrigger, DialogContentBare, DialogTitle } from '@site/src/components/ui/dialog';
import MacTerminal from '@site/src/components/MacTerminal';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export default function TerminalDialog2() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <div className="postit-wrap">
                <span className="postit-tape" aria-hidden="true" />
                <div className="postit-card">
                    <p className="postit-title">hi im hae02y, backend developer</p>
                    <p className="postit-body">
                        how are you?
                        <br />
                        thank you for visiting here :)
                        <span className="postit-cta">
                            <span className="postit-cta-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="16" rx="3" ry="3" />
                                    <path d="M6.5 8.5h11" />
                                    <path d="M7.5 12.5l2.5 2.5-2.5 2.5" />
                                    <path d="M12 17h4.5" />
                                </svg>
                            </span>
                        </span>
                    </p>
                </div>
            </div>
            </DialogTrigger>

            <DialogContentBare className="w-[94vw] h-[90vh] max-h-[90vh] max-w-3xl overflow-hidden bg-transparent flex">
                <VisuallyHidden>
                    <DialogTitle className="text-lg">title</DialogTitle>
                </VisuallyHidden>
                <MacTerminal version="v1.0.0" title="hae02y" onClose={() => setOpen(false)} />
            </DialogContentBare>
        </Dialog>
    );
}
