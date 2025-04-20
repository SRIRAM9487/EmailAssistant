package com.email.EmailAssistant.Controller;

import java.rmi.ServerError;

import com.email.EmailAssistant.DTO.EmailRequest;
import com.email.EmailAssistant.Service.EmailGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
@CrossOrigin
public class EmailGeneratorController {

  @Autowired
  public EmailGeneratorService service;

  @PostMapping("/generate")
  public ResponseEntity<String> generateEmail(@RequestBody EmailRequest email) {
    String response = service.generateEmailReply(email);
    return ResponseEntity.ok(response);
  }

}
