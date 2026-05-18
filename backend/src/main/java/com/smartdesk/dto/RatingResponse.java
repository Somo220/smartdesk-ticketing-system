package com.smartdesk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class RatingResponse {
    private Long id;
    private Integer score;
    private String feedback;
    private UserResponse user;
    private LocalDateTime createdAt;
}
