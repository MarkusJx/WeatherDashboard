package io.github.markusjx.types.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.markusjx.types.SensorData;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "A data transfer object for sensor data")
public class SensorDataDTO implements BaseConvertible<SensorData> {
    @Schema(description = "The timestamp of the data", required = true,
            format = "type: integer, format: int64", example = "1624172968")
    @JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "s")
    public Instant timestamp;

    @Schema(description = "The sensor temperature data", required = true, example = "15")
    public Float temperature;

    @Schema(description = "The sensor humidity data", required = true)
    public Float humidity;

    /**
     * Create a sensor data dto
     *
     * @param timestamp   the timestamp when the data was captured
     * @param temperature the captured temperature
     * @param humidity    the captured humidity data
     */
    public SensorDataDTO(Instant timestamp, Float temperature, Float humidity) {
        this.timestamp = timestamp;
        this.temperature = temperature;
        this.humidity = humidity;
    }

    /**
     * Get a sensor data dto from a sensor data entity
     *
     * @param data the entity to convert
     * @return the converted dto
     */
    public static SensorDataDTO fromData(SensorData data) {
        return new SensorDataDTO(data.getTimestamp(), data.getTemperature(), data.getHumidity());
    }

    public SensorData toBase() {
        var data = new SensorData();
        data.setTimestamp(this.timestamp);
        data.setTemperature(this.temperature);
        data.setHumidity(this.humidity);

        return data;
    }
}
