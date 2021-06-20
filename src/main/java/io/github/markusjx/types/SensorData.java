package io.github.markusjx.types;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

@Entity
public class SensorData implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn
    private Sensor sensor;

    @Id
    @Column(nullable = false)
    private Instant timestamp;

    @Column(nullable = false)
    private Integer value;

    @Id
    @Column(nullable = false)
    private Unit unit;

    public Sensor getSensor() {
        return sensor;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public Unit getUnit() {
        return unit;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        var that = (SensorData) o;
        return Objects.equals(sensor, that.sensor) &&
                Objects.equals(timestamp, that.timestamp) &&
                Objects.equals(value, that.value) &&
                Objects.equals(unit, that.unit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sensor, timestamp, value, unit);
    }
}
