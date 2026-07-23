package com.safetravel.service;

import com.safetravel.dto.LoginRequest;
import com.safetravel.dto.RegisterRequest;
import com.safetravel.model.Tourist;
import com.safetravel.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TouristService {

    @Autowired
    private TouristRepository touristRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Tourist registerTourist(RegisterRequest req) {
        Tourist tourist = new Tourist();
        tourist.setName(req.getName());
        tourist.setEmail(req.getEmail().toLowerCase().trim());
        tourist.setPassword(passwordEncoder.encode(req.getPassword()));
        tourist.setPhone(req.getPhone());
        tourist.setPassport(req.getPassport());
        tourist.setEmergencyContact(req.getEmergencyContact());
        tourist.setRiskZone(req.getRiskZone());
        
        if (req.getLocation() != null) {
            tourist.setLocation(req.getLocation());
        }

        // Generate unique digital ID (e.g. ST-A1B2C3)
        String digitalId = generateDigitalId();
        tourist.setDigitalId(digitalId);

        // Generate simulated blockchain hash (SHA-256)
        String blockchainHash = generateBlockchainHash(digitalId, req.getName(), req.getPassport());
        tourist.setBlockchainHash(blockchainHash);

        return touristRepository.save(tourist);
    }

    public Tourist loginTourist(LoginRequest req) {
        Tourist tourist = touristRepository.findByEmailIgnoreCase(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid credentials. Please check your Email and Password."));

        if (!passwordEncoder.matches(req.getPassword(), tourist.getPassword())) {
            throw new RuntimeException("Invalid credentials. Please check your Email and Password.");
        }

        return tourist;
    }

    public List<Tourist> getAllTourists() {
        return touristRepository.findAll();
    }

    public Tourist getTouristByDigitalId(String digitalId) {
        return touristRepository.findByDigitalIdIgnoreCase(digitalId)
                .orElseThrow(() -> new RuntimeException("Tourist not found"));
    }

    public Tourist updatePing(String digitalId, String simulatedLastPing) {
        Tourist tourist = getTouristByDigitalId(digitalId);

        if (simulatedLastPing != null && !simulatedLastPing.isEmpty()) {
            try {
                tourist.setLastPing(LocalDateTime.parse(simulatedLastPing));
            } catch (Exception e) {
                tourist.setLastPing(LocalDateTime.now());
            }
        } else {
            tourist.setLastPing(LocalDateTime.now());
        }

        tourist.setAnomalyStatus("NORMAL");
        return touristRepository.save(tourist);
    }

    public List<Tourist> runAnomalyEngine() {
        List<Tourist> tourists = touristRepository.findAll();
        List<Tourist> flagged = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Tourist t : tourists) {
            if (t.getLastPing() == null) continue;

            long nowMillis = now.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
            long pingMillis = t.getLastPing().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
            double hoursSincePing = (double) (nowMillis - pingMillis) / (1000 * 60 * 60);

            String newStatus = t.getAnomalyStatus();

            if (hoursSincePing > 12) {
                newStatus = "MISSING_SIGNAL";
            } else if (hoursSincePing > 2) {
                newStatus = "PROLONGED_INACTIVITY";
            }

            if (!newStatus.equals(t.getAnomalyStatus())) {
                t.setAnomalyStatus(newStatus);
                touristRepository.save(t);
            }

            if (!"NORMAL".equals(t.getAnomalyStatus())) {
                flagged.add(t);
            }
        }

        return flagged;
    }

    public void deleteTourist(Long id) {
        touristRepository.deleteById(id);
    }

    private String generateDigitalId() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[3];
        random.nextBytes(bytes);
        StringBuilder sb = new StringBuilder("ST-");
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }

    private String generateBlockchainHash(String digitalId, String name, String passport) {
        try {
            String rawData = String.format("%s-%s-%s-%d-SAFETRAVEL_SECRET", digitalId, name, passport, System.currentTimeMillis());
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawData.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder("0x");
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return "0x" + java.util.UUID.randomUUID().toString().replace("-", "");
        }
    }
}
