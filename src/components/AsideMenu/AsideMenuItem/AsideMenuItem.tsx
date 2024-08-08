import { ReactElement, ReactNode, useState } from "react";
import clsx from 'clsx';
import style from "./AsideMenuItem.style.scss";
import AsideMenuIcon from '../../../assets/icons/aside_menu_icon.svg';

type AsideMenuItemProps = {
  isActive: boolean,
  children: ReactNode;
}

function AsideMenuItem(props: AsideMenuItemProps): ReactElement {
  return <button className={clsx(style.asideMenuItem, {[style.asideMenuItem_active]:props.isActive})}>
    <img src={AsideMenuIcon} className={style.asideMenuItem__icon}/>
    <span className={style.asideMenuItem__text}>{props.children}</span>
  </button>
  ;
}

export default AsideMenuItem;
