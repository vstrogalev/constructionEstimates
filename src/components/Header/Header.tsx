import { ReactElement } from "react";
import style from "./Header.style.scss";
import Menu from "../Menu/Menu";
import MainMenuButton from "../MainMenuButton/MainMenuButton";
import BackButton from "../BackButton/BackButton";

function Header(): ReactElement {
  return (
    <nav className={style.header}>
      <MainMenuButton />
      <BackButton />
      <Menu />
    </nav>
  );
}

export default Header;
