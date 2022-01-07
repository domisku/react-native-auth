import { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as SecureStore from "expo-secure-store";
import useOrientation from "../utils/useOrientation";
import { RootStackParamList } from "../types/RootStackParamList";

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

async function saveToken(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export default function AuthScreen({ navigation }: Props): JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const orientation = useOrientation();
  const isPortrait = orientation === "PORTRAIT" ? true : false;

  async function authHandler() {
    if (inputIsEmpty()) {
      Alert.alert(
        "Missing form fields",
        "Please enter both username and password"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://vidqjclbhmef.herokuapp.com/credentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const resData = await response.json();
      const token = resData.token;
      if (!token || typeof token !== "string")
        throw new Error("Incorrect credentials provided");

      saveToken("token", token);
      setIsLoading(false);

      navigation.replace("Profile", { token });
    } catch (err) {
      setIsLoading(false);

      let errMessage: string;
      if (err instanceof Error) errMessage = err.message;
      else errMessage = String(err);

      Alert.alert("Error", errMessage);
    }
  }

  function inputIsEmpty() {
    if (username.length === 0 || password.length === 0) return true;
    else return false;
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={isPortrait ? styles.wrapper : landscapeStyles.wrapper}>
        <View
          style={isPortrait ? styles.imgOutline : landscapeStyles.imgOutline}
        >
          <Image
            style={styles.image}
            source={{
              uri: "https://placeimg.com/80/80/tech",
            }}
            resizeMode={"cover"}
          />
        </View>
        <TextInput
          placeholder="Username"
          placeholderTextColor="black"
          onChangeText={(text) => setUsername(text)}
          style={isPortrait ? styles.input : landscapeStyles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          style={isPortrait ? styles.input : landscapeStyles.input}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={authHandler}
          style={isPortrait ? styles.button : landscapeStyles.button}
        >
          {!isLoading ? (
            <Text style={styles.buttonText}>Submit</Text>
          ) : (
            <ActivityIndicator size="small" color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    maxWidth: 400,
    width: "80%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    bottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderRadius: 8,
    backgroundColor: "#00b896",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    width: "100%",
    height: 58,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    color: "black",
    fontSize: 18,
    marginBottom: 40,
  },
  imgOutline: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00b896",
    borderRadius: 100,
    marginBottom: 60,
  },
});

const landscapeStyles = StyleSheet.create({
  wrapper: {
    maxWidth: 400,
    width: "80%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imgOutline: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00b896",
    borderRadius: 100,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    color: "black",
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#00b896",
  },
});
