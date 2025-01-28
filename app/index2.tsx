import React from "react"
import { Dimensions } from "react-native"
import { Canvas, SweepGradient, vec, RoundedRect } from "@shopify/react-native-skia"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"
import * as Haptics from "expo-haptics"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const SQUARE_COUNT_HORIZONTAL = 50
const SQUARE_CONTAINER_SIZE = SCREEN_WIDTH / SQUARE_COUNT_HORIZONTAL
const PADDING = 1
const SQUARE_SIZE = SQUARE_CONTAINER_SIZE - PADDING * 2
const CANVAS_WIDTH = SCREEN_WIDTH
const colorPalettes = [
	["yellow", "purple", "orange"],
	["magenta", "pink", "cyan"],
	["lime", "teal", "indigo"],
	["violet", "fuchsia", "gold"],
	["silver", "gray", "black"],
	["maroon", "olive", "navy"],
	["coral", "turquoise", "salmon"],
	["chocolate", "peru", "sienna"],
	["lavender", "thistle", "plum"],
	["khaki", "beige", "wheat"],
	["crimson", "firebrick", "darkred"],
	["lightblue", "lightgreen", "lightcoral"],
	["darkblue", "darkgreen", "darkmagenta"],
]

const Home = () => {
	const insets = useSafeAreaInsets()
	const SCREEN_HEIGHT = Dimensions.get("window").height - insets.top - insets.bottom
	const SQUARE_AMOUNT_VERTICAL = Math.floor(SCREEN_HEIGHT / SQUARE_CONTAINER_SIZE)
	const CANVAS_HEIGHT = SQUARE_AMOUNT_VERTICAL * SQUARE_CONTAINER_SIZE

	const getRandomPalette = () => {
		return colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
	}
	const [endColor, middleColor, middleTwoColor] = getRandomPalette().map((color) =>
		useSharedValue(color),
	)
	const colors = useDerivedValue(() => {
		return [endColor.value, middleColor.value, middleTwoColor.value, endColor.value]
	}, [])

	const centerLeft = useSharedValue(Math.floor(Math.random() * CANVAS_WIDTH))
	const centerRight = useSharedValue(Math.floor(Math.random() * CANVAS_HEIGHT))
	const centerValue = useDerivedValue(() => {
		return vec(centerLeft.value, centerRight.value)
	})

	const touchHandler = (event: any) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
		if (event[0] && event[0][0] && event[0][0].type === 0) {
			// set new center for sweep gradient
			centerLeft.value = withTiming(Math.floor(Math.random() * CANVAS_WIDTH))
			centerRight.value = withTiming(Math.floor(Math.random() * CANVAS_HEIGHT))
			// animate color change
			// get new set of gradient colors
			const [newEndColor, newMiddleColor, newMiddleTwoColor] = getRandomPalette()
			endColor.value = withTiming(newEndColor)
			middleColor.value = withTiming(newMiddleColor)
			middleTwoColor.value = withTiming(newMiddleTwoColor)
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
			<Canvas
				style={{ flex: 1, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
				onTouch={touchHandler}
			>
				{new Array(SQUARE_AMOUNT_VERTICAL).fill(null).map((_, i) =>
					new Array(SQUARE_COUNT_HORIZONTAL).fill(null).map((_, j) => (
						<RoundedRect
							key={`i${i}-j${j}`}
							x={j * SQUARE_CONTAINER_SIZE + PADDING}
							y={i * SQUARE_CONTAINER_SIZE + PADDING}
							width={SQUARE_SIZE}
							height={SQUARE_SIZE}
							r={4}
						>
							<SweepGradient c={centerValue} colors={colors} />
						</RoundedRect>
					)),
				)}
			</Canvas>
		</SafeAreaView>
	)
}

export default Home
