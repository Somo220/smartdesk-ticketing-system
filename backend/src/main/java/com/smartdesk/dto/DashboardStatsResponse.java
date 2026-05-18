package com.smartdesk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * Dashboard statistics response for all roles.
 */
@Data
@Builder
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;
    private long totalUsers;
    private long totalAgents;
    private Double averageRating;
    private Map<String, Long> ticketsByPriority;
}
