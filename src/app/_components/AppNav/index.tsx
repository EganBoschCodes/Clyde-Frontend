'use client';

import { usePathname } from 'next/navigation';

import * as S from './styles';
import { TABS, type Tab } from './tabs';

function isTabActive(tab: Tab, pathname: string): boolean {
  if (tab.href === '/') return pathname === '/';
  return pathname === tab.href || pathname.startsWith(`${tab.href}/`);
}

export default function AppNav() {
  const pathname = usePathname();

  const renderTab = (tab: Tab) => {
    const isActive = isTabActive(tab, pathname);
    return (
      <S.TabLink
        key={tab.href}
        href={tab.href}
        $isActive={isActive}
        aria-current={isActive ? 'page' : undefined}
      >
        {tab.icon}
        <S.TabLabel>{tab.label}</S.TabLabel>
      </S.TabLink>
    );
  };

  return (
    <S.Bar aria-label="Primary">
      <S.Inner>
        <S.Brand>The Bosch Residence</S.Brand>
        <S.Tabs>{TABS.map(renderTab)}</S.Tabs>
      </S.Inner>
    </S.Bar>
  );
}
