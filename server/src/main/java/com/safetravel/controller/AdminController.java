package com.safetravel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.safetravel.dto.BroadcastRequest;
import com.safetravel.service.BroadcastWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private BroadcastWebSocketHandler webSocketHandler;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if ("admin".equals(username) && "safetravel2026".equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", "st_admin_token_98765xyz");
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid police dispatch credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcast(@RequestBody BroadcastRequest req) {
        if (req.getMessage() == null || req.getMessage().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Message required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("event", "emergency_broadcast");
            payload.put("message", req.getMessage());
            payload.put("severity", req.getSeverity() != null ? req.getSeverity() : "warning");
            payload.put("timestamp", LocalDateTime.now().toString());

            String jsonPayload = objectMapper.writeValueAsString(payload);
            webSocketHandler.broadcast(jsonPayload);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Broadcast sent successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Broadcast failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
