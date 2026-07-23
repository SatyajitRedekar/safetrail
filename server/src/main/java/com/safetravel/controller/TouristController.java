package com.safetravel.controller;

import com.safetravel.config.JwtTokenProvider;
import com.safetravel.dto.LoginRequest;
import com.safetravel.dto.RegisterRequest;
import com.safetravel.model.Tourist;
import com.safetravel.service.TouristService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tourists")
public class TouristController {

    @Autowired
    private TouristService touristService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            Tourist tourist = touristService.registerTourist(req);
            String token = tokenProvider.generateToken(tourist.getEmail());
            tourist.setToken(token);
            return ResponseEntity.status(HttpStatus.CREATED).body(tourist);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Server Error: " + e.getMessage());
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            Tourist tourist = touristService.loginTourist(req);
            String token = tokenProvider.generateToken(tourist.getEmail());
            tourist.setToken(token);
            return ResponseEntity.ok(tourist);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<Tourist>> getAll() {
        return ResponseEntity.ok(touristService.getAllTourists());
    }

    @GetMapping("/{digitalId}")
    public ResponseEntity<?> getByDigitalId(@PathVariable String digitalId) {
        try {
            Tourist tourist = touristService.getTouristByDigitalId(digitalId);
            return ResponseEntity.ok(tourist);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Tourist not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PutMapping("/{digitalId}/ping")
    public ResponseEntity<?> updatePing(@PathVariable String digitalId, @RequestBody(required = false) Map<String, String> body) {
        try {
            String simulatedLastPing = body != null ? body.get("simulatedLastPing") : null;
            Tourist tourist = touristService.updatePing(digitalId, simulatedLastPing);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Ping updated");
            response.put("tourist", tourist);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Server Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> runAnomalyEngine() {
        try {
            List<Tourist> flagged = touristService.runAnomalyEngine();
            Map<String, Object> response = new HashMap<>();
            response.put("flaggedTourists", flagged);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Server Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            touristService.deleteTourist(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tourist deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Server Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
