package io.github.markusjx.types.dto;

import io.github.markusjx.types.Sensor;

public class SensorDTO implements BaseConvertible<Sensor> {
    public final String name;

    public final String location;

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
