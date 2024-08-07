import { ReactElement, useState } from "react";
import clsx from 'clsx';
import style from "./AsideMenu.style.scss";
import AsideMenuItem from "./AsideMenuItem";

const menuItems = [
  'По проекту', 
  'Объекты',
  'РД',
  'МТО',
  'СМР',
  'График',
  'МиМ',
  'Рабочие',
  'Капвложения',
  'Бюджет',
  'Финансирование',
  'Панорамы',
  'Камеры',
  'Поручения',
  'Контрагенты',
]

function AsideMenu(): ReactElement {
  const [menuItemActive, setMenuItemActive] = useState<number>(0);
  return (
    <nav className={style.asideMenu}>
      {
        menuItems.map((menuItem, idx) => {
          const isActive = idx === menuItemActive;
          return <AsideMenuItem isActive={isActive}>{menuItem}</AsideMenuItem>
        }
        )
      }
    </nav>
  );
}

export default AsideMenu;
