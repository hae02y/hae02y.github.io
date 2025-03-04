import React, {useEffect} from "react";
import { Menu } from "@headlessui/react";
import type { WrapperProps } from "@docusaurus/types";
import type NavbarItemType from "@theme/NavbarItem";

type Props = WrapperProps<typeof NavbarItemType>;

export default function NavbarItemWrapper(props: any) {
    // 드롭다운 메뉴 구성

    if (props.items) {
        return (
            <Menu as="div" className="relative inline-block text-left">
                {/* Menu 버튼 */}
                <Menu.Button
                    className="inline-flex items-center px-4 py-2 text-sm rounded-md text-[#3182ce] dark:text-[#63b3ed] hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                    {props.label}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2 h-5 w-5"
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
                <Menu.Items className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-300 dark:ring-gray-700 z-10">
                    {props.items.map((subItem, index) => (
                        <Menu.Item key={index}>
                            {({ active }) => (
                                <a
                                    href={subItem.to}
                                    className={`dark:bg-gray-800 block px-4 py-2 text-sm rounded-md text-gray-600 dark:text-gray-100}`}
                                >
                                    {subItem.label}
                                </a>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Menu>
            // <Menu as="div" className="relative inline-block text-left">
            //     <Menu.Button
            //         className="btn btn-plain btn-gnb text-[#3182ce] dark:text-[#63b3ed]"
            //     >
            //         {props.label}
            //     </Menu.Button>
            //     <Menu.Items className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            //         {props.items.map((subItem: any, index: number) => (
            //             <Menu.Item key={index}>
            //                 {({ active }) => (
            //                     <a
            //                         href={subItem.to}
            //                         className={`${
            //                             active ? "bg-gray-700 text-white" : "text-gray-300"
            //                         } block px-4 py-2 text-sm rounded-md transition-all`}
            //                     >
            //                         {subItem.label}
            //                     </a>
            //                 )}
            //             </Menu.Item>
            //         ))}
            //     </Menu.Items>
            // </Menu>
        );
    }

    if(props.type) {
        return (
            <>
                <a
                    href={'/docs/intro'}
                    className="btn btn-plain btn-gnb"
                >
                    {props.label}
                </a>
            </>
        )
    }

    if(props.href) {
        return (
            <>
                <a
                    href={props.href}
                    className="btn btn-plain btn-gnb"
                >
                    {props.label}
                </a>
            </>
        )
    }

    // 기본 링크 구성
    return (
        <a
            href={props.to}
            className="btn btn-plain btn-gnb"
        >
            {props.label}
        </a>
    );
}
