import express from "express";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Server } from "socket.io";
const http = await import("http");

const stockForecastPath = path.resolve("data/stockForecast.json");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

if (!existsSync(path.resolve("/data/stockForecast.json"))) await mkdir(path.resolve("/data"));

const connections = {};
const currentValues = [];

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ hello: 123 });
});

app.route("/api")
	.post(async (req, res) => {
		const recieved = req.body;

		if (!Array.isArray(recieved) || recieved.some(value => typeof value.x !== "number" || typeof value.y !== "number")) return res.sendStatus(403);

		await writeFile(stockForecastPath, JSON.stringify(recieved, undefined, 2), "utf-8");

		res.sendStatus(200);

		await sendAllData();
	})
	.put(async (req, res) => {
		const recieved = req.body;

		if (typeof recieved.x !== "number" || typeof recieved.y !== "number") return res.sendStatus(403);

		const data = JSON.parse(await readFile(stockForecastPath, "utf-8"));

		data.push(recieved);

		await writeFile(stockForecastPath, JSON.stringify(data, undefined, 2), "utf-8");

		res.sendStatus(200);

		sendData(recieved);
	})
	.get(async (req, res) => {
		const data = JSON.parse(await readFile(stockForecastPath, "utf-8"));

		return res.status(200).json(data);
	})
	.delete(async (req, res) => {
		await writeFile(stockForecastPath, JSON.stringify([]), "utf-8");

		res.sendStatus(200);
	});

io.on("connection", async (socket) => {
	connections[socket.id] = { socket };

	console.log(`${socket.id} connected!`);

	socket.emit("setupData", JSON.parse(await readFile(stockForecastPath, "utf-8")));

	socket.on("disconnect", () => {
		delete connections[socket.id];

		console.log(`${socket.id} disconnected!`);
	});
});

server.listen(3000, () => {
	console.log("Listening on Port 3000!");
});

function sendData(value) {
	for (const socketId of Object.keys(connections)) connections[socketId].socket.emit("data", value);
}

async function sendAllData() {
	for (const socketId of Object.keys(connections)) connections[socketId].socket.emit("setupData", JSON.parse(await readFile(stockForecastPath, "utf-8")));
}