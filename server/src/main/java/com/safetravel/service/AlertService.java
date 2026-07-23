package com.safetravel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.safetravel.dto.AlertRequest;
import com.safetravel.model.Alert;
import com.safetravel.model.Tourist;
import com.safetravel.repository.AlertRepository;
import com.safetravel.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private TouristRepository touristRepository;

    @Autowired
    private BroadcastWebSocketHandler webSocketHandler;

    @Autowired
    private ObjectMapper objectMapper;

    public Alert createAlert(AlertRequest req) {
        Tourist tourist = touristRepository.findByDigitalIdIgnoreCase(req.getDigitalId())
                .orElseThrow(() -> new RuntimeException("Invalid Digital ID. Tourist not found."));

        Alert alert = new Alert();
        alert.setTouristId(tourist);
        alert.setLatitude(req.getLatitude());
        alert.setLongitude(req.getLongitude());
        alert.setStatus("pending");
        alert.setRiskLevel("HIGH");
        alert.setReason("Distress signal triggered");

        Alert savedAlert = alertRepository.save(alert);

        // Broadcast to WebSocket clients
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("event", "newAlert");
            event.put("data", savedAlert);
            String payload = objectMapper.writeValueAsString(event);
            webSocketHandler.broadcast(payload);
        } catch (Exception e) {
            // Ignore broadcast failure
        }

        return savedAlert;
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteAlert(Long id) {
        alertRepository.deleteById(id);
    }
}
