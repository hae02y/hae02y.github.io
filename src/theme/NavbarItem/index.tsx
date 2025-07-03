import React from "react";
import { Menu } from "@headlessui/react";
import type { WrapperProps } from "@docusaurus/types";
import type NavbarItemType from "@theme/NavbarItem";

type Props = WrapperProps<typeof NavbarItemType>;

export default function NavbarItemWrapper(props: any) {
    const baseButtonClasses =
        "px-3 py-1 border border-black font-mono uppercase text-sm transition-all";
    const themeButtonClasses =
        "bg-white text-black hover:bg-black hover:text-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black";

    if (props.items) {
        return (
            <Menu as="div" className="relative inline-block text-left font-mono">
                {/* Menu 버튼 */}
                <Menu.Button
                    className={`${baseButtonClasses} ${themeButtonClasses} inline-flex items-center`}
                >
                    {props.label}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.707a1 1 0 011.414 0L10 11.586l3.293-3.879a1 1 0 111.414 1.415l-4 4.829a1 1 0 01-1.414 0l-4-4.828a1 1 0 010-1.415z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Menu.Button>

                {/* Dropdown 메뉴 아이템 */}
                <Menu.Items className="absolute right-0 mt-1 w-32 border border-black bg-white dark:bg-black z-10">
                    {props.items.map((subItem, index) => (
                        <Menu.Item key={index}>
                            {({ active }) => (
                                <a
                                    href={subItem.to}
                                    className={`block px-3 py-1 text-xs uppercase ${
                                        active
                                            ? "bg-black text-white dark:bg-white dark:text-black"
                                            : "text-black hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                                    }`}
                                >
                                    {subItem.label}
                                </a>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Menu>
        );
    }

    const renderLink = (href: string) => (
        <a
            href={href}
            className={`${baseButtonClasses} ${themeButtonClasses}`}
        >
            {props.label}
        </a>
    );

    if (props.type) return renderLink("/docs/intro");
    if (props.href) return renderLink(props.href);
    return renderLink(props.to);
}
