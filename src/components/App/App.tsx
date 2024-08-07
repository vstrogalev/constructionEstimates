// src/components/App/App.tsx
import style from "./App.style.scss";
import { ReactElement } from "react";
import ConstructionEstimates from '../../pages/ConstructionEstimates';

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps): ReactElement {
  return (
    <section className={style.app}>
      {children}
    </section>
  );
}

export function App(): ReactElement {
  return (
    <AppProvider>
      <ConstructionEstimates />
    </AppProvider>
  );
}
