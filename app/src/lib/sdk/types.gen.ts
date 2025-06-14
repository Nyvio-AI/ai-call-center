// This file is auto-generated by @hey-api/openapi-ts

export type Agent = {
    id?: string;
    name: string;
    prompt: string;
    voice_settings?: {
        [key: string]: unknown;
    } | null;
    personality_settings?: {
        [key: string]: unknown;
    } | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type BodyAgentServiceCreateAgent = {
    name: string;
    prompt: string;
    voice_settings?: {
        [key: string]: unknown;
    } | null;
    personality_settings?: {
        [key: string]: unknown;
    } | null;
};

export type BodyAgentServiceDeleteAgent = {
    agent_id: string;
};

export type BodyAgentServiceGetAgentById = {
    agent_id: string;
};

export type BodyAgentServiceUpdateAgent = {
    agent_id: string;
    name?: string | null;
    prompt?: string | null;
    voice_settings?: {
        [key: string]: unknown;
    } | null;
    personality_settings?: {
        [key: string]: unknown;
    } | null;
};

export type BodyCallServiceGetCallRecordById = {
    call_id: string;
};

export type BodyCallServiceGetCallRecords = {
    limit: number;
};

export type BodyCallServiceInitiateCall = {
    agent_id: string;
    from_number: string;
    to_number: string;
};

export type BodyCallServiceUpdateCallStatus = {
    call_id: string;
    status: string;
    metadata?: {
        [key: string]: unknown;
    } | null;
};

export type CallRecord = {
    id?: string;
    agent_id: string;
    plivo_call_id?: string | null;
    from_number: string;
    to_number: string;
    call_status: string;
    duration_seconds?: number | null;
    transcript?: string | null;
    call_metadata?: {
        [key: string]: unknown;
    } | null;
    error_message?: string | null;
    started_at?: string;
    ended_at?: string | null;
    created_at?: string;
};

export type HttpValidationError = {
    detail?: Array<ValidationError>;
};

export type ValidationError = {
    loc: Array<string | number>;
    msg: string;
    type: string;
};

export type AgentServiceCreateAgentData = {
    body: BodyAgentServiceCreateAgent;
    path?: never;
    query?: never;
    url: '/api/agent_service/create_agent';
};

export type AgentServiceCreateAgentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type AgentServiceCreateAgentError = AgentServiceCreateAgentErrors[keyof AgentServiceCreateAgentErrors];

export type AgentServiceCreateAgentResponses = {
    /**
     * Successful Response
     */
    200: Agent;
};

export type AgentServiceCreateAgentResponse = AgentServiceCreateAgentResponses[keyof AgentServiceCreateAgentResponses];

export type AgentServiceGetAllAgentsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/agent_service/get_all_agents';
};

export type AgentServiceGetAllAgentsResponses = {
    /**
     * Successful Response
     */
    200: Array<Agent>;
};

export type AgentServiceGetAllAgentsResponse = AgentServiceGetAllAgentsResponses[keyof AgentServiceGetAllAgentsResponses];

export type AgentServiceGetAgentByIdData = {
    body: BodyAgentServiceGetAgentById;
    path?: never;
    query?: never;
    url: '/api/agent_service/get_agent_by_id';
};

export type AgentServiceGetAgentByIdErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type AgentServiceGetAgentByIdError = AgentServiceGetAgentByIdErrors[keyof AgentServiceGetAgentByIdErrors];

export type AgentServiceGetAgentByIdResponses = {
    /**
     * Successful Response
     */
    200: Agent | null;
};

export type AgentServiceGetAgentByIdResponse = AgentServiceGetAgentByIdResponses[keyof AgentServiceGetAgentByIdResponses];

export type AgentServiceUpdateAgentData = {
    body: BodyAgentServiceUpdateAgent;
    path?: never;
    query?: never;
    url: '/api/agent_service/update_agent';
};

export type AgentServiceUpdateAgentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type AgentServiceUpdateAgentError = AgentServiceUpdateAgentErrors[keyof AgentServiceUpdateAgentErrors];

