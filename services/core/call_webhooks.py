from solar.access import public
from core.call_record import CallRecord
from core.agent import Agent
from typing import Dict, Any, Tuple
from uuid import UUID
import json
import os
import requests

@public
async def handle_call_event(body_dict: dict, headers: dict, raw_body: bytes) -> Dict[str, Any]:
    """Handle incoming webhook events from Plivo for call processing."""
    
    # Extract call_id and agent_id from URL parameters or body
    call_id = body_dict.get("call_id") or headers.get("call_id")
    agent_id = body_dict.get("agent_id") or headers.get("agent_id")
    event_type = body_dict.get("event") or body_dict.get("Event")
    
    try:
        # Get call record and agent
        if call_id:
            call_results = CallRecord.sql("SELECT * FROM call_records WHERE id = %(call_id)s", {"call_id": call_id})
            if call_results:
                call_record = CallRecord(**call_results[0])
            else:
                return {"error": "Call record not found"}
        else:
            return {"error": "Call ID not provided"}
        
        if agent_id:
            agent_results = Agent.sql("SELECT * FROM agents WHERE id = %(agent_id)s", {"agent_id": agent_id})
            if agent_results:
                agent = Agent(**agent_results[0])
            else:
                return {"error": "Agent not found"}
        else:
            return {"error": "Agent ID not provided"}
        
        # Handle different call events
        if event_type == "AnswerUrl" or body_dict.get("CallStatus") == "answered":
            # Call was answered, start OpenAI Realtime session
            call_record.call_status = "answered"
            call_record.sync()
            
            # Return Plivo XML response to start streaming
            response_xml = f"""
            <Response>
                <Stream bidirectional="true" keepCallAlive="true">
                    <Parameter name="agent_prompt" value="{agent.prompt}" />
                    <Parameter name="call_id" value="{call_id}" />
                </Stream>
                <Wait length="300" />
            </Response>
            """
            
            return {"content": response_xml, "content_type": "application/xml"}
            
        elif event_type == "hangup" or body_dict.get("CallStatus") == "completed":
            # Call ended
            call_record.call_status = "completed"
            call_record.sync()
            
        elif body_dict.get("CallStatus") == "failed":
            # Call failed
            call_record.call_status = "failed"
            call_record.error_message = body_dict.get("HangupCause", "Unknown error")
            call_record.sync()
            
        return {"status": "success", "message": "Event processed"}
        
    except Exception as e:
        return {"error": f"Failed to process webhook: {str(e)}"}

@public 
async def handle_audio_stream(body_dict: dict, headers: dict, raw_body: bytes) -> Dict[str, Any]:
    """Handle real-time audio streaming between Plivo and OpenAI."""
    
    try:
        # This would handle the WebSocket connection to OpenAI Realtime API
        # For now, return a basic response
        
        # Extract audio data from Plivo stream
        audio_data = body_dict.get("media", {}).get("payload")
        call_id = body_dict.get("call_id")
        
        if audio_data and call_id:
            # In a real implementation, this would:
            # 1. Forward audio to OpenAI Realtime API
            # 2. Get AI response
            # 3. Stream response back to Plivo
            
            # For now, just log the event
            call_results = CallRecord.sql("SELECT * FROM call_records WHERE id = %(call_id)s", {"call_id": call_id})
            if call_results:
                call_record = CallRecord(**call_results[0])
                metadata = call_record.call_metadata or {}
                metadata["last_audio_received"] = body_dict.get("sequenceNumber", 0)
                call_record.call_metadata = metadata
                call_record.sync()
        
        return {"status": "audio_processed"}
        
    except Exception as e:
        return {"error": f"Audio processing failed: {str(e)}"}

def process_openai_realtime(agent_prompt: str, call_id: str) -> Dict[str, Any]:
    """Process real-time conversation with OpenAI API."""
    # This is a placeholder for the actual OpenAI Realtime API integration
    # In a full implementation, this would establish a WebSocket connection
    # to OpenAI's Realtime API and handle bidirectional audio streaming
    
    try:
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            return {"error": "OpenAI API key not configured"}
        
        # Placeholder response
        return {
            "status": "realtime_session_ready",
            "session_id": f"session_{call_id}",
            "message": "OpenAI Realtime API integration would go here"
        }
        
    except Exception as e:
        return {"error": f"OpenAI Realtime setup failed: {str(e)}"}