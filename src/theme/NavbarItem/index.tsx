import React, {useEffect} from "react";
import { Menu } from "@headlessui/react";
import type { WrapperProps } from "@docusaurus/types";
import type NavbarItemType from "@theme/NavbarItem";

type Props = WrapperProps<typeof NavbarItemType>;

export default function NavbarItemWrapper(props: any): JSX.Element {
    // 드롭다운 메뉴 구성

    if (props.items) {
        return (
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button
                    className="btn btn-plain btn-gnb"
                >
                    {props.label}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    {props.items.map((subItem: any, index: number) => (
                        <Menu.Item key={index}>
                            {({ active }) => (
                                <a
                                    href={subItem.to}
                                    className={`${
                                        active ? "bg-gray-700 text-white" : "text-gray-300"
                                    } block px-4 py-2 text-sm rounded-md transition-all`}
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
