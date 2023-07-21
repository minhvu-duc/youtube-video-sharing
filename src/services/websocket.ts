import WebSocket from "ws";

const wsClients = new Set<WebSocket>();

export default wsClients;
