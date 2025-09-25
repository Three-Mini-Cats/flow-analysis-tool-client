// src/components/ResultsTable.js
import React from 'react';

function ResultsTable({ results }) {
    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
            marginTop: '20px',
            tableLayout: 'fixed',
        },
        th: {
            border: '1px solid #ddd',
            backgroundColor: '#f2f2f2',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            padding: '8px 4px',
        },
        td: {
            border: '1px solid #ddd',
            fontSize: '12px',
            padding: '8px 4px',
            wordBreak: 'break-all',
        }
    };

    return (
        <div style={{ marginTop: '30px' }}>
            <h3>Test Log</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Protocol</th>
                        <th style={styles.th}>Size (KB)</th>
                        <th style={styles.th}>Reqs</th>
                        <th style={styles.th}>BW (Kbps)</th>
                        <th style={styles.th}>Delay</th>
                        <th style={styles.th}>Loss (%)</th>
                        <th style={styles.th}>Reps</th>
                        <th style={styles.th}>Time (s)</th>
                        <th style={styles.th}>Speed (KB/s)</th>
                    </tr>
                </thead>
                <tbody>
                    {results.slice().reverse().map((res, i) => (
                        <tr key={i}>
                            {/* 👇 아래 td 태그들에서 불필요한 '...'를 모두 제거했습니다. */}
                            <td style={styles.td}>{res.params.protocol}</td>
                            <td style={styles.td}>{res.params.pageSizeKB}</td>
                            <td style={styles.td}>{res.params.numRequests}</td>
                            <td style={styles.td}>{res.params.bandwidthKbps}</td>
                            <td style={styles.td}>{res.params.delayMs}</td>
                            <td style={styles.td}>{res.params.lossPercent}</td>
                            <td style={styles.td}>{res.params.repetition}</td>
                            <td style={styles.td}>{res.time.toFixed(4)}</td>
                            <td style={styles.td}>{res.speedKBS.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ResultsTable;