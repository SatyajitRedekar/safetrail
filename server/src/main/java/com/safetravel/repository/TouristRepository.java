package com.safetravel.repository;

import com.safetravel.model.Tourist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TouristRepository extends JpaRepository<Tourist, Long> {
    Optional<Tourist> findByEmailIgnoreCase(String email);
    Optional<Tourist> findByDigitalIdIgnoreCase(String digitalId);
}
