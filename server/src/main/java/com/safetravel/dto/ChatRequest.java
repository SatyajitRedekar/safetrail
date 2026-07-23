package com.safetravel.dto;

import java.util.List;
import java.util.Map;

public class ChatRequest {
    private String message;
    private List<Map<String, Object>> history;
    private String userLocation;

    public ChatRequest() {}
    public ChatRequest(String message, List<Map<String, Object>> history, String userLocation) {
        this.message = message;
        this.history = history;
        this.userLocation = userLocation;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<Map<String, Object>> getHistory() { return history; }
    public void setHistory(List<Map<String, Object>> history) { this.history = history; }

    public String getUserLocation() { return userLocation; }
    public void setUserLocation(String userLocation) { this.userLocation = userLocation; }
}
