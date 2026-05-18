package com.smartdesk.dto;

import com.smartdesk.enums.Priority;
import com.smartdesk.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private String subject;
    private String description;
    private TicketStatus status;
    private Priority priority;
    private UserResponse creator;
    private UserResponse assignedAgent;
    private List<CommentResponse> comments;
    private List<AttachmentResponse> attachments;
    private RatingResponse rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
