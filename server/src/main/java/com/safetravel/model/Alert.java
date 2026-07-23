package com.safetravel.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "digital_id", referencedColumnName = "digital_id", nullable = false)
    @JsonProperty("touristId")
    private Tourist touristId;

    @Column(columnDefinition = "DECIMAL(10,8)", nullable = false)
    private Double latitude;

    @Column(columnDefinition = "DECIMAL(11,8)", nullable = false)
    private Double longitude;

    @Column(length = 20)
    private String status = "pending";

    @Column(name = "risk_level", length = 10)
    private String riskLevel = "HIGH";

    @Column(length = 200)
    private String reason = "Distress signal triggered";

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "triggered_at", updatable = false)
    private LocalDateTime createdAt;

    public Alert() {}

    public Alert(Long id, Tourist touristId, Double latitude, Double longitude, String status, String riskLevel, String reason, LocalDateTime createdAt) {
        this.id = id;
        this.touristId = touristId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.riskLevel = riskLevel;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Tourist getTouristId() { return touristId; }
    public void setTouristId(Tourist touristId) { this.touristId = touristId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String get_id() {
        return id != null ? id.toString() : null;
    }

    public Location getLocation() {
        if (latitude != null || longitude != null) {
            return new Location(latitude, longitude);
        }
        return null;
    }

    public void setLocation(Location location) {
        if (location != null) {
            this.latitude = location.getLat();
            this.longitude = location.getLng();
        }
    }

    public static class Location {
        private Double lat;
        private Double lng;

        public Location() {}
        public Location(Double lat, Double lng) {
            this.lat = lat;
            this.lng = lng;
        }
        public Double getLat() { return lat; }
        public void setLat(Double lat) { this.lat = lat; }
        public Double getLng() { return lng; }
        public void setLng(Double lng) { this.lng = lng; }
    }
}
