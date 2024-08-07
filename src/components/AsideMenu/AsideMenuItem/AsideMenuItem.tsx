import { ReactElement, ReactNode, useState } from "react";
import clsx from 'clsx';
import style from "./AsideMenuItem.style.scss";

type AsideMenuItemProps = {
  isActive: boolean,
  children: ReactNode;
}

function AsideMenuItem(props: AsideMenuItemProps): ReactElement {
  return <p className={clsx(style.asideMenuItem, {[style.asideMenuItem_active]:props.isActive})}>{props.children}</p>
  ;
}

export default AsideMenuItem;
