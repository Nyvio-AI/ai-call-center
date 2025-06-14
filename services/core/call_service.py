from typing import List, Optional, Dict, Any
from uuid import UUID
from core.call_record import CallRecord
from core.agent import Agent
from solar.access import public
from datetime import datetime
import os
import requests
import json

@public
def initiate_call(agent_id: UUID, from_number: str, to_number: str) -> CallRecord:
    """Initiate a call using Plivo API with the specified agent."""
    # First verify the agent exists
    agent_results = Agent.sql("SELECT * FROM agents WHERE id = %(agent_id)s AND is_active = true", {"agent_id": str(agent_id)})
    if not agent_results:
        raise ValueError(f"Agent with ID {agent_id} not found or inactive")
    
    # Create call record
    call_record = CallRecord(
        agent_id=agent_id,
        from_number=from_number,
        to_number=to_number,
        call_status="initiating"
    )
    call_record.sync()
    
    # Make Plivo API call
    try:
        plivo_auth_id = os.getenv("PLIVO_AUTH_ID")
        plivo_auth_token = os.getenv("PLIVO_AUTH_TOKEN")
        
        if not plivo_auth_id or not plivo_auth_token:
            raise ValueError("Plivo credentials not configured")
        
        # Construct webhook URL for call events
        webhook_url = f"{os.getenv('BASE_URL', 'http://localhost:8000')}/api/webhooks/call_webhooks/handle_call_event"
        
        plivo_url = f"https://api.plivo.com/v1/Account/{plivo_auth_id}/Call/"
        
        payload = {
            "from": from_number,
            "to": to_number,
            "answer_url": f"{webhook_url}?call_id={call_record.id}&agent_id={agent_id}",
            "hangup_url": f"{webhook_url}?call_id={call_record.id}&event=hangup"
        }
        
        response = requests.post(
            plivo_url,
            auth=(plivo_auth_id, plivo_auth_token),
            json=payload
        )
        
        if response.status_code == 201:
            plivo_response = response.json()
            call_record.plivo_call_id = plivo_response.get("request_uuid")
            call_record.call_status = "initiated"
        else:
            call_record.call_status = "failed"
            call_record.error_message = f"Plivo API error: {response.text}"
        
        call_record.sync()
        return call_record
        
    except Exception as e:
        call_record.call_status = "failed"
        call_record.error_message = str(e)
        call_record.sync()
        return call_record

@public
def get_call_records(limit: int = 50) -> List[CallRecord]:
    """Get recent call records."""
    results = CallRecord.sql(
        "SELECT * FROM call_records ORDER BY created_at DESC LIMIT %(limit)s", 
        {"limit": limit}
    )
    return [CallRecord(**result) for result in results]

@public
def get_call_record_by_id(call_id: UUID) -> Optional[CallRecord]:
    """Get a call record by its ID."""
    results = CallRecord.sql("SELECT * FROM call_records WHERE id = %(call_id)s", {"call_id": str(call_id)})
    if results:
        return CallRecord(**results[0])
    return None

@public
def update_call_status(call_id: UUID, status: str, metadata: Optional[Dict] = None) -> Optional[CallRecord]:
    """Update the status of a call record."""
    call_record = get_call_record_by_id(call_id)
    if not call_record:
        return None
    
    call_record.call_status = status
    if metadata:
        call_record.call_metadata = metadata
    
    if status in ["completed", "failed"]:
        call_record.ended_at = datetime.now()
        if call_record.started_at and call_record.ended_at:
            duration = call_record.ended_at - call_record.started_at
            call_record.duration_seconds = int(duration.total_seconds())
    
    call_record.sync()
    return call_record