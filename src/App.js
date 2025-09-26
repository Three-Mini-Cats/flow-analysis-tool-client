// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import ProgressDisplay from './components/ProgressDisplay';
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

    // --- 👇 이 부분이 수정되었습니다 ---
    useEffect(() => {
        // 1. 새로운 웹소켓 주소로 변경
        const wsUrl = 'ws://localhost:3010';
        ws.current = new WebSocket(wsUrl);

        // 2. 연결 상태 로깅 (디버깅에 유용) 
        ws.current.onopen = () => console.log("WebSocket Connected");
        ws.current.onclose = () => console.log("WebSocket Disconnected");
        ws.current.onerror = (error) => console.error("WebSocket Error:", error);

        // 3. 메시지 수신 로직
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'progress') {
                setProgress(data.percent / 100);
            } else if (data.type === 'complete') {
                // 'params' state를 직접 참조하여 최신 상태를 보장
                setParams(currentParams => {
                    const newResult = { ...data, params: currentParams };
                    setFinalResult({ time: newResult.time, speedKBS: newResult.speedKBS });
                    setAllResults(prev => [...prev, newResult]);
                    setIsTesting(false);
                    return currentParams; // params 상태는 변경하지 않음
                });
            }
        };
        
        // 4. 컴포넌트가 사라질 때 연결을 정리
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []); // 5. 빈 배열로 변경: 웹소켓 연결은 처음에 한 번만 실행

    const startTest = (testParams) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            setParams(testParams); // 현재 테스트 파라미터 저장
            setIsTesting(true);
            setProgress(0);
            setFinalResult({ time: 0, speedKBS: 0 });

            const messageToSend = {
            event: 'startTest', 
            data: testParams,
            };
            
            ws.current.send(JSON.stringify(messageToSend));
        } else {
            alert("WebSocket is not connected. Please check the server and network.");
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

            <h2>Live Session Analysis</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AverageTimeDonutChart results={allResults} />
            </div>
            
            <ResultsTable results={allResults} />
        </div>
    );
}

export default App;