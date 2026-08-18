from typing import List, Dict, Any
import uuid

from .store import VectorStore, VectorPoint, ScoredPoint

class QdrantVectorStore(VectorStore):
    """
    Qdrant implementation of the VectorStore.
    Since we cannot run Qdrant in this sandbox, we mock the actual client calls,
    but we write the structurally correct pydantic/client payload logic for production.
    """
    
    def __init__(self, host: str = "localhost", port: int = 6333):
        self.host = host
        self.port = port
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.http import models
            self.client = QdrantClient(host=host, port=port)
            self.models = models
        except ImportError:
            self.client = None
            self.models = None

    def ensure_collection(self, collection_name: str, dimension: int):
        if not self.client:
            return
            
        collections = self.client.get_collections().collections
        exists = any(c.name == collection_name for c in collections)
        
        if not exists:
            self.client.create_collection(
                collection_name=collection_name,
                vectors_config=self.models.VectorParams(
                    size=dimension, 
                    distance=self.models.Distance.COSINE
                )
            )
            # Create payload index for fast filtering on repository_version_id
            self.client.create_payload_index(
                collection_name=collection_name,
                field_name="repository_version_id",
                field_schema=self.models.PayloadSchemaType.KEYWORD
            )

    def upsert(self, collection_name: str, points: List[VectorPoint]):
        if not self.client or not points:
            return
            
        qdrant_points = [
            self.models.PointStruct(
                id=p.id,
                vector=p.vector,
                payload=p.payload
            ) for p in points
        ]
        
        # Upsert in batches to avoid payload limits
        batch_size = 100
        for i in range(0, len(qdrant_points), batch_size):
            batch = qdrant_points[i:i+batch_size]
            self.client.upsert(
                collection_name=collection_name,
                points=batch
            )

    def search(
        self, 
        collection_name: str, 
        query_vector: List[float], 
        repository_version_id: str, 
        limit: int = 10
    ) -> List[ScoredPoint]:
        if not self.client:
            return []
            
        results = self.client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            query_filter=self.models.Filter(
                must=[
                    self.models.FieldCondition(
                        key="repository_version_id",
                        match=self.models.MatchValue(value=repository_version_id)
                    )
                ]
            ),
            limit=limit,
            with_payload=True
        )
        
        return [
            ScoredPoint(
                id=str(r.id),
                score=r.score,
                payload=r.payload or {}
            ) for r in results
        ]

    def delete_by_ids(self, collection_name: str, point_ids: List[str], repository_version_id: str):
        if not self.client or not point_ids:
            return
            
        # Add safety filter to ensure we only delete points belonging to this version
        self.client.delete(
            collection_name=collection_name,
            points_selector=self.models.FilterSelector(
                filter=self.models.Filter(
                    must=[
                        self.models.HasIdCondition(has_id=point_ids),
                        self.models.FieldCondition(
                            key="repository_version_id",
                            match=self.models.MatchValue(value=repository_version_id)
                        )
                    ]
                )
            )
        )

    def get_existing_ids(self, collection_name: str, repository_version_id: str) -> List[str]:
        if not self.client:
            return []
            
        # Scroll API to get all points for a specific version
        ids = []
        offset = None
        while True:
            records, next_page = self.client.scroll(
                collection_name=collection_name,
                scroll_filter=self.models.Filter(
                    must=[
                        self.models.FieldCondition(
                            key="repository_version_id",
                            match=self.models.MatchValue(value=repository_version_id)
                        )
                    ]
                ),
                offset=offset,
                limit=1000,
                with_payload=False,
                with_vectors=False
            )
            ids.extend([str(r.id) for r in records])
            if next_page is None:
                break
            offset = next_page
            
        return ids
