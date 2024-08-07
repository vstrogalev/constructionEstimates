import { ReactElement } from "react";
import style from "./BackButton.style.scss";
import backButton from "../../assets/icons/button_back.svg";

function BackButton(): ReactElement {
  return (
    <button className={style.backButton}>
      <img src={backButton} />
    </button>
  );
}

export default BackButton;
