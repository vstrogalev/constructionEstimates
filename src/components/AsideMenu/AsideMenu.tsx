import { ReactElement, useState } from "react";
import style from "./AsideMenu.style.scss";
import AsideMenuItem from "./AsideMenuItem";
import AsideMenuHeader from "./AsideMenuHeader";


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
  const [menuItemActive, setMenuItemActive] = useState<number>(4);
  return (
    <nav className={style.asideMenu}>
      <AsideMenuHeader/>
      {
        menuItems.map((menuItem, idx) => {
          const isActive = idx === menuItemActive;
          return <AsideMenuItem isActive={isActive}>
              {menuItem}
            </AsideMenuItem>
        }
        )
      }
    </nav>
  );
}

export default AsideMenu;
