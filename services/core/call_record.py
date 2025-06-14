from solar import Table, ColumnDetails
from typing import Optional, Dict
from datetime import datetime
import uuid

class CallRecord(Table):
    __tablename__ = "call_records"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    agent_id: uuid.UUID
    plivo_call_id: Optional[str] = None  # Optional for backwards compatibility
    from_number: str
    to_number: str
    call_status: str  # initiated, ringing, answered, completed, failed, etc.
    duration_seconds: Optional[int] = None  # Optional for backwards compatibility
    transcript: Optional[str] = None  # Optional for backwards compatibility
    call_metadata: Optional[Dict] = None  # Optional for backwards compatibility
    error_message: Optional[str] = None  # Optional for backwards compatibility
    started_at: datetime = ColumnDetails(default_factory=datetime.now)
    ended_at: Optional[datetime] = None  # Optional for backwards compatibility
    created_at: datetime = ColumnDetails(default_factory=datetime.now)