package com.smartdesk.dto;

import com.smartdesk.enums.Priority;
import com.smartdesk.enums.TicketStatus;
import lombok.Data;

@Data
public class UpdateTicketRequest {
    private TicketStatus status;
    private Priority priority;
    private Long assignedAgentId;
}
