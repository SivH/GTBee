package com.sivh.gtbee.repository;

import com.sivh.gtbee.domain.GTBactivity;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the GTBactivity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GTBactivityRepository extends JpaRepository<GTBactivity, Long> {

}
