import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useTrafficSocket = () => {
    const [socket, setSocket] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [flows, setFlows] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // 1. 트래픽 분석 요청
    const startAnalysis = useCallback((payload) => {
        if (socket && !isRunning) {
            setStatusMessage('트래픽 분석 요청 중...');
            socket.emit('startTest', payload);
        }
    }, [socket, isRunning]);

    // 2. 소켓 연결 및 이벤트 리스너 설정
    useEffect(() => {
        const newSocket = io("localhost:3010/ws/traffic/traffic-session-12345", {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('Socket Connected:', newSocket.id);
            setSocket(newSocket);
            setStatusMessage('서버와 연결되었습니다. 분석 준비 완료.');
        });

        newSocket.on('startTestResponse', (data) => {
            if (data.success) {
                setSessionId(data.sessionId);
                setIsRunning(true);
                setStatusMessage(`분석 시작: 세션 ID ${data.sessionId}`);
            } else {
                setStatusMessage(`분석 시작 실패: ${data.message}`);
                setIsRunning(false);
            }
        });
        // 실시간 플로우 데이터 수신 및 상태 업데이트
        newSocket.on('trafficUpdate', (msg) => {
            console.log('Received flowUpdate');
            setFlows(msg.flows);
        });

        newSocket.on('sessionEnded', (data) => {
            setStatusMessage(`세션 종료: ${data.message}`);
            setIsRunning(false);
            setSessionId(null);
        });
        
        // 연결 실패 및 에러 처리 추가
        newSocket.on('connect_error', (err) => {
            console.error('Connection Error:', err);
            setStatusMessage(`연결 오류: 서버 주소 또는 CORS 설정 확인 (${err.message})`);
            setSocket(null);
            setIsRunning(false);
        });


        newSocket.on('disconnect', () => {
            console.log('Socket Disconnected');
            setSocket(null);
            setIsRunning(false);
            setStatusMessage('서버 연결 끊김');
        });

        return () => newSocket.close();
    }, []);

    // 3. 분석 중지
    const stopAnalysis = useCallback(() => {
        if (socket && isRunning && sessionId) {
            setStatusMessage('분석 중지 요청 완료');
            socket.emit('stopTest', { sessionId }); 
            setIsRunning(false); 
        }
    }, [socket, isRunning, sessionId]);

    return {
        flows,
        isRunning,
        statusMessage,
        startAnalysis,
        stopAnalysis,
        sessionId,
    };
};