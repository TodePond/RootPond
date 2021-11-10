
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
canvas.style["background-color"] = Colour.Black
canvas.style["margin"] = 0

on.load(() => {
	document.body.appendChild(canvas)
	document.body.style["overflow"] = "hidden"
	document.body.style["margin"] = "0px"
	
	
	for (const time of timeline) {
		const img = document.createElement("img")
		img.src = `thumbs/${time.number}.jpg`
		time.img = img
	}
	
	setInterval(tick, 1000 / 60)
})

on.resize(() => {
	canvas.height = innerHeight
	canvas.width = innerWidth
	canvas.style["height"] = canvas.height
	canvas.style["width"] = canvas.width
})

trigger("resize")

const TIMELINE_LENGTH = 30
const timeline = []
for (let i = 0; i < TIMELINE_LENGTH; i++) {
	timeline.push({number: i+1})
}

const tick = () => {
	updateCamera()
	draw()
}

const draw = () => {
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawTimeline()
}

const BOTTOM_GAP = 50

const drawTimeline = () => {
	let x = camera.x
	let y = canvas.height - BOTTOM_GAP
	
	for (const time of timeline) {
		drawTime(time, x, y)
		
		if (time.number >= TIMELINE_LENGTH) break
		
		
		context.strokeStyle = Colour.White
		context.lineWidth = 30 * camera.scale
		//context.setLineDash([10])
		
		context.beginPath()
		context.moveTo(x, y)
		
		x += getDistance()
		
		context.lineTo(x, y)
		context.closePath()
		context.stroke()
	}
	
}

const getDistance = () => {
	return timeline[0].img.width * 2 * camera.scale
}

const camera = {
	scale: 0.5,
	x: 720,
	dx: 0,
	dscale: 1.0,
}

const updateCamera = () => {
	camera.x += camera.dx
	camera.scale *= camera.dscale
}

on.keydown(e => {
	if (e.key === "ArrowRight") {
		camera.dx -= 0.5
	}
	else if (e.key === "ArrowLeft") {
		camera.dx += 0.5
	}
	else if (e.key === "ArrowDown") {
		camera.dscale -= 0.001
	}
	else if (e.key === "ArrowUp") {
		camera.dscale += 0.001
	}
})

const getThumbHeight = () => {
	const ratio = timeline[0].img.height / timeline[0].img.width
	//let height = camera.scale * 2 * timeline[0].img.height
	//canvas.height - (130*2)
	return getThumbWidth() * ratio
}

const getThumbWidth = () => {
	let width = getDistance() * 0.98 - 40
	return Math.min(width, 720)
	//const height = getThumbHeight()
	//const ratio = timeline[0].img.height / timeline[0].img.width
	//return height / ratio
}

const drawTime = (time, x, y) => {
	context.beginPath()
	context.arc(x, y, 50 * camera.scale, 0, 2*Math.PI)
	context.fillStyle = Colour.White
	context.fill()
	
	const height = getThumbHeight()
	const width = getThumbWidth()
	
	context.drawImage(time.img, x - width/2, y - height * 1.2, width, height)
	
}