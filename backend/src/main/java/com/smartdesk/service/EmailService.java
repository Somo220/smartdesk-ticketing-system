package com.smartdesk.service;

import com.smartdesk.entity.Comment;
import com.smartdesk.entity.Ticket;
import com.smartdesk.entity.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Email notification service — sends emails via Mailtrap SMTP.
 * All email sends are async to avoid blocking the request thread.
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    private static final String FROM_EMAIL = "noreply@smartdesk.com";

    /**
     * Send notification when a new ticket is created.
     */
    @Async
    public void sendTicketCreatedEmail(Ticket ticket) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(ticket.getCreator().getEmail());
            message.setSubject("[SmartDesk] Ticket #" + ticket.getId() + " Created");
            message.setText(String.format(
                    "Hello %s,\n\nYour ticket has been created successfully.\n\n" +
                    "Ticket ID: #%d\nSubject: %s\nPriority: %s\nStatus: %s\n\n" +
                    "We'll get back to you soon.\n\n— SmartDesk Team",
                    ticket.getCreator().getFullName(),
                    ticket.getId(),
                    ticket.getSubject(),
                    ticket.getPriority(),
                    ticket.getStatus()));

            mailSender.send(message);
            logger.info("Ticket created email sent for ticket #{}", ticket.getId());
        } catch (Exception e) {
            logger.warn("Failed to send ticket created email: {}", e.getMessage());
        }
    }

    /**
     * Send notification when a ticket is updated.
     */
    @Async
    public void sendTicketUpdatedEmail(Ticket ticket) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(ticket.getCreator().getEmail());
            message.setSubject("[SmartDesk] Ticket #" + ticket.getId() + " Updated");
            message.setText(String.format(
                    "Hello %s,\n\nYour ticket has been updated.\n\n" +
                    "Ticket ID: #%d\nSubject: %s\nStatus: %s\nPriority: %s\n\n" +
                    "— SmartDesk Team",
                    ticket.getCreator().getFullName(),
                    ticket.getId(),
                    ticket.getSubject(),
                    ticket.getStatus(),
                    ticket.getPriority()));

            mailSender.send(message);
            logger.info("Ticket updated email sent for ticket #{}", ticket.getId());
        } catch (Exception e) {
            logger.warn("Failed to send ticket updated email: {}", e.getMessage());
        }
    }

    /**
     * Send notification when a ticket is assigned to an agent.
     */
    @Async
    public void sendTicketAssignedEmail(Ticket ticket, User agent) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(agent.getEmail());
            message.setSubject("[SmartDesk] Ticket #" + ticket.getId() + " Assigned to You");
            message.setText(String.format(
                    "Hello %s,\n\nA ticket has been assigned to you.\n\n" +
                    "Ticket ID: #%d\nSubject: %s\nPriority: %s\nCreated by: %s\n\n" +
                    "Please review and take action.\n\n— SmartDesk Team",
                    agent.getFullName(),
                    ticket.getId(),
                    ticket.getSubject(),
                    ticket.getPriority(),
                    ticket.getCreator().getFullName()));

            mailSender.send(message);
            logger.info("Ticket assigned email sent to {} for ticket #{}", agent.getUsername(), ticket.getId());
        } catch (Exception e) {
            logger.warn("Failed to send ticket assigned email: {}", e.getMessage());
        }
    }

    /**
     * Send notification when a comment is added.
     */
    @Async
    public void sendCommentAddedEmail(Ticket ticket, Comment comment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(ticket.getCreator().getEmail());
            message.setSubject("[SmartDesk] New Comment on Ticket #" + ticket.getId());
            message.setText(String.format(
                    "Hello %s,\n\nA new comment was added to your ticket.\n\n" +
                    "Ticket: #%d - %s\nComment by: %s\n\n\"%s\"\n\n— SmartDesk Team",
                    ticket.getCreator().getFullName(),
                    ticket.getId(),
                    ticket.getSubject(),
                    comment.getAuthor().getFullName(),
                    comment.getContent()));

            mailSender.send(message);
            logger.info("Comment notification sent for ticket #{}", ticket.getId());
        } catch (Exception e) {
            logger.warn("Failed to send comment email: {}", e.getMessage());
        }
    }
}
