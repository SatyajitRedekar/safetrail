package com.safetravel.service;

import com.safetravel.dto.ZoneRequest;
import com.safetravel.model.Zone;
import com.safetravel.repository.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneService {

    @Autowired
    private ZoneRepository zoneRepository;

    public Zone createZone(ZoneRequest req) {
        if (req.getCoordinates() == null || req.getCoordinates().size() < 3) {
            throw new RuntimeException("A zone must have at least 3 coordinates to form a polygon.");
        }

        Zone zone = new Zone();
        zone.setName(req.getName());
        zone.setType(req.getType());
        zone.setCoordinates(req.getCoordinates());
        zone.setDensity(req.getDensity());

        return zoneRepository.save(zone);
    }

    public List<Zone> getAllZones() {
        return zoneRepository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteZone(Long id) {
        zoneRepository.deleteById(id);
    }
}
