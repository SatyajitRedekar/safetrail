package com.safetravel.dto;

public class AlertRequest {
    private String digitalId;
    private Double latitude;
    private Double longitude;

    public AlertRequest() {}
    public AlertRequest(String digitalId, Double latitude, Double longitude) {
        this.digitalId = digitalId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getDigitalId() { return digitalId; }
    public void setDigitalId(String digitalId) { this.digitalId = digitalId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
