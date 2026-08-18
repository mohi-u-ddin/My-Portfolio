package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.dto.LoginResponse;
import com.mohiudding.portfolio_Backend.model.User;

public interface AuthService {

    LoginResponse login(LoginRequest loginRequest);

    void logout();

    User getCurrentUser();
}
