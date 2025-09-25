// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import ProgressDisplay from './components/ProgressDisplay'; // 변경된 부분
import ResultsDisplay from './components/ResultsDisplay';
import AverageTimeDonutChart from './components/AverageTimeDonutChart';
import ResultsTable from './components/ResultsTable';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
    const [params, setParams] = useState({});
    const [isTesting, setIsTesting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [finalResult, setFinalResult] = useState({ time: 0, speedKBS: 0 });
    const [allResults, setAllResults] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://${window.location.hostname}:8000/ws/results`);
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'progress') {
                setProgress(data.percent / 100);
            } else if (data.type === 'complete') {
                const newResult = { ...data, params };
                setFinalResult({ time: newResult.time, speedKBS: newResult.speedKBS });
                setAllResults(prev => [...prev, newResult]);
                setIsTesting(false);
            }
        };
        return () => ws.current.close();
    }, [params]); // params가 변경될 때마다 effect를 재실행하지 않도록 주의 (필요시 로직 수정)

    const startTest = (testParams) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            setParams(testParams);
            setIsTesting(true);
            setProgress(0);
            setFinalResult({ time: 0, speedKBS: 0 });
            ws.current.send(JSON.stringify(testParams));
        } else {
            alert("WebSocket is not connected.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
            <h1>Interactive Performance Dashboard</h1>
            <ControlPanel onStartTest={startTest} isTesting={isTesting} />
            
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', gap: '20px' }}>
                <ProgressDisplay percent={progress} />
                <ResultsDisplay result={finalResult} />
            </div>

            <hr style={{ margin: '40px 0' }} />

            <h2>Cumulative Analysis</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AverageTimeDonutChart results={allResults} />
            </div>
            
            <ResultsTable results={allResults} />
        </div>
    );
}

export default App;