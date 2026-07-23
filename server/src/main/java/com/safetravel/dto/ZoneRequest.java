package com.safetravel.dto;

import com.safetravel.model.Zone.Coordinate;
import java.util.List;

public class ZoneRequest {
    private String name;
    private String type;
    private List<Coordinate> coordinates;
    private Double density;

    public ZoneRequest() {}
    public ZoneRequest(String name, String type, List<Coordinate> coordinates, Double density) {
        this.name = name;
        this.type = type;
        this.coordinates = coordinates;
        this.density = density;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<Coordinate> getCoordinates() { return coordinates; }
    public void setCoordinates(List<Coordinate> coordinates) { this.coordinates = coordinates; }

    public Double getDensity() { return density; }
    public void setDensity(Double density) { this.density = density; }
}