export type AgentServiceUpdateAgentResponses = {
    /**
     * Successful Response
     */
    200: Agent | null;
};

export type AgentServiceUpdateAgentResponse = AgentServiceUpdateAgentResponses[keyof AgentServiceUpdateAgentResponses];

export type AgentServiceDeleteAgentData = {
    body: BodyAgentServiceDeleteAgent;
    path?: never;
    query?: never;
    url: '/api/agent_service/delete_agent';
};

export type AgentServiceDeleteAgentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type AgentServiceDeleteAgentError = AgentServiceDeleteAgentErrors[keyof AgentServiceDeleteAgentErrors];

export type AgentServiceDeleteAgentResponses = {
    /**
     * Successful Response
     */
    200: boolean;
};

export type AgentServiceDeleteAgentResponse = AgentServiceDeleteAgentResponses[keyof AgentServiceDeleteAgentResponses];

export type CallServiceInitiateCallData = {
    body: BodyCallServiceInitiateCall;
    path?: never;
    query?: never;
    url: '/api/call_service/initiate_call';
};

export type CallServiceInitiateCallErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type CallServiceInitiateCallError = CallServiceInitiateCallErrors[keyof CallServiceInitiateCallErrors];

export type CallServiceInitiateCallResponses = {
    /**
     * Successful Response
     */
    200: CallRecord;
};

export type CallServiceInitiateCallResponse = CallServiceInitiateCallResponses[keyof CallServiceInitiateCallResponses];

export type CallServiceGetCallRecordsData = {
    body: BodyCallServiceGetCallRecords;
    path?: never;
    query?: never;
    url: '/api/call_service/get_call_records';
};

export type CallServiceGetCallRecordsErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type CallServiceGetCallRecordsError = CallServiceGetCallRecordsErrors[keyof CallServiceGetCallRecordsErrors];

export type CallServiceGetCallRecordsResponses = {
    /**
     * Successful Response
     */
    200: Array<CallRecord>;
};

export type CallServiceGetCallRecordsResponse = CallServiceGetCallRecordsResponses[keyof CallServiceGetCallRecordsResponses];

export type CallServiceGetCallRecordByIdData = {
    body: BodyCallServiceGetCallRecordById;
    path?: never;
    query?: never;
    url: '/api/call_service/get_call_record_by_id';
};

export type CallServiceGetCallRecordByIdErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type CallServiceGetCallRecordByIdError = CallServiceGetCallRecordByIdErrors[keyof CallServiceGetCallRecordByIdErrors];

export type CallServiceGetCallRecordByIdResponses = {
    /**
     * Successful Response
     */
    200: CallRecord | null;
};

export type CallServiceGetCallRecordByIdResponse = CallServiceGetCallRecordByIdResponses[keyof CallServiceGetCallRecordByIdResponses];

export type CallServiceUpdateCallStatusData = {
    body: BodyCallServiceUpdateCallStatus;
    path?: never;
    query?: never;
    url: '/api/call_service/update_call_status';
};

export type CallServiceUpdateCallStatusErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type CallServiceUpdateCallStatusError = CallServiceUpdateCallStatusErrors[keyof CallServiceUpdateCallStatusErrors];

export type CallServiceUpdateCallStatusResponses = {
    /**
     * Successful Response
     */
    200: CallRecord | null;
};

export type CallServiceUpdateCallStatusResponse = CallServiceUpdateCallStatusResponses[keyof CallServiceUpdateCallStatusResponses];

export type CallWebhooksHandleCallEventApiWebhooksCallWebhooksHandleCallEventPostData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/webhooks/call_webhooks/handle_call_event';
};

export type CallWebhooksHandleCallEventApiWebhooksCallWebhooksHandleCallEventPostResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};

export type CallWebhooksHandleAudioStreamApiWebhooksCallWebhooksHandleAudioStreamPostData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/webhooks/call_webhooks/handle_audio_stream';
};

export type CallWebhooksHandleAudioStreamApiWebhooksCallWebhooksHandleAudioStreamPostResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};