package io.github.markusjx.types.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Schema(description = "An error data transfer object")
public class ErrorDTO {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(ErrorDTO.class);

    @Schema(description = "The error code", required = true, example = "404")
    public int errorCode;

    @Schema(description = "The error message", required = true, example = "A sensor with the given id does not exist")
    public String message;

    /**
     * Create an error data transfer object
     *
     * @param errorCode the http error code
     * @param message   the error message
     */
    public ErrorDTO(int errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    /**
     * Create an error data transfer object
     *
     * @param errorCode the http error code
     * @param message   the error message
     * @return the error dto as a json string
     */
    public static String from(int errorCode, String message) {
        final var error = new ErrorDTO(errorCode, message);
        try {
            return objectMapper.writeValueAsString(error);
        } catch (JsonProcessingException e) {
            logger.error("ErrorDTO json processing failed", e);
            return "{\"errorCode\": 500, \"message\": \"Internal Server Error\"}";
        }
    }
}
