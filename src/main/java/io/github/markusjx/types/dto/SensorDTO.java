package io.github.markusjx.types.dto;

import io.github.markusjx.types.Sensor;

public class SensorDTO implements BaseConvertible<Sensor> {
    public final String name;

    public SensorDTO() {
        name = "";
    }

    @Override
    public Sensor toBase() {
        var s = new Sensor();
        s.name = this.name;
        return s;
    }
}
