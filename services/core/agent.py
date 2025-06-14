from solar import Table, ColumnDetails
from typing import Optional, Dict
from datetime import datetime
import uuid

class Agent(Table):
    __tablename__ = "agents"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    name: str
    prompt: str
    voice_settings: Optional[Dict] = None  # Optional for backwards compatibility
    personality_settings: Optional[Dict] = None  # Optional for backwards compatibility
    is_active: bool = ColumnDetails(default=True)
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    updated_at: datetime = ColumnDetails(default_factory=datetime.now)