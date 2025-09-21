package com.quattrinh.shop.config;

import com.quattrinh.shop.service.UploadService;
import java.nio.file.Path;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration for serving uploaded files.
 */
@Configuration
public class UploadWebConfiguration implements WebMvcConfigurer {

    private final UploadService uploadService;

    public UploadWebConfiguration(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = uploadService.getUploadPath();

        registry.addResourceHandler("/api/files/**").addResourceLocations("file:" + uploadPath.toAbsolutePath() + "/").setCachePeriod(3600); // Cache for 1 hour
    }
}
