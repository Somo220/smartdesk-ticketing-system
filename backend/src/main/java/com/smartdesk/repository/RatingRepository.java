package com.smartdesk.repository;

import com.smartdesk.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByTicketId(Long ticketId);

    boolean existsByTicketId(Long ticketId);

    @Query("SELECT AVG(r.score) FROM Rating r")
    Double findAverageScore();
}
