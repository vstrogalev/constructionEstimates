import { ReactElement, useState } from "react";
import clsx from 'clsx';
import style from "./Menu.style.scss";

const menuItems = ['Просмотр', 'Управление']

function Menu(): ReactElement {
  const [menuItemActive, setMenuItemActive] = useState<number>(0);
  return (
    <nav className={style.menu}>
      {
        menuItems.map((menuItem, idx) => {
          const isActive = idx === menuItemActive;
          return <button key={menuItem} className={clsx(style.menu__item, {[style.menu__item_active]:isActive})}>{menuItem}</button>
        }
        )
      }
    </nav>
  );
}

export default Menu;
