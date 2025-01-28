import React from "react"
import { Dimensions } from "react-native"
import {
	Canvas,
	SweepGradient,
	vec,
	RoundedRect,
	Atlas,
	rect,
	useRSXformBuffer,
	useTexture,
	Group,
	Rect,
} from "@shopify/react-native-skia"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"
import * as Haptics from "expo-haptics"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const SQUARE_COUNT_HORIZONTAL = 50
const SQUARE_CONTAINER_SIZE = SCREEN_WIDTH / SQUARE_COUNT_HORIZONTAL
const PADDING = 1
const CANVAS_WIDTH = SCREEN_WIDTH
const size = { width: 25, height: 11.25 }
const strokeWidth = 2
const numberOfBoxes = 150
const width = 256
const textureSize = {
	width: size.width + strokeWidth,
	height: size.height + strokeWidth,
}

const Home = () => {
	const pos = useSharedValue({ x: 0, y: 0 })
	const insets = useSafeAreaInsets()
	const SCREEN_HEIGHT = Dimensions.get("window").height - insets.top - insets.bottom
	const SQUARE_AMOUNT_VERTICAL = Math.floor(SCREEN_HEIGHT / SQUARE_CONTAINER_SIZE)
	const CANVAS_HEIGHT = SQUARE_AMOUNT_VERTICAL * SQUARE_CONTAINER_SIZE

	const sprites = new Array(numberOfBoxes)
		.fill(0)
		.map(() => rect(0, 0, textureSize.width, textureSize.height))

	const texture = useTexture(
		<Rect
			rect={rect(strokeWidth / 2, strokeWidth / 2, size.width, size.height)}
			color="blue"
			style="stroke"
		/>,
		textureSize,
	)

	const transforms = useRSXformBuffer(numberOfBoxes, (val, i) => {
		"worklet"
		const tx = 5 + ((i * size.width) % width)
		const ty = 25 + Math.floor(i / (width / size.width)) * size.width
		const r = Math.atan2(pos.value.y - ty, pos.value.x - tx)
		val.set(Math.cos(r), Math.sin(r), tx, ty)
	})

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
			<Canvas style={{ flex: 1, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
				<Atlas image={texture} sprites={sprites} transforms={transforms} />
			</Canvas>
		</SafeAreaView>
	)
}

export default Home
