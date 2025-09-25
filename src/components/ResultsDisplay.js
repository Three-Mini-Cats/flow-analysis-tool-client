// src/components/ResultsDisplay.js
import React from 'react';
// ... 이전과 동일한 코드 ...
function ResultsDisplay({ result }) {
    const { time, speedKBS } = result;
    const displaySpeed = speedKBS > 1024
        ? `${(speedKBS / 1024).toFixed(2)} MB/s`
        : `${speedKBS.toFixed(2)} KB/s`;
    return (
        <div style={{ width: '40%', textAlign: 'center', alignSelf: 'center' }}>
            <h2>Result</h2>
            <p style={{ fontSize: '2em', margin: 0 }}>{displaySpeed}</p>
            <p>({time.toFixed(4)} s)</p>
        </div>
    );
}
export default ResultsDisplay;