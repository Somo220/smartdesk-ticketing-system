package com.smartdesk.service;

import com.smartdesk.dto.*;
import com.smartdesk.entity.Ticket;
import com.smartdesk.entity.User;
import com.smartdesk.enums.Priority;
import com.smartdesk.enums.Role;
import com.smartdesk.enums.TicketStatus;
import com.smartdesk.exception.BadRequestException;
import com.smartdesk.exception.ResourceNotFoundException;
import com.smartdesk.exception.UnauthorizedException;
import com.smartdesk.repository.TicketRepository;
import com.smartdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Ticket service — CRUD, assignment, filtering, dashboard stats.
 */
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final EmailService emailService;

    /**
     * Create a new ticket.
     */
    @Transactional
    public TicketResponse createTicket(CreateTicketRequest request, String username) {
        User creator = userService.findUserByUsername(username);

        Ticket ticket = Ticket.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .status(TicketStatus.OPEN)
                .creator(creator)
                .build();

        ticket = ticketRepository.save(ticket);

        // Send email notification
        emailService.sendTicketCreatedEmail(ticket);

        return mapToResponse(ticket);
    }

    /**
     * Get ticket by ID.
     */
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = findTicketById(id);
        return mapToFullResponse(ticket);
    }

    /**
     * Get tickets with filtering and pagination.
     */
    @Transactional(readOnly = true)
    public Page<TicketResponse> getTickets(TicketStatus status, Priority priority,
                                            Long creatorId, Long agentId,
                                            String search, Pageable pageable) {
        return ticketRepository.findWithFilters(status, priority, creatorId, agentId, search, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get tickets for the authenticated user based on role.
     */
    @Transactional(readOnly = true)
    public Page<TicketResponse> getMyTickets(String username, TicketStatus status,
                                              Priority priority, String search, Pageable pageable) {
        User user = userService.findUserByUsername(username);

        if (user.getRole() == Role.SUPPORT_AGENT) {
            return ticketRepository.findWithFilters(status, priority, null, user.getId(), search, pageable)
                    .map(this::mapToResponse);
        } else {
            return ticketRepository.findWithFilters(status, priority, user.getId(), null, search, pageable)
                    .map(this::mapToResponse);
        }
    }

    /**
     * Update ticket (status, priority, assignment).
     */
    @Transactional
    public TicketResponse updateTicket(Long id, UpdateTicketRequest request, String username) {
        Ticket ticket = findTicketById(id);
        User currentUser = userService.findUserByUsername(username);

        // Authorization: only creator, assigned agent, or admin can update
        boolean isCreator = ticket.getCreator().getId().equals(currentUser.getId());
        boolean isAssignedAgent = ticket.getAssignedAgent() != null &&
                ticket.getAssignedAgent().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isAgent = currentUser.getRole() == Role.SUPPORT_AGENT;

        if (!isCreator && !isAssignedAgent && !isAdmin) {
            throw new UnauthorizedException("You don't have permission to update this ticket");
        }

        // Update status
        if (request.getStatus() != null) {
            // Users can only close their own resolved tickets
            if (currentUser.getRole() == Role.USER) {
                if (request.getStatus() != TicketStatus.CLOSED ||
                        ticket.getStatus() != TicketStatus.RESOLVED) {
                    throw new BadRequestException("Users can only close resolved tickets");
                }
            }
            ticket.setStatus(request.getStatus());
        }

        // Update priority (agent/admin only)
        if (request.getPriority() != null && (isAgent || isAdmin)) {
            ticket.setPriority(request.getPriority());
        }

        // Assign agent (admin only)
        if (request.getAssignedAgentId() != null && isAdmin) {
            User agent = userService.findUserById(request.getAssignedAgentId());
            if (agent.getRole() != Role.SUPPORT_AGENT && agent.getRole() != Role.ADMIN) {
                throw new BadRequestException("Can only assign to support agents or admins");
            }
            ticket.setAssignedAgent(agent);
            emailService.sendTicketAssignedEmail(ticket, agent);
        }

        ticket = ticketRepository.save(ticket);
        emailService.sendTicketUpdatedEmail(ticket);

        return mapToResponse(ticket);
    }

    /**
     * Get dashboard statistics.
     */
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(String username) {
        User user = userService.findUserByUsername(username);

        long totalTickets = ticketRepository.count();
        long openTickets = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgressTickets = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolvedTickets = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closedTickets = ticketRepository.countByStatus(TicketStatus.CLOSED);

        // For non-admin, scope to their tickets
        if (user.getRole() == Role.USER) {
            totalTickets = ticketRepository.countByCreatorId(user.getId());
        } else if (user.getRole() == Role.SUPPORT_AGENT) {
            totalTickets = ticketRepository.countByAssignedAgentId(user.getId());
        }

        Map<String, Long> ticketsByPriority = new HashMap<>();
        ticketsByPriority.put("LOW", ticketRepository.countByPriority(Priority.LOW));
        ticketsByPriority.put("MEDIUM", ticketRepository.countByPriority(Priority.MEDIUM));
        ticketsByPriority.put("HIGH", ticketRepository.countByPriority(Priority.HIGH));
        ticketsByPriority.put("URGENT", ticketRepository.countByPriority(Priority.URGENT));

        long totalUsers = userRepository.findByRole(Role.USER).size();
        long totalAgents = userRepository.findByRole(Role.SUPPORT_AGENT).size();

        return DashboardStatsResponse.builder()
                .totalTickets(totalTickets)
                .openTickets(openTickets)
                .inProgressTickets(inProgressTickets)
                .resolvedTickets(resolvedTickets)
                .closedTickets(closedTickets)
                .totalUsers(totalUsers)
                .totalAgents(totalAgents)
                .averageRating(null)
                .ticketsByPriority(ticketsByPriority)
                .build();
    }

    // --- Helpers ---

    public Ticket findTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .subject(ticket.getSubject())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .creator(userService.mapToResponse(ticket.getCreator()))
                .assignedAgent(ticket.getAssignedAgent() != null ?
                        userService.mapToResponse(ticket.getAssignedAgent()) : null)
                .rating(null)
                .comments(null)
                .attachments(null)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    public TicketResponse mapToFullResponse(Ticket ticket) {
        List<CommentResponse> comments = ticket.getComments() != null ?
                ticket.getComments().stream()
                        .map(c -> CommentResponse.builder()
                                .id(c.getId())
                                .content(c.getContent())
                                .author(userService.mapToResponse(c.getAuthor()))
                                .createdAt(c.getCreatedAt())
                                .build())
                        .collect(Collectors.toList()) : null;

        List<AttachmentResponse> attachments = ticket.getAttachments() != null ?
                ticket.getAttachments().stream()
                        .map(a -> AttachmentResponse.builder()
                                .id(a.getId())
                                .fileName(a.getFileName())
                                .contentType(a.getContentType())
                                .fileSize(a.getFileSize())
                                .downloadUrl("/api/tickets/" + ticket.getId() + "/attachments/" + a.getId() + "/download")
                                .uploadedAt(a.getUploadedAt())
                                .build())
                        .collect(Collectors.toList()) : null;

        RatingResponse ratingResp = ticket.getRating() != null ?
                RatingResponse.builder()
                        .id(ticket.getRating().getId())
                        .score(ticket.getRating().getScore())
                        .feedback(ticket.getRating().getFeedback())
                        .user(userService.mapToResponse(ticket.getRating().getUser()))
                        .createdAt(ticket.getRating().getCreatedAt())
                        .build() : null;

        return TicketResponse.builder()
                .id(ticket.getId())
                .subject(ticket.getSubject())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .creator(userService.mapToResponse(ticket.getCreator()))
                .assignedAgent(ticket.getAssignedAgent() != null ?
                        userService.mapToResponse(ticket.getAssignedAgent()) : null)
                .comments(comments)
                .attachments(attachments)
                .rating(ratingResp)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
