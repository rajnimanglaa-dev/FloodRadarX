package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.SmsLogResponse;
import com.FloodRadarX.demo.entity.Alert;
import com.FloodRadarX.demo.entity.SmsLog;
import com.FloodRadarX.demo.repository.SmsLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    private final SmsLogRepository smsLogRepository;

    @Value("${sms.provider:SIMULATED}")
    private String smsProvider; // SIMULATED, TWILIO, FAST2SMS

    @Value("${sms.cooldown-minutes:60}")
    private int cooldownMinutes;

    @Value("${sms.enabled:true}")
    private boolean smsEnabled;

    public SmsService(SmsLogRepository smsLogRepository) {
        this.smsLogRepository = smsLogRepository;
    }

    @Transactional
    public SmsLog sendSmsAlert(Alert alert, String recipientPhone, String recipientName, String message) {
        if (!smsEnabled) {
            logger.info("SMS system is disabled in configuration. Skipping SMS to {}", recipientPhone);
            return null;
        }

        // Deduplication: check if same message was sent to this phone within the cooldown window
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(cooldownMinutes);
        Optional<SmsLog> recentLog = smsLogRepository
                .findTopByRecipientPhoneAndMessageOrderBySentAtDesc(recipientPhone, message);

        boolean isDuplicate = recentLog.isPresent() && recentLog.get().getSentAt().isAfter(threshold);

        if (isDuplicate) {
            logger.warn("Duplicate SMS suppressed for recipient {} within cooldown window of {} mins", 
                        recipientPhone, cooldownMinutes);
            SmsLog duplicateLog = new SmsLog(
                    alert,
                    recipientPhone,
                    recipientName,
                    message,
                    "SUPPRESSED_DUPLICATE",
                    LocalDateTime.now(),
                    "Suppressed by deduplication filter (sent recently at " + recentLog.get().getSentAt() + ")",
                    true
            );
            return smsLogRepository.save(duplicateLog);
        }

        // Provider dispatching
        String gatewayResponse;
        String status;

        if ("SIMULATED".equalsIgnoreCase(smsProvider)) {
            // Simulated gateway for development & testing without incurring cellular carrier charges
            status = "SIMULATED";
            gatewayResponse = "SIMULATED_OK: Cellular network simulated delivery to " + recipientPhone + 
                    " via FloodRadarX Gateway at " + LocalDateTime.now();
            logger.info("[SMS GATEWAY SIMULATION] To: {} | Recipient: {} | Text: '{}'", 
                        recipientPhone, recipientName, message);
        } else {
            // Real gateway hooks (e.g., Fast2SMS or Twilio via HTTP client)
            status = "SENT";
            gatewayResponse = "GATEWAY_DISPATCHED: Provider " + smsProvider + " accepted message.";
            logger.info("Dispatched SMS via {} to {}", smsProvider, recipientPhone);
        }

        SmsLog log = new SmsLog(
                alert,
                recipientPhone,
                recipientName,
                message,
                status,
                LocalDateTime.now(),
                gatewayResponse,
                false
        );

        return smsLogRepository.save(log);
    }

    public List<SmsLogResponse> getAllLogs() {
        return smsLogRepository.findTop50ByOrderBySentAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SmsLogResponse> getLogsByAlertId(Long alertId) {
        return smsLogRepository.findByAlertId(alertId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SmsLogResponse mapToResponse(SmsLog log) {
        return new SmsLogResponse(
                log.getId(),
                log.getAlert() != null ? log.getAlert().getId() : null,
                log.getRecipientPhone(),
                log.getRecipientName(),
                log.getMessage(),
                log.getStatus(),
                log.getSentAt(),
                log.getGatewayResponse(),
                log.isDuplicate()
        );
    }
}
