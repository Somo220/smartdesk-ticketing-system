package com.smartdesk.controller;

import com.smartdesk.dto.AttachmentResponse;
import com.smartdesk.entity.Attachment;
import com.smartdesk.service.AttachmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Attachment controller — upload and download file attachments.
 */
@RestController
@RequestMapping("/api/tickets/{ticketId}/attachments")
@RequiredArgsConstructor
@Tag(name = "Attachments", description = "File attachment endpoints")
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file attachment (PNG, JPG, PDF — max 5MB)")
    public ResponseEntity<AttachmentResponse> uploadAttachment(
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        return ResponseEntity.ok(
                attachmentService.uploadAttachment(ticketId, file, authentication.getName()));
    }

    @GetMapping
    @Operation(summary = "Get all attachments for a ticket")
    public ResponseEntity<List<AttachmentResponse>> getAttachments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(attachmentService.getAttachmentsByTicketId(ticketId));
    }

    @GetMapping("/{attachmentId}/download")
    @Operation(summary = "Download a file attachment")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable Long ticketId,
            @PathVariable Long attachmentId) {
        Resource resource = attachmentService.downloadAttachment(attachmentId);
        Attachment attachment = attachmentService.getAttachmentEntity(attachmentId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName() + "\"")
                .body(resource);
    }
}
