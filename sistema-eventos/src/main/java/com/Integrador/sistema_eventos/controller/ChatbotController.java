package com.Integrador.sistema_eventos.controller;

import com.Integrador.sistema_eventos.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/query")
    public ResponseEntity<?> handleQuery(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        String response = chatbotService.getBotResponse(userMessage);
        return ResponseEntity.ok(Map.of("response", response));
    }
}