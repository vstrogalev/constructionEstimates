import { ReactElement, ReactNode } from "react";
import style from "./MainLayout.style.scss";

type MainLayoutProps = {
  children: ReactNode
}

function MainLayout(props: MainLayoutProps): ReactElement {
  return (
    <article className={style.mainLayout}>
      {props.children}
    </article>
  );
}

export default MainLayout;
