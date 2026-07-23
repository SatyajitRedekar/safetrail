package com.safetravel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tourists")
public class Tourist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "digital_id", unique = true, nullable = false, length = 20)
    private String digitalId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(nullable = false, length = 50)
    private String passport;

    @Column(name = "emergency_contact", nullable = false, length = 15)
    private String emergencyContact;

    @Column(name = "risk_zone", length = 100)
    private String riskZone;

    @Column(name = "blockchain_hash", length = 64)
    private String blockchainHash;

    @Column(name = "ledger_status", length = 20)
    private String ledgerStatus = "VERIFIED";

    @Column(name = "anomaly_status", length = 20)
    private String anomalyStatus = "NORMAL";

    @Column(name = "last_ping")
    private LocalDateTime lastPing = LocalDateTime.now();

    @Column(columnDefinition = "DECIMAL(10,8)")
    private Double latitude;

    @Column(columnDefinition = "DECIMAL(11,8)")
    private Double longitude;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Transient
    private String token;

    public Tourist() {}

    public Tourist(Long id, String digitalId, String name, String email, String password, String phone, String passport, String emergencyContact, String riskZone, String blockchainHash, String ledgerStatus, String anomalyStatus, LocalDateTime lastPing, Double latitude, Double longitude, LocalDateTime createdAt, String token) {
        this.id = id;
        this.digitalId = digitalId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.passport = passport;
        this.emergencyContact = emergencyContact;
        this.riskZone = riskZone;
        this.blockchainHash = blockchainHash;
        this.ledgerStatus = ledgerStatus;
        this.anomalyStatus = anomalyStatus;
        this.lastPing = lastPing;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = createdAt;
        this.token = token;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDigitalId() { return digitalId; }
    public void setDigitalId(String digitalId) { this.digitalId = digitalId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassport() { return passport; }
    public void setPassport(String passport) { this.passport = passport; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getRiskZone() { return riskZone; }
    public void setRiskZone(String riskZone) { this.riskZone = riskZone; }

    public String getBlockchainHash() { return blockchainHash; }
    public void setBlockchainHash(String blockchainHash) { this.blockchainHash = blockchainHash; }

    public String getLedgerStatus() { return ledgerStatus; }
    public void setLedgerStatus(String ledgerStatus) { this.ledgerStatus = ledgerStatus; }

    public String getAnomalyStatus() { return anomalyStatus; }
    public void setAnomalyStatus(String anomalyStatus) { this.anomalyStatus = anomalyStatus; }

    public LocalDateTime getLastPing() { return lastPing; }
    public void setLastPing(LocalDateTime lastPing) { this.lastPing = lastPing; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    // Helper property to map ID to _id for React client compatibility
    public String get_id() {
        return id != null ? id.toString() : null;
    }

    // Helper property to support MongoDB-like location object in JSON
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
