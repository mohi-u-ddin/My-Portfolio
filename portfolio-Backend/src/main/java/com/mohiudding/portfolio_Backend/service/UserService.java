package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.model.User;

import java.util.Optional;


public interface UserService {

    User authenticate(LoginRequest loginRequest);

    User getAdminUser();

    User getUserById(Long id);

    Optional<User> getUserByEmail(String email);

    User updateAdmin(String name, String email);

    User changePassword(String oldPassword, String newPassword);
}
