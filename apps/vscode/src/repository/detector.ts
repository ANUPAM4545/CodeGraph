import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { CodeGraphClient } from '../api/client';

const execAsync = promisify(exec);

export interface DetectedRepository {
    id: string; // The backend repo_id
    owner: string;
    name: string;
    branch: string;
    commitSha: string;
    versionId?: string; // The backend version_id
}

export class RepositoryDetector {
    private currentRepo: DetectedRepository | undefined;

    constructor() {}

    async detect(client: CodeGraphClient): Promise<DetectedRepository | undefined> {
        if (this.currentRepo) return this.currentRepo;

        const folders = vscode.workspace.workspaceFolders;
        if (!folders || folders.length === 0) return undefined;
        
        const root = folders[0].uri.fsPath;

        try {
            // Get Remote URL
            const { stdout: remoteUrl } = await execAsync('git config --get remote.origin.url', { cwd: root });
            
            // Get HEAD SHA
            const { stdout: headSha } = await execAsync('git rev-parse HEAD', { cwd: root });
            
            // Parse owner/name from remoteUrl (assuming github.com for simplicity)
            const match = remoteUrl.trim().match(/github\.com[:/]([^/]+)\/([^.]+)(?:\.git)?/);
            if (!match) return undefined;

            const owner = match[1];
            const name = match[2];
            const commitSha = headSha.trim();

            // Ask CodeGraph API for repository_id and version_id
            try {
                // In a real app we might pass owner/name, but for now let's query all and match
                const repos = await client.request<any[]>('/repositories');
                const matchedRepo = repos.find((r: any) => r.name === name); // Simplification

                if (matchedRepo) {
                    // Resolve version
                    const versions = await client.request<any[]>(`/repositories/${matchedRepo.id}/versions`);
                    const matchedVersion = versions.find((v: any) => v.commit_sha === commitSha) || versions[0];
                    
                    this.currentRepo = {
                        id: matchedRepo.id,
                        owner,
                        name,
                        branch: 'main',
                        commitSha,
                        versionId: matchedVersion ? matchedVersion.id : undefined
                    };
                    return this.currentRepo;
                }
            } catch (e) {
                console.error('Failed to map repo in CodeGraph', e);
            }
        } catch (e) {
            // Not a git repo or git not found
        }
        return undefined;
    }

    getCurrent(): DetectedRepository | undefined {
        return this.currentRepo;
    }
}
