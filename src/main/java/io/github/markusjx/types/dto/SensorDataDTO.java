package io.github.markusjx.types.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.markusjx.types.SensorData;
import io.github.markusjx.types.Unit;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.Instant;

public class SensorDataDTO implements BaseConvertible<SensorData> {
    @Schema(description = "The timestamp of the data", required = true,
            format = "type: integer, format: int64", example = "1624172968")
    @JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "s")
    public final Instant timestamp;

    @Schema(description = "The sensor data value", required = true, example = "15")
    public final Integer value;

    @Schema(description = "The sensor data unit", required = true)
    public final Unit unit;

    public SensorDataDTO(Instant timestamp, Integer value, Unit unit) {
        this.timestamp = timestamp;
        this.value = value;
        this.unit = unit;
    }

    public SensorData toBase() {
        var data = new SensorData();
        data.setTimestamp(this.timestamp);
        data.setValue(this.value);
        data.setUnit(this.unit);

        return data;
    }

    public static SensorDataDTO fromData(SensorData data) {
        return new SensorDataDTO(data.getTimestamp(), data.getValue(), data.getUnit());
    }
}
