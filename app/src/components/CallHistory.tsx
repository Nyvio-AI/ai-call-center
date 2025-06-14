import { Phone, Clock, User, Search, Download, ListFilter } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { callServiceGetCallRecords, agentServiceGetAllAgents } from '@/lib/sdk';
import type { CallRecord, Agent } from '@/lib/sdk';

export default function CallHistory() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [callsResponse, agentsResponse] = await Promise.all([
        callServiceGetCallRecords({ body: { limit: 100 } }),
        agentServiceGetAllAgents()
      ]);

      if (callsResponse.data) {
        setCalls(callsResponse.data);
      }
      if (agentsResponse.data) {
        setAgents(agentsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
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

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.name || 'Unknown Agent';
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.from_number.includes(searchTerm) ||
      call.to_number.includes(searchTerm) ||
      getAgentName(call.agent_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || call.call_status === statusFilter;
    const matchesAgent = agentFilter === 'all' || call.agent_id === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  const uniqueStatuses = [...new Set(calls.map(call => call.call_status))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading call history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call History</h1>
          <p className="text-gray-600 mt-1">View and analyze your call records</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListFilter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search phone numbers..."
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Agent</label>
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id || ''}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setAgentFilter('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Records */}
      <Card>
        <CardHeader>
          <CardTitle>
            Call Records ({filteredCalls.length})
          </CardTitle>
          <CardDescription>
            {filteredCalls.length !== calls.length && 
              `Showing ${filteredCalls.length} of ${calls.length} calls`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCalls.length > 0 ? (
            <div className="space-y-4">
              {filteredCalls.map((call) => (
                <div key={call.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {call.from_number} → {call.to_number}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <User className="h-3 w-3" />
                            {getAgentName(call.agent_id)}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1">
                        <div>Started: {formatDateTime(call.started_at)}</div>
                        {call.ended_at && (
                          <div>Ended: {formatDateTime(call.ended_at)}</div>
                        )}
                        {call.plivo_call_id && (
                          <div className="font-mono text-xs">
                            Call ID: {call.plivo_call_id}
                          </div>
                        )}
                      </div>

                      {call.error_message && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          Error: {call.error_message}
                        </div>
                      )}

                      {call.transcript && (
                        <div className="text-sm bg-gray-50 p-3 rounded">
                          <div className="font-medium mb-1">Transcript:</div>
                          <div className="text-gray-700">{call.transcript}</div>
                        </div>
                      )}
                    </div>

                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(call.call_status)}>
                        {call.call_status}
                      </Badge>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(call.duration_seconds)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {calls.length === 0 ? (
                <>
                  <Phone className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-lg font-medium">No calls yet</div>
                  <div className="text-sm">Call history will appear here after you make calls</div>
                </>
              ) : (
                <>
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-lg font-medium">No matching calls</div>
                  <div className="text-sm">Try adjusting your filters</div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}