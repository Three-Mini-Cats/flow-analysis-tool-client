// src/components/AverageTimeDonutChart.js
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
// ... 이전과 동일한 코드 ...
function AverageTimeDonutChart({ results }) {
    const data = useMemo(() => {
        const h2 = results.filter(r => r.params.protocol === 'http2');
        const h3 = results.filter(r => r.params.protocol === 'http3');
        const h2Avg = h2.length ? h2.reduce((acc, cur) => acc + cur.time, 0) / h2.length : 0;
        const h3Avg = h3.length ? h3.reduce((acc, cur) => acc + cur.time, 0) / h3.length : 0;
        return {
            labels: ['HTTP/2 Avg Time', 'HTTP/3 Avg Time'],
            datasets: [{
                data: [h2Avg, h3Avg],
                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
            }]
        };
    }, [results]);
    return (
        <div style={{ width: '40%', minWidth: '300px', margin: 'auto' }}>
            <Doughnut data={data} />
        </div>
    );
}
export default AverageTimeDonutChart;