import { GraphDTO, GraphNodeDTO, GraphOverviewDTO, NodeDetailDTO } from '../../types/graph';
import { apiClient } from '../api/client';

export const graphService = {
  fetchGraphOverview: (repoId: string, versionId: string): Promise<GraphOverviewDTO> => 
    apiClient.get(`/repositories/${repoId}/versions/${versionId}/graph/overview`),

  fetchGraph: (
    repoId: string, 
    versionId: string, 
    level: 'architecture' | 'file' | 'symbol',
    customNodeTypes?: string[],
    customRelTypes?: string[]
  ): Promise<GraphDTO> => {
    const params = new URLSearchParams();
    
    if (customNodeTypes && customNodeTypes.length > 0) {
      params.append('node_types', customNodeTypes.join(','));
    } else {
      if (level === 'architecture') params.append('node_types', 'RepositoryVersion,Directory,File,ExternalPackage');
      else if (level === 'file') params.append('node_types', 'RepositoryVersion,Directory,File,Class,Function,ExternalPackage');
      else if (level === 'symbol') params.append('node_types', 'RepositoryVersion,Directory,File,Class,Function,Method,Variable,Parameter');
    }

    if (customRelTypes && customRelTypes.length > 0) {
      params.append('relationship_types', customRelTypes.join(','));
    } else {
      if (level === 'architecture') params.append('relationship_types', 'CONTAINS,IMPORTS');
      else if (level === 'file') params.append('relationship_types', 'CONTAINS,DEFINES,IMPORTS');
      else if (level === 'symbol') params.append('relationship_types', 'CONTAINS,DEFINES,CALLS,INHERITS,IMPORTS,HAS_PARAMETER');
    }

    return apiClient.get(`/repositories/${repoId}/versions/${versionId}/graph?${params.toString()}`);
  },

  fetchNodeDetails: (repoId: string, versionId: string, nodeId: string): Promise<NodeDetailDTO> => 
    apiClient.get(`/repositories/${repoId}/versions/${versionId}/graph/nodes/${nodeId}/details`),

  fetchNodeNeighbors: (repoId: string, versionId: string, nodeId: string): Promise<GraphDTO> => 
    apiClient.get(`/repositories/${repoId}/versions/${versionId}/graph/nodes/${nodeId}/neighbors?depth=1&direction=BOTH`),

  searchNodes: (repoId: string, versionId: string, query: string): Promise<GraphNodeDTO[]> => 
    apiClient.get(`/repositories/${repoId}/versions/${versionId}/graph/nodes/search?q=${encodeURIComponent(query)}`),

  analyzeImpact: (repoId: string, versionId: string, nodeId: string) => 
    apiClient.post(`/repositories/${repoId}/versions/${versionId}/architecture/analyze-change`, { node_id: nodeId })
};

export const aiService = {
  askAIQuery: (repoId: string, versionId: string, question: string, selectedNodeId?: string) => 
    apiClient.post(`/repositories/${repoId}/versions/${versionId}/ai/query`, { question, selected_node_id: selectedNodeId })
};
