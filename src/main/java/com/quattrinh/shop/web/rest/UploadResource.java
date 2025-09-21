package com.quattrinh.shop.web.rest;

import com.quattrinh.shop.service.UploadService;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.web.util.HeaderUtil;

/**
 * REST controller for managing file uploads.
 */
@RestController
@RequestMapping("/api")
public class UploadResource {

    private static final Logger LOG = LoggerFactory.getLogger(UploadResource.class);

    private final UploadService uploadService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public UploadResource(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    /**
     * {@code POST  /upload/image} : Upload an image file.
     *
     * @param file the image file to upload.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the file URL in body.
     */
    @PostMapping("/upload/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to upload image: {}", file.getOriginalFilename());

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert(applicationName, true, "upload", "fileempty", "File is empty"))
                    .build();
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert(applicationName, true, "upload", "invalidtype", "File must be an image"))
                    .build();
            }

            // Validate file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .headers(
                        HeaderUtil.createFailureAlert(
                            applicationName,
                            true,
                            "upload",
                            "filesizetoolarge",
                            "File size must be less than 5MB"
                        )
                    )
                    .build();
            }

            String fileName = uploadService.saveImage(file);
            String fileUrl = "/api/files/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("fileUrl", fileUrl);
            response.put("originalName", file.getOriginalFilename());
            response.put("size", String.valueOf(file.getSize()));
            response.put("contentType", contentType);

            return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "Image uploaded successfully", fileName))
                .body(response);
        } catch (IOException e) {
            LOG.error("Error uploading image: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, "upload", "uploaderror", "Error uploading file"))
                .build();
        }
    }

    /**
     * {@code GET  /upload/files/{fileName}} : Get the uploaded file.
     *
     * @param fileName the name of the file to retrieve.
     * @param request the HTTP request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the file in body.
     */
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName, HttpServletRequest request) {
        LOG.debug("REST request to get file: {}", fileName);

        try {
            Resource resource = uploadService.loadFileAsResource(fileName);

            // Determine content type
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                LOG.info("Could not determine file type.");
            }

            // Fallback to the default content type if type could not be determined
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
        } catch (Exception e) {
            LOG.error("Error loading file: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * {@code DELETE  /upload/files/{fileName}} : Delete the uploaded file.
     *
     * @param fileName the name of the file to delete.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @DeleteMapping("/files/{fileName:.+}")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileName) {
        LOG.debug("REST request to delete file: {}", fileName);

        try {
            boolean deleted = uploadService.deleteFile(fileName);
            if (deleted) {
                return ResponseEntity.ok().headers(HeaderUtil.createAlert(applicationName, "File deleted successfully", fileName)).build();
            } else {
                return ResponseEntity.notFound()
                    .headers(HeaderUtil.createFailureAlert(applicationName, true, "upload", "filenotfound", "File not found"))
                    .build();
            }
        } catch (Exception e) {
            LOG.error("Error deleting file: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, "upload", "deleteerror", "Error deleting file"))
                .build();
        }
    }
}
