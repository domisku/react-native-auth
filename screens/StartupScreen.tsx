import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { RootStackParamList } from "../types/RootStackParamList";

type Props = NativeStackScreenProps<RootStackParamList, "Startup">;

export default function StartupScreen({ navigation }: Props): JSX.Element {
  useEffect(() => {
    async function lookForToken() {
      let token = await SecureStore.getItemAsync("token");
      if (token) navigation.replace("Profile", { token });
      else navigation.replace("Auth");
    }
    lookForToken();
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00b896" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
