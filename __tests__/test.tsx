import { Button, View } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import Animated, {
  useSharedValue,
  getAnimatedStyle,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

jest.useFakeTimers();

test("inline styles - fails", () => {
  /**
   * Example taken from https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation#using-a-shared-value
   */
  function InlineStyle() {
    const width = useSharedValue(100);

    const handlePress = () => {
      width.value = width.value + 50;
    };

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Animated.View
          testID="view"
          style={{
            width,
            height: 100,
            backgroundColor: "violet",
          }}
        />
        <Button testID="button" onPress={handlePress} title="Click me" />
      </View>
    );
  }

  render(<InlineStyle />);
  const view = screen.getByTestId("view");
  const button = screen.getByTestId("button");

  expect(getAnimatedStyle(view)).toEqual({ width: 100 });

  fireEvent.press(button);

  expect(getAnimatedStyle(view)).toEqual({ width: 150 });
});

test("useAnimatedStyle() - fails", () => {
  function UseAnimatedStyle() {
    const width = useSharedValue(100);

    const handlePress = () => {
      width.value = width.value + 50;
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: width.value,
      };
    }, [width]);

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Animated.View testID="view" style={animatedStyle} />
        <Button testID="button" onPress={handlePress} title="Click me" />
      </View>
    );
  }

  render(<UseAnimatedStyle />);
  const view = screen.getByTestId("view");
  const button = screen.getByTestId("button");

  expect(getAnimatedStyle(view)).toEqual({ width: 100 });

  fireEvent.press(button);

  expect(getAnimatedStyle(view)).toEqual({ width: 150 });
});

test("useAnimatedStyle() - works", () => {
  /**
   * This test works because we are using `withTiming` and running the jest timers
   * Just changing the value doesn't work
   */
  function UseAnimatedStyle() {
    const width = useSharedValue(100);

    const handlePress = () => {
      width.value = withTiming(width.value + 50, { duration: 500 });
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: width.value,
      };
    }, [width]);

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Animated.View testID="view" style={animatedStyle} />
        <Button testID="button" onPress={handlePress} title="Click me" />
      </View>
    );
  }

  render(<UseAnimatedStyle />);
  const view = screen.getByTestId("view");
  const button = screen.getByTestId("button");

  expect(getAnimatedStyle(view)).toEqual({ width: 100 });

  fireEvent.press(button);

  jest.runAllTimers();

  expect(getAnimatedStyle(view)).toEqual({ width: 150 });
});
