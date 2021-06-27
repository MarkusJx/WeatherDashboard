package io.github.markusjx.types;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

/**
 * A sensor entity
 */
@Entity
@Schema(description = "A sensor entity")
public class Sensor implements Serializable {
    /**
     * The id of the sensor.
     * Will be generated.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "The id of the sensor")
    private Long id;

    /**
     * The uuid of the sensor
     */
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    @Schema(description = "The unique id of the sensor")
    private UUID uuid;

    /**
     * The name of the sensor
     */
    @Column(nullable = false)
    @Schema(description = "The name of the sensor")
    private String name;

    /**
     * The location of the sensor
     */
    @Column(nullable = false)
    @Schema(description = "The location of the sensor")
    private String location;

    /**
     * Create a new sensor entity
     */
    public Sensor() {
        id = null;
        name = null;
        uuid = UUID.randomUUID();
    }

    public Long getId() {
        return id;
    }

    public UUID getUUID() {
        return uuid;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
