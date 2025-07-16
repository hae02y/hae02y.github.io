import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import {Search} from "lucide-react";
import SearchBar from "@theme/SearchBar";
import NavbarSearch from "@theme/Navbar/Search";

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();

  // TODO how can the order be defined for mobile?
  // Should we allow providing a different Conference of items?
  const items = useNavbarItems();

  return (
      <NavbarSearch>
        <SearchBar />
      </NavbarSearch>
  );
}
