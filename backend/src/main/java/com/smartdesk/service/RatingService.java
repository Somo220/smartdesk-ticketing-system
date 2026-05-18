package com.smartdesk.service;

import com.smartdesk.dto.CreateRatingRequest;
import com.smartdesk.dto.RatingResponse;
import com.smartdesk.entity.Rating;
import com.smartdesk.entity.Ticket;
import com.smartdesk.entity.User;
import com.smartdesk.enums.TicketStatus;
import com.smartdesk.exception.BadRequestException;
import com.smartdesk.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Rating service — rate resolved/closed tickets (1-5 stars).
 */
@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final TicketService ticketService;
    private final UserService userService;

    /**
     * Rate a resolved/closed ticket. Only the ticket creator can rate.
     */
    @Transactional
    public RatingResponse rateTicket(Long ticketId, CreateRatingRequest request, String username) {
        Ticket ticket = ticketService.findTicketById(ticketId);
        User user = userService.findUserByUsername(username);

        // Only the ticket creator can rate
        if (!ticket.getCreator().getId().equals(user.getId())) {
            throw new BadRequestException("Only the ticket creator can rate this ticket");
        }

        // Only resolved or closed tickets can be rated
        if (ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED) {
            throw new BadRequestException("Only resolved or closed tickets can be rated");
        }

        // Check if already rated
        if (ratingRepository.existsByTicketId(ticketId)) {
            throw new BadRequestException("This ticket has already been rated");
        }

        Rating rating = Rating.builder()
                .score(request.getScore())
                .feedback(request.getFeedback())
                .ticket(ticket)
                .user(user)
                .build();

        rating = ratingRepository.save(rating);

        return RatingResponse.builder()
                .id(rating.getId())
                .score(rating.getScore())
                .feedback(rating.getFeedback())
                .user(userService.mapToResponse(user))
                .createdAt(rating.getCreatedAt())
                .build();
    }

    /**
     * Get rating for a ticket.
     */
    @Transactional(readOnly = true)
    public RatingResponse getRatingByTicketId(Long ticketId) {
        Rating rating = ratingRepository.findByTicketId(ticketId).orElse(null);
        if (rating == null) return null;

        return RatingResponse.builder()
                .id(rating.getId())
                .score(rating.getScore())
                .feedback(rating.getFeedback())
                .user(userService.mapToResponse(rating.getUser()))
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
