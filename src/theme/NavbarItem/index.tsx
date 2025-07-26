import React from "react";
import { Menu } from "@headlessui/react";
import type { WrapperProps } from "@docusaurus/types";
import type NavbarItemType from "@theme/NavbarItem";

type Props = WrapperProps<typeof NavbarItemType>;

export default function NavbarItemWrapper(props: any) {
    const baseButtonClasses =
        "font-mono lowercase";
    const themeButtonClasses =""


    const renderLink = (href: string) => (
        <a
            href={href}
            className={`${baseButtonClasses}`}
        >
            {props.label}.
        </a>
    );

    if (props.type) return renderLink("/docs/intro");
    if (props.href) return renderLink(props.href);
    return renderLink(props.to);
}
