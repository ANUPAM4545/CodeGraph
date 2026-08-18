import * as vscode from 'vscode';
import { getApiKey } from '../auth/session';

// For simplicity in development, hardcode or read from settings
const API_BASE = 'http://localhost:8000/api/v1';

export class CodeGraphClient {
    constructor(private context: vscode.ExtensionContext) {}

    async request<T = any>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
        const apiKey = await getApiKey(this.context);
        if (!apiKey) {
            throw new Error('Not authenticated. Please run CodeGraph: Login');
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };

        const config: RequestInit = {
            method,
            headers
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, config);
        if (!response.ok) {
            if (response.status === 401) {
                vscode.window.showErrorMessage('CodeGraph authentication failed. Your API key may have been revoked.');
            }
            throw new Error(`API Request failed: ${response.statusText}`);
        }
        
        return (await response.json()) as T;
    }
}
