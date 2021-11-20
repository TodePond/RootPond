
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
canvas.style["background-color"] = Colour.Black
canvas.style["margin"] = 0


const TIMELINE_LENGTH = 30
const timeline = []
for (let i = 0; i < TIMELINE_LENGTH; i++) {
	timeline.push({number: i+1})
}
for (const time of timeline) {
	const img = document.createElement("img")
	img.src = `images/${time.number}.jpg`
	time.img = img
}

const plane = document.createElement("img")
plane.src = `images/plane.png`

on.load(() => {
	document.body.appendChild(canvas)
	document.body.style["overflow"] = "hidden"
	document.body.style["margin"] = "0px"	
	setInterval(tick, 1000 / 60)
})

on.resize(() => {
	canvas.height = innerHeight
	canvas.width = innerWidth
	canvas.style["height"] = canvas.height
	canvas.style["width"] = canvas.width
})

trigger("resize")
	
timeline[0].name = "2D Falling Sand"

const tick = () => {
	updateCamera()
	draw()
}

const camera = {
	scale: 10.0,
	x: 300,
	dx: 0,
	dscale: 1.0,
	focus: 0,
	dfocus: 0,
}

const zoom = (dscale) => {
	const amount = camera.scale*dscale - camera.scale
	camera.x -= amount * camera.focus
	camera.scale += amount
}

const updateCamera = () => {
	camera.x += camera.dx
	camera.focus += camera.dfocus
	zoom(camera.dscale)
}

const WASD_MOVE_SPEED = 10.0
const WASD_ZOOM_SPEED = 0.01
const WASD_FOCUS_SPEED = 10.0
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
	
	else if (e.key === "d") {
		camera.dx = -WASD_MOVE_SPEED
	}
	else if (e.key === "a") {
		camera.dx = WASD_MOVE_SPEED
	}
	else if (e.key === "w") {
		camera.dscale = 1 + WASD_ZOOM_SPEED
	}
	else if (e.key === "s") {
		camera.dscale = 1 - WASD_ZOOM_SPEED
	}
	
	else if (e.key === "e") {
		camera.dfocus = WASD_FOCUS_SPEED / camera.scale
	}
	
	else if (e.key === "q") {
		camera.dfocus = -WASD_FOCUS_SPEED / camera.scale
	}
})

on.keyup(e => {
	if (e.key === "d") {
		if (camera.dx < 0) camera.dx = 0
	}
	else if (e.key === "a") {
		if (camera.dx > 0) camera.dx = 0
	}
	else if (e.key === "w") {
		if (camera.dscale > 1.0) camera.dscale = 1.0
	}
	else if (e.key === "s") {
		if (camera.dscale < 1.0) camera.dscale = 1.0
	}
	
	else if (e.key === "e") {
		if (camera.dfocus > 0) camera.dfocus = 0
	}
	
	else if (e.key === "q") {
		if (camera.dfocus < 0) camera.dfocus = 0
	}
})

const draw = () => {
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawTimeline()
}

const BOTTOM_GAP = 50
const PLANE_SCALE = 0.2
const drawTimeline = () => {
	
	const x = 0 + camera.x
	const y = canvas.height - BOTTOM_GAP
	const width = canvas.width * camera.scale
	
	context.strokeStyle = Colour.White
	context.lineWidth = 8
	context.beginPath()
	context.moveTo(x, y)
	context.lineTo(x + width, y)
	context.stroke()
	
	for (const time of timeline) {
		drawTime(time)
		
	}
	
	const planeWidth = plane.width * PLANE_SCALE
	const planeHeight = plane.height * PLANE_SCALE
	context.drawImage(plane, camera.x + camera.scale * (camera.focus) - planeWidth/2, y - planeHeight * 0.45, planeWidth, planeHeight)
	
}

const THUMB_SCALE = 0.1
const drawTime = (time) => {
	
	const gap = (canvas.width / (timeline.length-1)) * camera.scale
	const x = ((time.number-1) * gap + camera.x)
	const y = canvas.height - BOTTOM_GAP
	
	context.beginPath()
	const csize = Math.max(8, Math.min(10, 1 * camera.scale))
	context.arc(x, y, csize, 0, 2*Math.PI)
	context.fillStyle = Colour.White
	context.fill()

	const width = gap * 0.8
	const height = time.img.height / time.img.width * width

	const ihover = Math.max(BOTTOM_GAP*camera.scale*0.1, BOTTOM_GAP/2)
	const iy = y - ihover - height
	const ix = x - width/2

	
	context.strokeStyle = Colour.White
	context.lineWidth = 1 * camera.scale
	context.strokeRect(ix, iy, width, height)

	context.drawImage(time.img, ix, iy, width, height)


}
