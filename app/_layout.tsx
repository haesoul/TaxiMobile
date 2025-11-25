import store from "@/state";
import { Stack } from "expo-router";
import { Provider } from "react-redux";


export default function RootLayout() {

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}/>
    </Provider>)
}
