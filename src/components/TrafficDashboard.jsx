import React, { useState } from 'react';
import { useTrafficSocket } from '../hooks/useTrafficSocket';
import FlowTable from './FlowTable';
import './TrafficDashBoard.css';

const TrafficDashboard = () => {
    const { flows, isRunning, statusMessage, startAnalysis, stopAnalysis, sessionId } = useTrafficSocket();
    
    const [interfaceName, setInterfaceName] = useState('enp70s0'); 
    const [protocol, setProtocol] = useState('tcp');
    const [duration, setDuration] = useState(60);
    const [bpfFilter, setBpfFilter] = useState('');
    const [captureLimit, setCaptureLimit] = useState(1000);

    const handleStart = () => {
        const payload = {
            interface: interfaceName,
            protocol: protocol,
            duration: parseInt(duration, 10),
            bpfFilter: bpfFilter.trim() || undefined, 
            captureLimit: parseInt(captureLimit, 10) > 0 ? parseInt(captureLimit, 10) : undefined,
        };
        startAnalysis(payload);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>실시간 트래픽 분석 대시보드 🚦</h1>
                <p className="status-bar">
                    상태: <strong className={isRunning ? 'running' : 'stopped'}>{isRunning ? '분석 중' : '대기 중'}</strong> | {statusMessage}
                </p>
            </header>

            <div className="controls-grid">
                <div className="control-item">
                    <label>인터페이스</label>
                    <input 
                        type="text" 
                        placeholder="예: eth0" 
                        value={interfaceName} 
                        onChange={(e) => setInterfaceName(e.target.value)} 
                        disabled={isRunning}
                    />
                </div>
                <div className="control-item">
                    <label>프로토콜</label>
                    <select 
                        value={protocol} 
                        onChange={(e) => setProtocol(e.target.value)}
                        disabled={isRunning}
                    >
                        <option value="tcp">TCP</option>
                        <option value="udp">UDP</option>
                        <option value="icmp">ICMP</option>
                        <option value="quic">QUIC</option>
                    </select>
                </div>
                <div className="control-item">
                    <label>지속 시간 (초)</label>
                    <input 
                        type="number" 
                        placeholder="0은 무제한" 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)} 
                        disabled={isRunning}
                    />
                </div>
                <div className="control-item">
                    <label>패킷 캡처 제한</label>
                    <input 
                        type="number" 
                        placeholder="0은 무제한" 
                        value={captureLimit} 
                        onChange={(e) => setCaptureLimit(e.target.value)} 
                        disabled={isRunning}
                    />
                </div>
                <div className="control-item bpf-filter">
                    <label>BPF 필터 (선택)</label>
                    <input 
                        type="text" 
                        placeholder="예: host 1.1.1.1 and port 443" 
                        value={bpfFilter} 
                        onChange={(e) => setBpfFilter(e.target.value)} 
                        disabled={isRunning}
                    />
                </div>
                
                <div className="control-item action-button">
                    {!isRunning ? (
                        <button onClick={handleStart} disabled={!interfaceName}>
                            분석 시작
                        </button>
                    ) : (
                        <button onClick={stopAnalysis} className="stop-button">
                            분석 중지
                        </button>
                    )}
                </div>
            </div>

            <div className="flow-data-section">
                <h3>실시간 플로우 데이터 (세션: {sessionId || '없음'})</h3>
                {flows.length > 0 ? (
                    <FlowTable flows={flows} isRunning={isRunning} />
                ) : (
                    <div className="no-data-placeholder">
                        <p>{isRunning ? '플로우 데이터를 수신하는 중입니다...' : '분석 시작을 기다리는 중입니다.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrafficDashboard;