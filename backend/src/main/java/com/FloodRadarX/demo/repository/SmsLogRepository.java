package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.SmsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SmsLogRepository extends JpaRepository<SmsLog, Long> {

    List<SmsLog> findByAlertId(Long alertId);

    List<SmsLog> findByRecipientPhone(String recipientPhone);

    Optional<SmsLog> findTopByRecipientPhoneAndMessageOrderBySentAtDesc(String recipientPhone, String message);

    List<SmsLog> findByRecipientPhoneAndSentAtAfter(String recipientPhone, LocalDateTime after);

    List<SmsLog> findTop50ByOrderBySentAtDesc();
}
