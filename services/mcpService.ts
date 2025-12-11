
import { Type } from "@google/genai";

const STORAGE_KEY = 'infinity_mcp_servers';

export interface McpServer {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'error' | 'disconnected';
  tools?: any[];
  lastError?: string;
}

export const getMcpServers = (): McpServer[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveMcpServers = (servers: McpServer[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
};

const rpcCall = async (serverUrl: string, method: string, params: any = {}) => {
    const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            serverUrl,
            payload: {
                jsonrpc: "2.0",
                method,
                params,
                id: Date.now()
            }
        })
    });
    return await response.json();
};

export const fetchMcpTools = async (serverUrl: string) => {
    // Call list tools
    const res = await rpcCall(serverUrl, 'tools/list');
    
    if (res.error) {
        throw new Error(res.error.message || 'MCP RPC Error');
    }
    
    return res.result?.tools || [];
};

export const addMcpServer = async (name: string, url: string): Promise<McpServer> => {
    const servers = getMcpServers();
    const newServer: McpServer = { 
        id: Date.now().toString(), 
        name, 
        url, 
        status: 'disconnected' 
    };

    try {
        const tools = await fetchMcpTools(url);
        newServer.status = 'connected';
        newServer.tools = tools;
    } catch (e: any) {
        console.error("Failed to connect to MCP server", e);
        newServer.status = 'error';
        newServer.lastError = e.message;
    }

    const updated = [...servers, newServer];
    saveMcpServers(updated);
    return newServer;
};

export const refreshMcpServer = async (id: string): Promise<McpServer | null> => {
    const servers = getMcpServers();
    const index = servers.findIndex(s => s.id === id);
    if (index === -1) return null;

    const server = servers[index];
    try {
        const tools = await fetchMcpTools(server.url);
        server.status = 'connected';
        server.tools = tools;
        server.lastError = undefined;
    } catch (e: any) {
        server.status = 'error';
        server.lastError = e.message;
    }

    saveMcpServers(servers);
    return server;
};

export const removeMcpServer = (id: string) => {
    const servers = getMcpServers().filter(s => s.id !== id);
    saveMcpServers(servers);
};

export const executeMcpTool = async (serverUrl: string, toolName: string, args: any) => {
    const res = await rpcCall(serverUrl, 'tools/call', {
        name: toolName,
        arguments: args
    });

    if (res.error) {
        throw new Error(res.error.message || 'Tool Execution Failed');
    }

    // Standard MCP content response
    const content = res.result?.content || [];
    // Convert content array to a single string for the LLM
    return content.map((c: any) => c.text || JSON.stringify(c)).join('\n') || 'Success';
};

export const mcpToolToGemini = (mcpTool: any) => {
    return {
        name: mcpTool.name,
        description: mcpTool.description,
        parameters: {
            type: Type.OBJECT,
            properties: mcpTool.inputSchema?.properties || {},
            required: mcpTool.inputSchema?.required || []
        }
    };
};
