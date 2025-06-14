import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Phone, PhoneCall, PhoneOff, Clock, User } from 'lucide-react';
import { agentServiceGetAllAgents, callServiceInitiateCall, callServiceGetCallRecords } from '@/lib/sdk';
import type { Agent, CallRecord } from '@/lib/sdk';

export default function CallPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [fromNumber, setFromNumber] = useState('');
  const [toNumber, setToNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentCalls, setRecentCalls] = useState<CallRecord[]>([]);
  const [callInProgress, setCallInProgress] = useState<CallRecord | null>(null);

  useEffect(() => {
    loadAgents();
    loadRecentCalls();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await agentServiceGetAllAgents();
      if (response.data) {
        setAgents(response.data);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const loadRecentCalls = async () => {
    try {
      const response = await callServiceGetCallRecords({
        body: { limit: 10 }
      });
      if (response.data) {
        setRecentCalls(response.data);
      }
    } catch (error) {
      console.error('Failed to load recent calls:', error);
    }
  };

  const handleInitiateCall = async () => {
    if (!selectedAgentId || !fromNumber || !toNumber) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await callServiceInitiateCall({
        body: {
          agent_id: selectedAgentId,
          from_number: fromNumber,
          to_number: toNumber
        }
      });

      if (response.data) {
        setCallInProgress(response.data);
        setRecentCalls([response.data, ...recentCalls]);
        
        // Clear form
        setSelectedAgentId('');
        setFromNumber('');
        setToNumber('');
      }
    } catch (error) {
      console.error('Failed to initiate call:', error);
      alert('Failed to initiate call. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'answered':
        return 'bg-blue-100 text-blue-800';
      case 'initiated':
      case 'initiating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Make a Call</h1>
        <p className="text-gray-600 mt-1">Initiate calls with your AI agents</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Call Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Setup
            </CardTitle>
            <CardDescription>
              Configure and start a new call with an AI agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Agent</label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an AI agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id || ''}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">From Number (Plivo)</label>
              <Input
                value={fromNumber}
                onChange={(e) => setFromNumber(e.target.value)}
                placeholder="+1234567890"
                type="tel"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">To Number (Customer)</label>
              <Input
                value={toNumber}
                onChange={(e) => setToNumber(e.target.value)}
                placeholder="+0987654321"
                type="tel"
              />
            </div>

            <Button 
              onClick={handleInitiateCall}
              disabled={loading || !selectedAgentId || !fromNumber || !toNumber}
              className="w-full flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Initiating Call...
                </>
              ) : (
                <>
                  <PhoneCall className="h-4 w-4" />
                  Start Call
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Active Call Status */}
        {callInProgress && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-green-600" />
                Active Call
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={getStatusColor(callInProgress.call_status)}>
                    {callInProgress.call_status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">From:</span>
                  <span className="font-mono text-sm">{callInProgress.from_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">To:</span>
                  <span className="font-mono text-sm">{callInProgress.to_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Started:</span>
                  <span className="text-sm">
                    {new Date(callInProgress.started_at || '').toLocaleTimeString()}
                  </span>
                </div>
                {callInProgress.plivo_call_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Call ID:</span>
                    <span className="font-mono text-xs">{callInProgress.plivo_call_id}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>Latest call activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentCalls.length > 0 ? (
            <div className="space-y-3">
              {recentCalls.map((call) => {
                const agent = agents.find(a => a.id === call.agent_id);
                return (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">
                          {agent?.name || 'Unknown Agent'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {call.from_number} → {call.to_number}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(call.call_status)}>
                        {call.call_status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDuration(call.duration_seconds)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PhoneOff className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <div>No calls yet</div>
              <div className="text-sm">Your call history will appear here</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}