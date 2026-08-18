export interface GraphNodeDTO {
  id: string;
  type: string;
  label: string;
  repository_version_id: string;
  metadata: Record<string, any>;
}

export interface GraphEdgeDTO {
  id: string;
  type: string;
  source: string;
  target: string;
  metadata: Record<string, any>;
}

export interface GraphDTO {
  nodes: GraphNodeDTO[];
  edges: GraphEdgeDTO[];
}

export interface GraphOverviewDTO {
  repository_version_id: string;
  total_nodes: number;
  total_edges: number;
  directories: number;
  files: number;
  classes: number;
  functions: number;
  methods: number;
  variables: number;
  parameters: number;
  external_packages: number;
  imports: number;
  calls: number;
  inheritance_relationships: number;
}

export interface NodeRelationshipDTO {
  id?: string;
  type: string;
  connected_node_id: string;
  connected_node_name?: string | null;
  connected_node_type?: string | null;
  direction: 'INCOMING' | 'OUTGOING';
}

export interface NodeDetailDTO {
  id: string;
  type: string;
  name: string | null;
  file_path: string | null;
  qualified_name: string | null;
  line_start: number | null;
  line_end: number | null;
  language: string | null;
  description: string | null;
  source_code: string | null;
  github_url: string | null;
  repository_id?: string | null;
  repository_version_id?: string | null;
  commit_sha?: string | null;
  branch?: string | null;
  status?: string | null;
  created_at?: string | null;
  children_count?: number | null;
  properties: Record<string, any>;
  incoming_relationships: NodeRelationshipDTO[];
  outgoing_relationships: NodeRelationshipDTO[];
}


