package com.smartdesk.service;

import com.smartdesk.dto.CommentResponse;
import com.smartdesk.dto.CreateCommentRequest;
import com.smartdesk.entity.Comment;
import com.smartdesk.entity.Ticket;
import com.smartdesk.entity.User;
import com.smartdesk.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Comment service — add and list comments on tickets.
 */
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketService ticketService;
    private final UserService userService;
    private final EmailService emailService;

    /**
     * Add a comment to a ticket.
     */
    @Transactional
    public CommentResponse addComment(Long ticketId, CreateCommentRequest request, String username) {
        Ticket ticket = ticketService.findTicketById(ticketId);
        User author = userService.findUserByUsername(username);

        Comment comment = Comment.builder()
                .content(request.getContent())
                .ticket(ticket)
                .author(author)
                .build();

        comment = commentRepository.save(comment);

        // Send notification email
        emailService.sendCommentAddedEmail(ticket, comment);

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(userService.mapToResponse(author))
                .createdAt(comment.getCreatedAt())
                .build();
    }

    /**
     * Get all comments for a ticket.
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTicketId(Long ticketId) {
        // Validate ticket exists
        ticketService.findTicketById(ticketId);

        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(comment -> CommentResponse.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .author(userService.mapToResponse(comment.getAuthor()))
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
