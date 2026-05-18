package com.smartdesk.dto;

import com.smartdesk.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for admin to update user details and roles.
 */
@Data
public class UpdateUserRequest {

    @Size(max = 100, message = "Full name must be under 100 characters")
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    private Role role;

    private Boolean enabled;
}
