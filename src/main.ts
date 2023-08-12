import styles from "./style.module.scss"
import skyImage from "./images/sky.png"

async function loadFont() {
  const url = "url(https://fonts.gstatic.com/s/notosans/v30/o-0IIpQlx3QUlC5A4PNr5TRA.woff2)"
  const font = new FontFace("Noto Sans", url)
  await font.load()
  document.fonts.add(font)
}

async function loadImage(path: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = path
  })
}

async function main() {
  await loadFont()
  await document.fonts.ready
  if (document.fonts.check("1em Noto Sans")) {
    console.log("The font is loaded!")
    render()
  } else {
    console.log("The font is not loaded!")
  }
}

function renderText(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  fontFamily: string,
  x: number,
  y: number,
  rotation = 0
) {
  const gap = 0
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = "blue"
  ctx.font = `${fontSize}px ${fontFamily}`
  const size = ctx.measureText(text)
  ctx.fillText(text, 0, 0)
  ctx.strokeStyle = "red"
  ctx.strokeRect(-gap, -gap - fontSize, size.width + gap * 2, fontSize + gap * 2)
  ctx.rotate(-rotation)
  ctx.translate(-x, -y)
}

async function render() {
  const canvasSize = 1000
  const numGridLines = 10
  const gridSize = canvasSize / numGridLines
  const canvas = document.createElement("canvas")
  canvas.classList.add(styles.canvas)
  document.body.appendChild(canvas)
  canvas.width = canvasSize
  canvas.height = canvasSize
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.lineWidth = 2
  for (let i = 1; i < numGridLines; i += 1) {
    const x = i * gridSize
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 1000)
    ctx.closePath()
    ctx.stroke()
  }
  for (let i = 1; i < numGridLines; i += 1) {
    const y = i * gridSize
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(1000, y)
    ctx.closePath()
    ctx.stroke()
  }

  renderText(ctx, "Noto Sans: Hey World", 30, "Noto Sans", gridSize * 4, gridSize * 4)
  renderText(ctx, "Noto Sans: Vertical", 20, "Noto Sans", gridSize * 2, gridSize * 6, Math.PI / 2)
  renderText(ctx, "Arial: Hey World", 20, "Arial", gridSize, gridSize * 4)

  const image = await loadImage(skyImage)
  ctx.drawImage(image, gridSize, gridSize, image.width, image.height)
  ctx.strokeStyle = "black"
  ctx.strokeRect(gridSize, gridSize, image.width, image.height)
}

main()