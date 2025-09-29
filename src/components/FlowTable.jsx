const FlowTable = ({ flows, isRunning }) => {
    const sortedFlows = [...flows].sort((a, b) => b.throughputBps - a.throughputBps);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatBps = (bps) => {
        if (bps === 0) return '0 bps';
        const k = 1000;
        const sizes = ['bps', 'kbps', 'Mbps', 'Gbps', 'Tbps'];
        const i = Math.floor(Math.log(bps) / Math.log(k));
        return parseFloat((bps / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDownloadCsv = () => {
        if (flows.length === 0) {
            alert("다운로드할 데이터가 없습니다.");
            return;
        }

        const headers = [
            "Flow ID",
            "Source IP",
            "Destination IP",
            "Protocol",
            "Duration (ms)",
            "Tx Packets",
            "Rx Packets",
            "Tx Bytes",
            "Rx Bytes",
            "Throughput (Total bps)",
            "Retransmits"
        ];

        const rows = sortedFlows.map(flow => [
            `"${flow.flowId}"`,
            flow.srcIp,
            flow.dstIp,
            flow.protocol,
            (flow.durationSec * 1000).toFixed(3),
            flow.txPackets,
            flow.rxPackets,
            flow.txBytes,
            flow.rxBytes,
            flow.throughputBps,
            flow.retransmits
        ].join(','));

        const bom = "\uFEFF";
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.setAttribute("download", `flows-export-${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flow-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Source IP</th>
                        <th>Destination IP</th>
                        <th>Protocol</th>
                        <th>지속 시간 (ms)</th>
                        <th>Tx/Rx 패킷</th>
                        <th>Tx/Rx 바이트</th>
                        <th>처리량 (Total)</th>
                        <th>재전송 (Retrans.)</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFlows.map((flow) => (
                        <tr key={flow.flowId} className={flow.retransmits > 0 ? 'warning-row' : ''}>
                            <td>{flow.srcIp}</td>
                            <td>{flow.dstIp}</td>
                            <td>{flow.protocol}</td>
                            <td>{(flow.durationSec * 1000).toFixed(3)} ms</td>
                            <td>{flow.txPackets} / {flow.rxPackets}</td>
                            <td>{formatBytes(flow.txBytes)} / {formatBytes(flow.rxBytes)}</td>
                            <td><strong>{formatBps(flow.throughputBps)}</strong></td>
                            <td style={{ color: flow.retransmits > 0 ? 'red' : 'inherit' }}>{flow.retransmits}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(flows.length > 0 || isRunning) && ( // 실행 완료 후 CSV 파일 다운 가능
                <div className="download-button-container">
                    <button onClick={handleDownloadCsv} disabled={isRunning}>
                        CSV 다운로드 💾
                    </button>
                </div>
            )}
        </div>
    );
};

export default FlowTable;