package com.smartdesk.dto;

import com.smartdesk.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotBlank(message = "Subject is required")
    @Size(max = 200, message = "Subject must be under 200 characters")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private Priority priority = Priority.MEDIUM;
}
