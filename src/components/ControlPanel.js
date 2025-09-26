import React, { useState } from 'react';

function ControlPanel({ onStartTest, isTesting }) {
    const [params, setParams] = useState({
        protocol: 'http2',
        pageSizeKB: 1000,
        numRequests: 10,
        bandwidthKbps: 1000,
        delayMs: 50,
        lossPercent: 1,
        repetition: 5,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onStartTest(params);
    };
    
    // 👇 styles.input 부분을 수정했습니다.
    const styles = {
        form: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '20px',
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
        },
        label: {
            marginBottom: '5px',
            fontWeight: 'bold',
            fontSize: '14px',
        },
        input: {
            
            appearance: 'none', 
            WebkitAppearance: 'none', 
            backgroundColor: '#fff', 
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: 'inherit', 
            cursor: 'pointer',
        },
        button: {
            gridColumn: '1 / -1',
            padding: '10px',
            fontSize: '16px',
            cursor: 'pointer',
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}><label htmlFor="protocol" style={styles.label}>Protocol</label><select id="protocol" name="protocol" value={params.protocol} onChange={handleSelectChange} style={styles.input}><option value="http2">HTTP/2</option><option value="http3">HTTP/3</option></select></div>
            <div style={styles.inputGroup}><label htmlFor="pageSizeKB" style={styles.label}>Page Size (KB)</label><input type="number" id="pageSizeKB" name="pageSizeKB" value={params.pageSizeKB} onChange={handleChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label htmlFor="numRequests" style={styles.label}>Num Requests</label><input type="number" id="numRequests" name="numRequests" value={params.numRequests} onChange={handleChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label htmlFor="bandwidthKbps" style={styles.label}>Bandwidth (Kbps)</label><input type="number" id="bandwidthKbps" name="bandwidthKbps" value={params.bandwidthKbps} onChange={handleChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label htmlFor="delayMs" style={styles.label}>Delay (ms)</label><input type="number" id="delayMs" name="delayMs" value={params.delayMs} onChange={handleChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label htmlFor="lossPercent" style={styles.label}>Loss (%)</label><input type="number" id="lossPercent" name="lossPercent" step="0.1" value={params.lossPercent} onChange={handleChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label htmlFor="repetition" style={styles.label}>Repetitions</label><input type="number" id="repetition" name="repetition" value={params.repetition} onChange={handleChange} style={styles.input} /></div>
            <button type="submit" disabled={isTesting} style={styles.button}>{isTesting ? 'Testing...' : 'Start Test'}</button>
        </form>
    );
}

export default ControlPanel;