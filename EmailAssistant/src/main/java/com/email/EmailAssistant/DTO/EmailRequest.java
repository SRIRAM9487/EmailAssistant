package com.email.EmailAssistant.DTO;

import lombok.Data;

@Data
public class EmailRequest {
  private String emailContent;
  private String tone;
}
