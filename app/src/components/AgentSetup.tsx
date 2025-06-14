import { Trash2, Plus, Save, X, Pencil } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { agentServiceCreateAgent, agentServiceGetAllAgents, agentServiceUpdateAgent, agentServiceDeleteAgent } from '@/lib/sdk';
import type { Agent } from '@/lib/sdk';

export default function AgentSetup() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    voice_settings: {},
    personality_settings: {}
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await agentServiceGetAllAgents();
      if (response.data) {
        setAgents(response.data);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    try {
      const response = await agentServiceCreateAgent({
        body: {
          name: formData.name,
          prompt: formData.prompt,
          voice_settings: Object.keys(formData.voice_settings).length > 0 ? formData.voice_settings : null,
          personality_settings: Object.keys(formData.personality_settings).length > 0 ? formData.personality_settings : null
        }
      });
      
      if (response.data) {
        setAgents([response.data, ...agents]);
        setShowCreateForm(false);
        setFormData({ name: '', prompt: '', voice_settings: {}, personality_settings: {} });
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleUpdateAgent = async () => {
    if (!editingAgent?.id) return;
    
    try {
      const response = await agentServiceUpdateAgent({
        body: {
          agent_id: editingAgent.id,
          name: formData.name,
          prompt: formData.prompt,
          voice_settings: Object.keys(formData.voice_settings).length > 0 ? formData.voice_settings : null,
          personality_settings: Object.keys(formData.personality_settings).length > 0 ? formData.personality_settings : null
        }
      });
      
      if (response.data) {
        setAgents(agents.map(agent => agent.id === editingAgent.id ? response.data : agent));
        setEditingAgent(null);
        setFormData({ name: '', prompt: '', voice_settings: {}, personality_settings: {} });
      }
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await agentServiceDeleteAgent({
        body: { agent_id: agentId }
      });
      setAgents(agents.filter(agent => agent.id !== agentId));
    } catch (error) {
      console.error('Failed to delete agent:', error);
    }
  };

  const startEditing = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      prompt: agent.prompt,
      voice_settings: agent.voice_settings || {},
      personality_settings: agent.personality_settings || {}
    });
  };

  const cancelEditing = () => {
    setEditingAgent(null);
    setShowCreateForm(false);
    setFormData({ name: '', prompt: '', voice_settings: {}, personality_settings: {} });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600 mt-1">Manage your customer service AI agents</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
          disabled={showCreateForm || editingAgent}
        >
          <Plus className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Agent</CardTitle>
            <CardDescription>Configure your AI agent with custom prompts and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Agent Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter agent name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Agent Prompt</label>
              <Textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="Enter the system prompt for your agent..."
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateAgent} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Create Agent
              </Button>
              <Button variant="outline" onClick={cancelEditing} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agents List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="h-fit">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    Active
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing(agent)}
                    disabled={editingAgent !== null || showCreateForm}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => agent.id && handleDeleteAgent(agent.id)}
                    disabled={editingAgent !== null || showCreateForm}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingAgent?.id === agent.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Agent Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Agent Prompt</label>
                    <Textarea
                      value={formData.prompt}
                      onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdateAgent} className="flex items-center gap-1">
                      <Save className="h-3 w-3" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing} className="flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {agent.prompt}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Created: {agent.created_at ? new Date(agent.created_at).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-lg font-medium mb-2">No agents created yet</div>
              <p className="mb-4">Create your first AI agent to get started</p>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Create Your First Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}