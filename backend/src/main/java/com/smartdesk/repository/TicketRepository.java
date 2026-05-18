package com.smartdesk.repository;

import com.smartdesk.entity.Ticket;
import com.smartdesk.enums.Priority;
import com.smartdesk.enums.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Find tickets created by a specific user
    Page<Ticket> findByCreatorId(Long creatorId, Pageable pageable);

    // Find tickets assigned to a specific agent
    Page<Ticket> findByAssignedAgentId(Long agentId, Pageable pageable);

    // Filter tickets with optional status, priority, and search term
    @Query("SELECT t FROM Ticket t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:creatorId IS NULL OR t.creator.id = :creatorId) AND " +
           "(:agentId IS NULL OR t.assignedAgent.id = :agentId) AND " +
           "(:search IS NULL OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Ticket> findWithFilters(
            @Param("status") TicketStatus status,
            @Param("priority") Priority priority,
            @Param("creatorId") Long creatorId,
            @Param("agentId") Long agentId,
            @Param("search") String search,
            Pageable pageable
    );

    // Dashboard stats
    long countByStatus(TicketStatus status);

    long countByPriority(Priority priority);

    long countByAssignedAgentId(Long agentId);

    long countByCreatorId(Long creatorId);
}
