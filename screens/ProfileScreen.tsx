import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import useOrientation from "../utils/useOrientation";
import { RootStackParamList } from "../types/RootStackParamList";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

interface UserData {
  uuid: "string";
  image: "string";
  firstName: "string";
  lastName: "string";
  address: "string";
  phone: "string";
}

export default function ProfileScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const orientation = useOrientation();
  const isPortrait =
    orientation === "PORTRAIT" || Dimensions.get("window").height > 600
      ? true
      : false;

  useEffect(() => {
    async function getUserInfo() {
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://vidqjclbhmef.herokuapp.com/user",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: route.params.token,
            },
          }
        );

        const resData = await response.json();
        if (Object.keys(resData).length === 0)
          throw new Error("Incorrect authentication header");

        setUserData(resData);
        setIsLoading(false);
      } catch (err) {
        let errMessage: string;
        if (err instanceof Error) errMessage = err.message;
        else errMessage = String(err);

        Alert.alert("Error", errMessage, [
          { text: "Ok", onPress: () => navigation.replace("Auth") },
        ]);
      }
    }
    getUserInfo();
  }, []);

  async function logoutHandler() {
    await SecureStore.deleteItemAsync("token");
    navigation.replace("Auth");
  }

  if (isLoading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00b896" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={isPortrait ? styles.header : landscapeStyles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={isPortrait ? styles.wrapper : landscapeStyles.wrapper}>
        <Image
          style={isPortrait ? styles.image : landscapeStyles.image}
          source={{
            uri: userData.image,
          }}
        />
        <View style={isPortrait ? undefined : landscapeStyles.textContainer}>
          <Text style={styles.text}>
            {userData.firstName + " " + userData.lastName}
          </Text>
          <Text style={styles.text}>{userData.address}</Text>
          <Text style={styles.text}>{userData.phone}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingTop: 30,
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
    paddingTop: 80,
    backgroundColor: "#00b896",
  },
  logoutButton: {
    margin: 15,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    height: 300,
    width: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
    textAlign: "center",
  },
});

const fitLandscapeWindow =
  Dimensions.get("window").height > Dimensions.get("window").width
    ? Dimensions.get("window").width / 1.5
    : Dimensions.get("window").height / 1.5;

const landscapeStyles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 30,
  },
  image: {
    height: fitLandscapeWindow,
    width: fitLandscapeWindow,
    marginBottom: 20,
    marginRight: 30,
    borderRadius: 10,
  },
  textContainer: {
    justifyContent: "space-evenly",
    height: fitLandscapeWindow,
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
    paddingTop: Platform.OS === "ios" ? 50 : 80,
    backgroundColor: "#00b896",
  },
});
