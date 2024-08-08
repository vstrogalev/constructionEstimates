import { ReactElement } from "react";
import style from "./AsideMenuHeader.style.scss";
import ChevronDown from '../../../assets/icons/shevron_down.svg';

function AsideMenuHeader(): ReactElement {
  return <button className={style.asideMenuHeader}>
    <div className={style.asideMenuHeader__wrapper}>
      <h3 className={style.asideMenuHeader__title}>Название проекта</h3>
      <p className={style.asideMenuHeader__subtitle}>Аббревиатура</p>
    </div>
    <img src={ChevronDown} className={style.asideMenuHeader__chevronDown}/>
  </button>
  ;
}

export default AsideMenuHeader;
