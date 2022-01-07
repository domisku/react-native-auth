import { useEffect, useState } from "react";
import { useWindowDimensions, Dimensions } from "react-native";

const initialState =
  Dimensions.get("window").height < Dimensions.get("window").width
    ? "LANDSCAPE"
    : "PORTRAIT";

export default function useOrientation() {
  const [orientation, setOrientation] = useState(initialState);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (width < height) setOrientation("PORTRAIT");
    else setOrientation("LANDSCAPE");
  }, [width, height]);

  return orientation;
}
