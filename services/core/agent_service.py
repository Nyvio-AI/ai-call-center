from typing import List, Optional, Dict
from uuid import UUID
from core.agent import Agent
from solar.access import public
from datetime import datetime

@public
def create_agent(
    name: str, 
    prompt: str, 
    voice_settings: Optional[Dict] = None,
    personality_settings: Optional[Dict] = None
) -> Agent:
    """Create a new AI agent with the given configuration."""
    agent = Agent(
        name=name,
        prompt=prompt,
        voice_settings=voice_settings,
        personality_settings=personality_settings,
        is_active=True
    )
    agent.sync()
    return agent

@public
def get_all_agents() -> List[Agent]:
    """Get all active agents."""
    results = Agent.sql("SELECT * FROM agents WHERE is_active = true ORDER BY created_at DESC")
    return [Agent(**result) for result in results]

@public
def get_agent_by_id(agent_id: UUID) -> Optional[Agent]:
    """Get an agent by its ID."""
    results = Agent.sql("SELECT * FROM agents WHERE id = %(agent_id)s AND is_active = true", {"agent_id": str(agent_id)})
    if results:
        return Agent(**results[0])
    return None

@public
def update_agent(
    agent_id: UUID,
    name: Optional[str] = None,
    prompt: Optional[str] = None,
    voice_settings: Optional[Dict] = None,
    personality_settings: Optional[Dict] = None
) -> Optional[Agent]:
    """Update an existing agent."""
    agent = get_agent_by_id(agent_id)
    if not agent:
        return None
    
    if name is not None:
        agent.name = name
    if prompt is not None:
        agent.prompt = prompt
    if voice_settings is not None:
        agent.voice_settings = voice_settings
    if personality_settings is not None:
        agent.personality_settings = personality_settings
    
    agent.updated_at = datetime.now()
    agent.sync()
    return agent

@public
def delete_agent(agent_id: UUID) -> bool:
    """Soft delete an agent by setting is_active to False."""
    agent = get_agent_by_id(agent_id)
    if not agent:
        return False
    
    agent.is_active = False
    agent.updated_at = datetime.now()
    agent.sync()
    return True