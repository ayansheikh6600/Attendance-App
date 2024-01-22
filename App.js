import { Provider } from "react-redux";
import { persistedStore, store } from "./Store";
import { PersistGate } from "redux-persist/integration/react";
import NaviContainer from "./NavigationCon";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        <NaviContainer />
      </PersistGate>
    </Provider>
  );
}
