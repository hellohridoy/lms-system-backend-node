package com.library.library_management.repository;

import com.library.library_management.model.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {
    default Optional<SystemConfig> findCurrentConfig() {
        return findAll().stream().findFirst();
    }
}
