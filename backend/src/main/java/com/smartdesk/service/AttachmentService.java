package com.smartdesk.service;

import com.smartdesk.dto.AttachmentResponse;
import com.smartdesk.entity.Attachment;
import com.smartdesk.entity.Ticket;
import com.smartdesk.entity.User;
import com.smartdesk.exception.BadRequestException;
import com.smartdesk.exception.ResourceNotFoundException;
import com.smartdesk.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Attachment service — file upload/download with validation.
 * Allowed: PNG, JPG, PDF. Max: 5MB.
 */
@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TicketService ticketService;
    private final UserService userService;

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    @Value("${app.file.allowed-types}")
    private String allowedTypes;

    @Value("${app.file.max-size}")
    private long maxFileSize;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/png", "image/jpeg", "application/pdf"
    );

    /**
     * Upload a file attachment to a ticket.
     */
    @Transactional
    public AttachmentResponse uploadAttachment(Long ticketId, MultipartFile file, String username) {
        // Validate file
        validateFile(file);

        Ticket ticket = ticketService.findTicketById(ticketId);
        User uploader = userService.findUserByUsername(username);

        try {
            // Create upload directory if not exists
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ?
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String storedFilename = UUID.randomUUID().toString() + extension;

            // Save file to disk
            Path targetLocation = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Save metadata to database
            Attachment attachment = Attachment.builder()
                    .fileName(originalFilename)
                    .filePath(storedFilename)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .ticket(ticket)
                    .uploader(uploader)
                    .build();

            attachment = attachmentRepository.save(attachment);

            return AttachmentResponse.builder()
                    .id(attachment.getId())
                    .fileName(attachment.getFileName())
                    .contentType(attachment.getContentType())
                    .fileSize(attachment.getFileSize())
                    .downloadUrl("/api/tickets/" + ticketId + "/attachments/" + attachment.getId() + "/download")
                    .uploadedAt(attachment.getUploadedAt())
                    .build();

        } catch (IOException e) {
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Get all attachments for a ticket.
     */
    @Transactional(readOnly = true)
    public List<AttachmentResponse> getAttachmentsByTicketId(Long ticketId) {
        ticketService.findTicketById(ticketId);

        return attachmentRepository.findByTicketId(ticketId).stream()
                .map(a -> AttachmentResponse.builder()
                        .id(a.getId())
                        .fileName(a.getFileName())
                        .contentType(a.getContentType())
                        .fileSize(a.getFileSize())
                        .downloadUrl("/api/tickets/" + ticketId + "/attachments/" + a.getId() + "/download")
                        .uploadedAt(a.getUploadedAt())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Download a file attachment.
     */
    public Resource downloadAttachment(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize()
                    .resolve(attachment.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found on disk");
            }
        } catch (MalformedURLException e) {
            throw new BadRequestException("Invalid file path");
        }
    }

    /**
     * Get attachment entity by ID.
     */
    public Attachment getAttachmentEntity(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
    }

    /**
     * Validate file type and size.
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        // Validate file size (5MB max)
        if (file.getSize() > maxFileSize) {
            throw new BadRequestException("File size exceeds maximum of 5MB");
        }

        // Validate content type (PNG, JPG, PDF only)
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException(
                    "Invalid file type. Only PNG, JPG, and PDF files are allowed. Got: " + contentType);
        }
    }
}
