package com.smartdesk.controller;

import com.smartdesk.dto.CreateRatingRequest;
import com.smartdesk.dto.RatingResponse;
import com.smartdesk.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Rating controller — rate resolved tickets.
 */
@RestController
@RequestMapping("/api/tickets/{ticketId}/rating")
@RequiredArgsConstructor
@Tag(name = "Ratings", description = "Ticket rating endpoints")
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @Operation(summary = "Rate a resolved/closed ticket (1-5 stars)")
    public ResponseEntity<RatingResponse> rateTicket(
            @PathVariable Long ticketId,
            @Valid @RequestBody CreateRatingRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ratingService.rateTicket(ticketId, request, authentication.getName()));
    }

    @GetMapping
    @Operation(summary = "Get rating for a ticket")
    public ResponseEntity<RatingResponse> getRating(@PathVariable Long ticketId) {
        RatingResponse rating = ratingService.getRatingByTicketId(ticketId);
        return ResponseEntity.ok(rating);
    }
}
