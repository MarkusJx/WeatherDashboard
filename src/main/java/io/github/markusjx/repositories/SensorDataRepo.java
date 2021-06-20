package io.github.markusjx.repositories;

import io.github.markusjx.types.Sensor;
import io.github.markusjx.types.SensorData;
import io.github.markusjx.types.Unit;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class SensorDataRepo implements PanacheRepository<SensorData> {
    @Inject
    EntityManager em;

    @Transactional
    public void persistData(SensorData data) {
        em.persist(data);
    }

    public List<SensorData> getDataForSensor(Sensor sensor, Unit unit, int limit, int offset) {
        var query = em
                .createQuery("select d from SensorData d where d.sensor = :sensor and d.unit = :unit", SensorData.class)
                .setParameter("sensor", sensor)
                .setParameter("unit", unit);

        if (limit > 0) {
            query.setMaxResults(limit);
        }

        if (offset >= 0) {
            query.setFirstResult(offset);
        }

        return query.getResultList();
    }
}
