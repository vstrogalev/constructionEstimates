import { ReactElement, ReactNode } from "react";
import style from "./Aside.style.scss";
import AsideMenu from "../AsideMenu/AsideMenu";

function Aside(): ReactElement {
  return (
    <aside className={style.aside}>
      <AsideMenu/>
    </aside>
  );
}

export default Aside;
