import { ReactElement } from "react";
import style from "./MainMenuButton.style.scss";
import MenuButton from "../../assets/icons/menu_button.svg";

function MainMenuButton(): ReactElement {
  return (
    <button className={style.mainMenuButton}>
      <img src={MenuButton} />
    </button>
  );
}

export default MainMenuButton;
