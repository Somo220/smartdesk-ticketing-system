package com.smartdesk.controller;

import com.smartdesk.dto.CommentResponse;
import com.smartdesk.dto.CreateCommentRequest;
import com.smartdesk.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Comment controller — add and list comments on tickets.
 */
@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Ticket comment endpoints")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @Operation(summary = "Add comment to a ticket")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(commentService.addComment(ticketId, request, authentication.getName()));
    }

    @GetMapping
    @Operation(summary = "Get all comments for a ticket")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicketId(ticketId));
    }
}
