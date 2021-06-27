package io.github.markusjx.repositories;

import io.github.markusjx.types.Sensor;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;

/**
 * A sensor repository
 */
@ApplicationScoped
public class SensorRepo implements PanacheRepository<Sensor> {
    /**
     * The entity manager
     */
    @Inject
    EntityManager entityManager;

    /**
     * Add a new sensor
     *
     * @param s the sensor to persist
     */
    @Transactional
    public void addSensor(Sensor s) {
        entityManager.persist(s);
    }

    /**
     * Remove a sensor from the database
     *
     * @param s the sensor to remove
     */
    @Transactional
    public void removeSensor(Sensor s) {
        if (!entityManager.contains(s)) {
            s = entityManager.merge(s);
        }

        entityManager.remove(s);
    }

    /**
     * Get the number of sensors
     *
     * @return the number of sensors in the database
     */
    public Long numSensors() {
        return entityManager.createQuery("select count(s) from Sensor as s", Long.class)
                .getSingleResult();
    }

    /**
     * Check if a sensor with an id exists
     *
     * @param id the id of the sensor to check
     * @return true if the id exists
     */
    public boolean sensorIdExists(Long id) {
        return entityManager.createQuery("select count(s) from Sensor as s where s.id = :id", Long.class)
                .setParameter("id", id)
                .getSingleResult() > 0;
    }
}
