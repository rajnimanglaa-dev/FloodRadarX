package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be between 10 and 15 digits")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be at least 6 characters")
    private String password;

    private String preferredDistrict;
    private String preferredState;

    public RegisterRequest() {
    }

    public RegisterRequest(String fullName, String email, String phoneNumber, String password, 
                           String preferredDistrict, String preferredState) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.preferredDistrict = preferredDistrict;
        this.preferredState = preferredState;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPreferredDistrict() {
        return preferredDistrict;
    }

    public void setPreferredDistrict(String preferredDistrict) {
        this.preferredDistrict = preferredDistrict;
    }

    public String getPreferredState() {
        return preferredState;
    }

    public void setPreferredState(String preferredState) {
        this.preferredState = preferredState;
    }
}
