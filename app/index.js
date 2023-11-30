import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { AuthStore } from "../store";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const { isLoggedIn, initialized } = AuthStore.useState((s) => ({ isLoggedIn: s.isLoggedIn, initialized: s.initialized }));
  const navigationState = useRootNavigationState();

  React.useEffect(() => {

    if (!navigationState?.key || !initialized) return;
  
    if (!isLoggedIn) {
      router.replace("/login");
    } else if (isLoggedIn) {
      router.replace("/(tabs)/home");
    }
  }, [isLoggedIn, initialized, segments, navigationState?.key]);

  return <View>{!navigationState?.key || !initialized ? <Text>LOADING...</Text> : <></>}</View>;
};

export default Index;
