import { ReactElement } from "react";
import style from "./Header.style.scss";
import MenuButton from "../../assets/icons/menu_button.svg";

function Header(): ReactElement {
  return (
    <section className={style.constructionEstimates}>
      <img src={MenuButton} />
    </section>
  );
}

export default Header;
