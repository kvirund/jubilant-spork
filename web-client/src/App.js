import React, { useState } from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import CanvasJSReact from './lib/canvasjs.react';

import './App.css';

const ContractionButton = (props) => {
    const [started, setStarted] = useState(false);
    const [variant, setVariant] = useState("primary");
    const [text, setText] = useState("Start");
    const [timer, setTimer] = useState(null);
    const [startTime, setStartTime] = useState(0);

    const checkpoint = (started) => {
        setText("Stop (elapsed " + getElapsedSeconds(started) + " seconds)");

        props.onContractionTick(getElapsedSeconds(started));
    }

    const getElapsedSeconds = (startTime) => {
        return Math.round((Date.now() - startTime)/1000);
    }

    const onClick = () => {
        if (!started) {
            setStarted(true);
            setVariant("success");
            setText("Stop");

            var now = Date.now();
            setStartTime(now);
            setTimer(setInterval(() => checkpoint(now), 1000));
        } else {
            clearInterval(timer);

            setStarted(false);
            setVariant("primary");
            setText("Start");

            props.onNewContraction(getElapsedSeconds(startTime));
        }
    }

    return (
        <Button variant={variant} onClick={onClick}>{text}</Button>
        )
}

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const options = {
      title: {
        text: "Basic Column Chart in React"
      },
      data: [{
                type: "column",
                dataPoints: []
       }]
   }

const App = () => {
    const [chart, setChart] = useState(null);

    var currentColumn = null;

    const onNewContraction = (length) => {
        if (null == currentColumn) {
            currentColumn = {label: Date(Date.now()).toString(), y: length};
            chart.data[0].dataPoints.push(currentColumn);
        } else {
            currentColumn.y = length;
        }

        chart.render();
        currentColumn = null;
    }

    const onContractionTick = (length) => {
        if (null == currentColumn) {
            currentColumn = {label: Date(Date.now()).toString(), y: length};
            chart.data[0].dataPoints.push(currentColumn);
        } else {
            currentColumn.y = length;
        }

        chart.render();
    }

    return (
        <Container className="p-3">
            <div className="container-fluid">
                <CanvasJSChart options={options} onRef={ref => { setChart(ref); console.log(ref); } } />
                <ContractionButton onNewContraction={onNewContraction} onContractionTick={onContractionTick} />
            </div>
        </Container>
    );
}

export default App;
