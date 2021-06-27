package io.github.markusjx.repositories;

import io.github.markusjx.types.Sensor;
import io.github.markusjx.types.SensorData;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.List;

/**
 * A sensor data repository
 */
@ApplicationScoped
public class SensorDataRepo implements PanacheRepository<SensorData> {
    /**
     * The entity manager
     */
    @Inject
    EntityManager em;

    /**
     * Persist sensor
     *
     * @param data the data to persist
     */
    @Transactional
    public void persistData(SensorData data) {
        em.persist(data);
    }

    /**
     * Get data for a sensor
     *
     * @param sensor the sensor to get data for
     * @param limit the max amount of data to retrieve
     * @param offset the offset in the database
     * @return the retrieved data
     */
    public List<SensorData> getDataForSensor(Sensor sensor, int limit, int offset) {
        var query = em
                .createQuery("select d from SensorData d where d.sensor = :sensor order by d.timestamp desc",
                        SensorData.class)
                .setParameter("sensor", sensor);

        if (limit > 0) {
            query.setMaxResults(limit);
        }

        if (offset >= 0) {
            query.setFirstResult(offset);
        }

        return query.getResultList();
    }
}
