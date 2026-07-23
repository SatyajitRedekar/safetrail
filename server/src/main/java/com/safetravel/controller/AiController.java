package com.safetravel.controller;

import com.safetravel.dto.ChatRequest;
import com.safetravel.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
        String message = req.getMessage();
        String userLocation = req.getUserLocation();

        if (apiKey == null || apiKey.isEmpty()) {
            return ResponseEntity.ok(new ChatResponse(getFallbackResponse(message)));
        }

        try {
            String systemPrompt = String.format(
                    "You are the SafeTravel AI Assistant, an official government tourist safety guide for India. " +
                    "Be concise, helpful, and prioritize safety. If they ask about emergencies, tell them to use the SOS button or call 112. " +
                    "The user's current GPS location context is: %s. " +
                    "Keep responses under 3 sentences.",
                    userLocation != null ? userLocation : "Unknown"
            );

            String fullPrompt = systemPrompt + "\n\nUser: " + message + "\nAssistant:";

            // Format Google Gemini generateContent payload
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", fullPrompt);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", List.of(textPart));

            Map<String, Object> contents = new HashMap<>();
            contents.put("contents", List.of(parts));

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(contents, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List candidates = (List) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List responseParts = (List) content.get("parts");
                    if (responseParts != null && !responseParts.isEmpty()) {
                        Map responsePart = (Map) responseParts.get(0);
                        String responseText = (String) responsePart.get("text");
                        return ResponseEntity.ok(new ChatResponse(responseText.trim()));
                    }
                }
            }

            // Fallback if response processing fails
            return ResponseEntity.ok(new ChatResponse(getFallbackResponse(message)));

        } catch (Exception e) {
            // Fallback on HTTP or API error
            return ResponseEntity.ok(new ChatResponse(getFallbackResponse(message)));
        }
    }

    private String getFallbackResponse(String message) {
        // Simulate network delay
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String lower = message.toLowerCase();
        if (lower.contains("weather") || lower.contains("rain")) {
            return "The weather can change quickly in hilly regions. Please check the Live Weather section on your dashboard for real-time alerts.";
        } else if (lower.contains("safe") || lower.contains("danger")) {
            return "If you feel unsafe, please use the Emergency SOS button immediately. Otherwise, stick to verified tourist routes.";
        } else if (lower.contains("hospital") || lower.contains("police")) {
            return "You can find nearby emergency services by pressing the SOS button or checking the Live Explorer map. The general emergency number is 112.";
        } else if (lower.contains("hello") || lower.contains("hi")) {
            return "Hello! Stay safe and enjoy your journey with SafeTravel. How can I assist you?";
        }
        return "I am operating in offline simulation mode (AI network unreachable). Remember to always follow local police guidelines.";
    }
}
