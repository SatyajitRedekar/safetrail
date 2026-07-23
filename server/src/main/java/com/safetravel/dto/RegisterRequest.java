package com.safetravel.dto;

import com.safetravel.model.Tourist.Location;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String passport;
    private String emergencyContact;
    private String riskZone;
    private Location location;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String phone, String passport, String emergencyContact, String riskZone, Location location) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.passport = passport;
        this.emergencyContact = emergencyContact;
        this.riskZone = riskZone;
        this.location = location;
    }

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

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
}
