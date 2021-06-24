package io.github.markusjx.types.dto;

import io.github.markusjx.types.Sensor;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public class SensorDTO implements BaseConvertible<Sensor> {
    @Schema(description = "The name of the sensor", example = "Sensor#1")
    public String name;

    @Schema(description = "The location of the sensor", example = "Living Room")
    public String location;

    public SensorDTO() {
        name = null;
        location = null;
    }

    @Override
    public Sensor toBase() {
        var s = new Sensor();
        s.setName(this.name);
        s.setLocation(this.location);
        return s;
    }
}
