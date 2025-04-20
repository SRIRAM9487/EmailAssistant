package com.email.EmailAssistant.Service;

import java.util.Map;
import java.util.Objects;

import com.email.EmailAssistant.DTO.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorService {

  private final WebClient webClient;

  @Value("${gemini.api.url}")
  private String geminiApiUrl;
  @Value("${gemini.api.key}")
  private String geminiApiKey;

  public EmailGeneratorService(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.build();
  }

  public String generateEmailReply(EmailRequest emailRequest) {
    String prompt = buildPrompt(emailRequest);

    Map<String, Object> requestBody = Map.of(
        "contents", new Object[] {
            Map.of("parts", new Object[] {
                Map.of("text", prompt)
            })
        });

    String response = webClient.post().uri(geminiApiUrl + geminiApiKey).header("Content-Type", "application/json")
    .bodyValue(requestBody)
        .retrieve().bodyToMono(String.class).block();
    return extractResponse(response);
  }

public String buildPrompt(EmailRequest emailRequest) {
    StringBuilder prompt = new StringBuilder();
    prompt.append("Generate a professional reply for the following email. The reply should be professional and concise. Dont add things like you name here[Your name, Your team] . Dont generate like many only one and that should be consice\n");
    System.out.println("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJjjjjj");
    if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
        prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.\n");
    }
    prompt.append("\nOriginal Email:\n").append(emailRequest.getEmailContent());

    return prompt.toString();
}

  private String extractResponse(String response) {
    try {
      ObjectMapper mapper = new ObjectMapper();
      JsonNode rootNode = mapper.readTree(response);
      return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
    } catch (Exception e) {
      return "Error while processing the request {} " + e.getMessage();
    }
  }
}
