package com.smartdesk.dto;

import com.smartdesk.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type;
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
}
