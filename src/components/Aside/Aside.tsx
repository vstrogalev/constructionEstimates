import { ReactElement, ReactNode } from "react";
import style from "./Aside.style.scss";

function Aside(): ReactElement {
  return (
    <aside className={style.aside}>{'Test'}</aside>
  );
}

export default Aside;
