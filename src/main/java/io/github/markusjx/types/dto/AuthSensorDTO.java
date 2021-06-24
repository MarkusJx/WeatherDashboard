package io.github.markusjx.types.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.Instant;

public class AuthSensorDTO {
    @Schema(description = "The id of the sensor to generate a token for", required = true, example = "0")
    public Long sensorId;

    @Schema(description = "The generated token's expiration data", nullable = true, required = true,
            format = "type: integer, format: int64", example = "1624172968")
    @JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "s")
    public Instant expiration;

    public AuthSensorDTO() {
        sensorId = null;
        expiration = null;
    }
}
