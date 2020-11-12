import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";

import RegisterAccount from "./screens/RegisterAccount";
import AskQuestion from "./screens/AskQuestion";
import Home from "./screens/Home";
import QuestionDetails from "./screens/QuestionDetails";
import AccountScreen from "./screens/AccountScreen";
import AddAnswer from "./screens/AddAnswer";
import LoadingScreen from "./screens/LoadingScreen";

const store = configureStore();
const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
    <Stack.Screen name="RegisterAccount" component={RegisterAccount} />
    <Stack.Screen name="AskQuestion" component={AskQuestion} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="QuestionDetails" component={QuestionDetails} />
    <Stack.Screen name="AccountScreen" component={AccountScreen} />
    <Stack.Screen name="AddAnswer" component={AddAnswer} />
  </Stack.Navigator>
);

export default function App() {
  // generate key here

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
