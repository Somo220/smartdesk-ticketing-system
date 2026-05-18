package com.smartdesk.seed;

import com.smartdesk.entity.*;
import com.smartdesk.enums.Priority;
import com.smartdesk.enums.Role;
import com.smartdesk.enums.TicketStatus;
import com.smartdesk.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data seeder — populates the database with sample users, tickets, and comments.
 * Runs only when the users table is empty (first startup).
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final RatingRepository ratingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if database is empty
        if (userRepository.count() > 0) {
            logger.info("Database already seeded. Skipping...");
            return;
        }

        logger.info("Seeding database with sample data...");

        // --- Create Users ---
        User admin = userRepository.save(User.builder()
                .username("admin")
                .email("admin@smartdesk.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Admin User")
                .role(Role.ADMIN)
                .enabled(true)
                .build());

        User agent1 = userRepository.save(User.builder()
                .username("agent")
                .email("agent@smartdesk.com")
                .password(passwordEncoder.encode("agent123"))
                .fullName("Sarah Johnson")
                .role(Role.SUPPORT_AGENT)
                .enabled(true)
                .build());

        User agent2 = userRepository.save(User.builder()
                .username("agent2")
                .email("agent2@smartdesk.com")
                .password(passwordEncoder.encode("agent123"))
                .fullName("Mike Chen")
                .role(Role.SUPPORT_AGENT)
                .enabled(true)
                .build());

        User user1 = userRepository.save(User.builder()
                .username("user")
                .email("user@smartdesk.com")
                .password(passwordEncoder.encode("user123"))
                .fullName("John Doe")
                .role(Role.USER)
                .enabled(true)
                .build());

        User user2 = userRepository.save(User.builder()
                .username("jane")
                .email("jane@smartdesk.com")
                .password(passwordEncoder.encode("user123"))
                .fullName("Jane Smith")
                .role(Role.USER)
                .enabled(true)
                .build());

        User user3 = userRepository.save(User.builder()
                .username("bob")
                .email("bob@smartdesk.com")
                .password(passwordEncoder.encode("user123"))
                .fullName("Bob Wilson")
                .role(Role.USER)
                .enabled(true)
                .build());

        // --- Create Tickets ---
        Ticket t1 = ticketRepository.save(Ticket.builder()
                .subject("Cannot access email server")
                .description("Getting connection timeout when trying to access the email server. Error code: SMTP_TIMEOUT_503. This has been happening since the last server update.")
                .status(TicketStatus.OPEN)
                .priority(Priority.HIGH)
                .creator(user1)
                .build());

        Ticket t2 = ticketRepository.save(Ticket.builder()
                .subject("VPN not connecting from remote office")
                .description("The VPN client shows 'Authentication Failed' when trying to connect from the Chicago office. Multiple users affected.")
                .status(TicketStatus.IN_PROGRESS)
                .priority(Priority.URGENT)
                .creator(user1)
                .assignedAgent(agent1)
                .build());

        Ticket t3 = ticketRepository.save(Ticket.builder()
                .subject("Request for new monitor")
                .description("My current monitor has dead pixels. Requesting a replacement 27-inch monitor for workstation W-234.")
                .status(TicketStatus.OPEN)
                .priority(Priority.LOW)
                .creator(user2)
                .build());

        Ticket t4 = ticketRepository.save(Ticket.builder()
                .subject("Software installation: Adobe Creative Suite")
                .description("Need Adobe Creative Suite installed on my workstation for the marketing campaign. License key provided by manager.")
                .status(TicketStatus.RESOLVED)
                .priority(Priority.MEDIUM)
                .creator(user2)
                .assignedAgent(agent1)
                .build());

        Ticket t5 = ticketRepository.save(Ticket.builder()
                .subject("Network printer not working on 3rd floor")
                .description("The HP LaserJet Pro on the 3rd floor is showing offline. Print queue is stuck with 15+ jobs. Multiple departments affected.")
                .status(TicketStatus.IN_PROGRESS)
                .priority(Priority.HIGH)
                .creator(user3)
                .assignedAgent(agent2)
                .build());

        Ticket t6 = ticketRepository.save(Ticket.builder()
                .subject("Password reset for legacy system")
                .description("Need password reset for the legacy ERP system. Account: bob.wilson@legacy. Locked out after 3 failed attempts.")
                .status(TicketStatus.CLOSED)
                .priority(Priority.MEDIUM)
                .creator(user3)
                .assignedAgent(agent1)
                .build());

        Ticket t7 = ticketRepository.save(Ticket.builder()
                .subject("Slow internet in conference room B")
                .description("WiFi speeds in conference room B are extremely slow (<2 Mbps). Video calls keep dropping. Need urgent fix before client presentation tomorrow.")
                .status(TicketStatus.OPEN)
                .priority(Priority.URGENT)
                .creator(user1)
                .build());

        Ticket t8 = ticketRepository.save(Ticket.builder()
                .subject("New employee onboarding - IT setup")
                .description("New employee starting Monday: Emily Parker, Marketing Dept. Need: laptop, email account, VPN access, Slack, and Adobe license.")
                .status(TicketStatus.OPEN)
                .priority(Priority.MEDIUM)
                .creator(user2)
                .build());

        Ticket t9 = ticketRepository.save(Ticket.builder()
                .subject("Database backup failure alert")
                .description("Received automated alert: nightly backup for production database failed at 02:00 AM. Error: Insufficient disk space on backup server.")
                .status(TicketStatus.IN_PROGRESS)
                .priority(Priority.URGENT)
                .creator(user3)
                .assignedAgent(agent2)
                .build());

        Ticket t10 = ticketRepository.save(Ticket.builder()
                .subject("Request to upgrade RAM")
                .description("My workstation (W-156) only has 8GB RAM. Requesting upgrade to 32GB for running Docker containers and development VMs.")
                .status(TicketStatus.RESOLVED)
                .priority(Priority.LOW)
                .creator(user1)
                .assignedAgent(agent2)
                .build());

        // --- Create Comments ---
        commentRepository.save(Comment.builder()
                .content("I've checked the server logs and found the timeout is caused by a firewall rule change. Working on reverting it.")
                .ticket(t2)
                .author(agent1)
                .build());

        commentRepository.save(Comment.builder()
                .content("Can you try connecting again? I've updated the firewall rules.")
                .ticket(t2)
                .author(agent1)
                .build());

        commentRepository.save(Comment.builder()
                .content("Still getting the same error. Here's a screenshot of the error message.")
                .ticket(t2)
                .author(user1)
                .build());

        commentRepository.save(Comment.builder()
                .content("Adobe Creative Suite has been installed. Please restart your workstation and verify.")
                .ticket(t4)
                .author(agent1)
                .build());

        commentRepository.save(Comment.builder()
                .content("Confirmed working. Thank you for the quick resolution!")
                .ticket(t4)
                .author(user2)
                .build());

        commentRepository.save(Comment.builder()
                .content("Checking the printer spooler service and network connectivity now.")
                .ticket(t5)
                .author(agent2)
                .build());

        commentRepository.save(Comment.builder()
                .content("Password has been reset. New temporary password sent to your manager's email for security reasons.")
                .ticket(t6)
                .author(agent1)
                .build());

        commentRepository.save(Comment.builder()
                .content("RAM has been upgraded to 32GB. Please verify the system recognizes the new memory.")
                .ticket(t10)
                .author(agent2)
                .build());

        // --- Create Ratings ---
        ratingRepository.save(Rating.builder()
                .score(4)
                .feedback("Good job! Software was installed quickly.")
                .ticket(t4)
                .user(user2)
                .build());

        ratingRepository.save(Rating.builder()
                .score(5)
                .feedback("Excellent service! Very fast password reset.")
                .ticket(t6)
                .user(user3)
                .build());

        ratingRepository.save(Rating.builder()
                .score(5)
                .feedback("Great upgrade! My workstation runs much faster now.")
                .ticket(t10)
                .user(user1)
                .build());

        logger.info("Database seeded successfully!");
        logger.info("  - {} users created", userRepository.count());
        logger.info("  - {} tickets created", ticketRepository.count());
        logger.info("  - {} comments created", commentRepository.count());
        logger.info("  - {} ratings created", ratingRepository.count());
        logger.info("--------------------------------------------------");
        logger.info("  Sample Accounts:");
        logger.info("    Admin:   admin / admin123");
        logger.info("    Agent:   agent / agent123");
        logger.info("    User:    user  / user123");
        logger.info("--------------------------------------------------");
    }
}
