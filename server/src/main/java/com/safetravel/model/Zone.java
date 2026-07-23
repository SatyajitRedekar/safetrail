package com.safetravel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "zones")
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String type;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "zone_coordinates", joinColumns = @JoinColumn(name = "zone_id"))
    private List<Coordinate> coordinates;

    @Column
    private Double density;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Zone() {}

    public Zone(Long id, String name, String type, List<Coordinate> coordinates, Double density, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.coordinates = coordinates;
        this.density = density;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<Coordinate> getCoordinates() { return coordinates; }
    public void setCoordinates(List<Coordinate> coordinates) { this.coordinates = coordinates; }

    public Double getDensity() { return density; }
    public void setDensity(Double density) { this.density = density; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Helper property to map ID to _id for React client compatibility
    public String get_id() {
        return id != null ? id.toString() : null;
    }

    @Embeddable
    public static class Coordinate {
        @Column(nullable = false)
        private Double lat;
        
        @Column(nullable = false)
        private Double lng;

        public Coordinate() {}
        public Coordinate(Double lat, Double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public Double getLat() { return lat; }
        public void setLat(Double lat) { this.lat = lat; }
        public Double getLng() { return lng; }
        public void setLng(Double lng) { this.lng = lng; }
    }
}
