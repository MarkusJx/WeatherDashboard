package io.github.markusjx.repositories;

import io.github.markusjx.types.Sensor;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;

@ApplicationScoped
public class SensorRepo implements PanacheRepository<Sensor> {
    @Inject
    EntityManager entityManager;

    @Transactional
    public void addSensor(Sensor s) {
        entityManager.persist(s);
    }

    @Transactional
    public Sensor getSensorById(Long id) {
        return entityManager.find(Sensor.class, id);
    }

    @Transactional
    public void removeSensor(Sensor s) {
        if (!entityManager.contains(s)) {
            s = entityManager.merge(s);
        }

        entityManager.remove(s);
    }

    @Transactional
    public Long numSensors() {
        return entityManager.createQuery("select count(s) from Sensor as s", Long.class)
                .getSingleResult();
    }

    @Transactional
    public boolean sensorIdExists(Long id) {
        return entityManager.createQuery("select count(s) from Sensor as s where s.id = :id", Long.class)
                .setParameter("id", id)
                .getSingleResult() > 0;
    }
}
