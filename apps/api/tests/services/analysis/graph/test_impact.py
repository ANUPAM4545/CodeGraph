import pytest
from src.services.analysis.graph.impact import ImpactAnalysisService, ImpactAnalysisDTO
from src.services.analysis.graph.risk import ArchitectureRiskService
from src.services.analysis.graph.architecture import SubsystemDetector

class MockSession:
    def __init__(self, responses=None):
        self.responses = responses or {}
        
    def run(self, query, **kwargs):
        class MockResult:
            def __init__(self, data):
                self.data = data
            def __iter__(self):
                return iter(self.data)
            def single(self):
                return self.data[0] if self.data else None
                
        # Return mocked data depending on the query hints
        if "fan_in" in query:
            return MockResult([{"fan_in": 12}])
        if "fan_out" in query:
            return MockResult([{"fan_out": 5}])
        if "module_name" in query:
            return MockResult([{"module_name": "src/api", "file_count": 10, "file_ids": []}])
        if "ext_deps" in query:
            return MockResult([{"ext_deps": 4}])
            
        return MockResult([])

class MockDriver:
    def __init__(self):
        self.session_instance = MockSession()
    
    def session(self):
        class SessionContext:
            def __init__(self, s):
                self.s = s
            def __enter__(self):
                return self.s
            def __exit__(self, exc_type, exc_val, exc_tb):
                pass
        return SessionContext(self.session_instance)

def test_impact_analysis_clamping():
    driver = MockDriver()
    svc = ImpactAnalysisService(driver)
    
    # Should clamp > 3 to 3
    dto = svc.analyze_impact("v1", "node1", depth=5)
    assert dto.depth == 3
    
    # Should clamp < 1 to 1
    dto = svc.analyze_impact("v1", "node1", depth=0)
    assert dto.depth == 1

def test_architecture_risk_calculation():
    driver = MockDriver()
    svc = ArchitectureRiskService(driver)
    
    risk = svc.calculate_risk("v1", "node1")
    assert risk["signals"]["fan_in"] == 12
    assert risk["signals"]["fan_out"] == 5
    assert risk["score"] >= 40
    assert risk["risk_level"] in ["MEDIUM", "HIGH"]

def test_subsystem_detection():
    driver = MockDriver()
    svc = SubsystemDetector(driver)
    
    subs = svc.detect_subsystems("v1")
    assert len(subs) == 1
    assert subs[0]["name"] == "src/api"
    assert subs[0]["external_dependency_count"] == 4
