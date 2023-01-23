import { useEffect, useMemo, useState } from 'react'
import { io as socketIO } from 'socket.io-client';
import { Graph } from "../components/Graph";
import './App.css'
import { Serie } from '@nivo/line';

export function App(): React.ReactElement {
	const [data, setData] = useState<Serie[] | null>(null);

	const io = useMemo(() => {
		console.log("Creating io!");

		return socketIO("http://localhost:3000", {
			transports: ["websocket", "polling"]
		});
	}, []);

	useEffect(() => {
		io.on("data", (newData: { x: number, y: number }) => {
			setData(previous => {
				if (previous === null) return [{ id: "data", data: [newData] }];

				const newArray = [...previous[0].data, newData];

				return [{
					id: previous[0].id,
					data: newArray
				}];
			});
		});
		io.on("setupData", (values: { x: number, y: number }[]) => {
			setData([{ id: "data", data: values }]);
		});
	}, []);

	const average = data !== null ? data[0].data.map(entry => entry.y as number).reduce((a, b) => a + b) / data[0].data.length : data;

	const slicedData = data !== null ? data[0].data.slice(Math.min(data.length - 50, 0)) : data;
	const convertedSerie: Serie | null = data !== null ? { id: data[0].id, data: (slicedData !== null && slicedData.length > 0) ? slicedData : data[0].data } : data;


	return (
		<>
			{data !== null && <div className="average-display">{average}</div>}
			{(data !== null && convertedSerie !== null) ? <Graph data={[convertedSerie]} /> : <div className="no-data">No data recieved!</div>}
		</>
	)
}
