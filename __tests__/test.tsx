import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { render } from "@testing-library/react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  getAnimatedStyle,
} from "react-native-reanimated";

import Animated from "react-native-reanimated";

jest.useFakeTimers();

function App() {
  const offset = useSharedValue(100);

  const animatedStyles = useAnimatedStyle(
    () => ({
      transform: [{ translateX: offset.value }],
    }),
    []
  );

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-offset.value, { duration: 500 }),
      -1,
      true
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View testID="view" style={[styles.box, animatedStyles]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#b58df1",
    borderRadius: 20,
  },
});

test("test reanimated", () => {
  const { getByTestId } = render(<App />);
  const view = getByTestId("view");

  expect(getAnimatedStyle(view).transform).toEqual([{ translateX: 100 }]);
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(view).transform).toEqual([{ translateX: -100 }]);
});
