import React from 'react'
import { ResponsiveLine, Serie } from '@nivo/line'

interface IProps {
	data: Serie[];
}

export function Graph({ data }: IProps): React.ReactElement {
	return (
		<>
			<div className="graph-container">
				<ResponsiveLine data={data} xScale={{ type: "linear", min: "auto", max: "auto" }} yScale={{ type: "linear", min: "auto", max: "auto" }} axisTop={null} axisRight={null} axisBottom={{ tickSize: 1, legend: "time" }} axisLeft={{ tickSize: 1, legend: "money" }} pointSize={10} pointBorderWidth={2} useMesh={true} margin={{ top: 50, right: 50, bottom: 50, left: 50 }} colors={{ scheme: "blues" }} theme={{ fontSize: 20, textColor: "rgba(200, 200, 200, 0.87)" }} animate={false} />
			</div>
		</>
	)
}
