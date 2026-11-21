package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.LoginRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class ApiControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void testHelloEndpointPreserved() throws Exception {
        mockMvc.perform(get("/hello"))
                .andExpect(status().isOk())
                .andExpect(content().string("Welcome to FloodRadarX - Know Risk. Plan Better."));
    }

    @Test
    void testRegionSearchEndpointPreserved() throws Exception {
        mockMvc.perform(get("/api/regions/search?name=Ludhiana"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[0].name", containsStringIgnoringCase("Ludhiana")));
    }

    @Test
    void testRegionsByStateEndpoint() throws Exception {
        mockMvc.perform(get("/api/regions/by-state?state=Punjab"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void testRiskMapEndpoint() throws Exception {
        mockMvc.perform(get("/api/risk-map"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalRegions", greaterThan(0)))
                .andExpect(jsonPath("$.data.regions", hasSize(greaterThan(0))));
    }

    @Test
    void testSheltersEndpoint() throws Exception {
        mockMvc.perform(get("/api/shelters"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));
    }

    @Test
    void testNearbySheltersEndpoint() throws Exception {
        mockMvc.perform(get("/api/shelters/nearby?lat=30.9010&lng=75.8573&radiusKm=50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.data[0].distanceKm", notNullValue()));
    }

    @Test
    void testFloodHistoryEndpoint() throws Exception {
        mockMvc.perform(get("/api/flood-history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));
    }

    @Test
    void testLoginWithAdminCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@floodradarx.in", "Admin@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.role", is("ROLE_ADMIN")));
    }
}
