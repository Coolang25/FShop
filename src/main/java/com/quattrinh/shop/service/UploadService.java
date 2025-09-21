package com.quattrinh.shop.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for handling file uploads.
 */
@Service
public class UploadService {

    private static final Logger LOG = LoggerFactory.getLogger(UploadService.class);

    private final Path uploadPath;

    public UploadService() {
        // Create upload directory in the project root
        this.uploadPath = Paths.get("uploads").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.uploadPath);
            LOG.info("Upload directory created: {}", this.uploadPath);
        } catch (IOException ex) {
            LOG.error("Could not create the directory where the uploaded files will be stored.", ex);
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    /**
     * Save an uploaded image file.
     *
     * @param file the file to save
     * @return the generated filename
     * @throws IOException if the file could not be saved
     */
    public String saveImage(MultipartFile file) throws IOException {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        if (originalFileName.contains("..")) {
            throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
        }

        // Generate unique filename with timestamp and UUID
        String fileExtension = getFileExtension(originalFileName);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String fileName = "img_" + timestamp + "_" + uuid + fileExtension;

        // Copy file to target location
        Path targetLocation = this.uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        LOG.info("File saved successfully: {}", fileName);
        return fileName;
    }

    /**
     * Load a file as a resource.
     *
     * @param fileName the name of the file to load
     * @return the resource
     * @throws RuntimeException if the file could not be loaded
     */
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.uploadPath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    /**
     * Delete a file.
     *
     * @param fileName the name of the file to delete
     * @return true if the file was deleted, false otherwise
     */
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = this.uploadPath.resolve(fileName).normalize();
            return Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            LOG.error("Error deleting file: {}", fileName, ex);
            return false;
        }
    }

    /**
     * Get the upload directory path.
     *
     * @return the upload directory path
     */
    public Path getUploadPath() {
        return uploadPath;
    }

    /**
     * Extract file extension from filename.
     *
     * @param fileName the filename
     * @return the file extension including the dot
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.'));
    }
}
