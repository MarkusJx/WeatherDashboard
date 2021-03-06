package io.github.markusjx.types;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A sensor data entity
 */
@Entity
public class SensorData implements Serializable {
    /**
     * The sensor that generated this data
     */
    @Id
    @ManyToOne
    @JoinColumn
    private Sensor sensor;

    /**
     * The timestamp of the data
     */
    @Id
    @Column(nullable = false)
    private Instant timestamp;

    /**
     * The captured temperature value
     */
    @Column
    private Float temperature;

    /**
     * The captured humidity value
     */
    @Column
    private Float humidity;

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

    public Float getTemperature() {
        return temperature;
    }

    public void setTemperature(Float temperature) {
        this.temperature = temperature;
    }

    public Float getHumidity() {
        return humidity;
    }

    public void setHumidity(Float humidity) {
        this.humidity = humidity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        var that = (SensorData) o;
        return Objects.equals(sensor, that.sensor) &&
                Objects.equals(timestamp, that.timestamp) &&
                Objects.equals(temperature, that.temperature) &&
                Objects.equals(humidity, that.humidity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sensor, timestamp, temperature, humidity);
    }
}
