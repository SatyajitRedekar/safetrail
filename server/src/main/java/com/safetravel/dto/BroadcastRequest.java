package com.safetravel.dto;

public class BroadcastRequest {
    private String message;
    private String severity;

    public BroadcastRequest() {}
    public BroadcastRequest(String message, String severity) {
        this.message = message;
        this.severity = severity;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
