# flow-analysis-tool-client: A Real-Time Traffic Flow Dashboard

This project is the frontend client for the flow-analysis-tool-server.
It provides a web-based dashboard to control and visualize real-time network traffic flows.
The application connects to the backend via WebSocket to receive a live stream of aggregated flow data.

# Feature
- Real-time Visualization: Displays network flow data streamed from the backend via WebSocket.
- Session Control: Start and stop analysis sessions directly from the UI.
- Configurable Capture: Set analysis parameters including Interface, Protocol, Duration, Packet Limit, and BPF Filter.
- Interactive Flow Table:
    - Sorts flows by throughput in real-time.
    - Features a scrollable body with a sticky header for large datasets.
    - Visually highlights flows with TCP retransmissions.
- CSV Export: Download the results of an analysis session as a .csv file.

# Start

## 1. Requirement

This project was carried out in the following environment.

- **Node.js v23.11.1**
- **npm v10.9.2**

1. **Clone this repository**
   ```bash
   git clone https://github.com/Three-Mini-Cats/flow-analysis-tool-client.git
   cd flow-analysis-tool-client
   ```

2. **Install dependancy**
   ```bash
   npm install
   ```

3. **Run client**
   ```bash
   npm start
   ```