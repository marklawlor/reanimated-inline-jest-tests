import { Button, View } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import Animated, {
  useSharedValue,
  getAnimatedStyle,
} from "react-native-reanimated";

jest.useFakeTimers();

test("inline styles", () => {
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

  expect(getAnimatedStyle(view).width).toEqual(100);

  fireEvent.press(button);

  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(view).width).toEqual(150);
});
