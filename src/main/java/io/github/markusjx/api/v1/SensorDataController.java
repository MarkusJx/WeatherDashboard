package io.github.markusjx.api.v1;

import io.github.markusjx.repositories.SensorDataRepo;
import io.github.markusjx.repositories.SensorRepo;
import io.github.markusjx.types.dto.SensorDataDTO;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.ParameterIn;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;
import java.util.stream.Collectors;

/**
 * A controller for receiving and showing sensor data
 */
@Path("/api/v1/data")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SensorDataController {
    /**
     * The sensor data repository
     */
    @Inject
    SensorDataRepo dataRepo;

    /**
     * The sensor repository
     */
    @Inject
    SensorRepo sensorRepo;

    /**
     * Submit sensor data.
     * Requires a jwt for authentication.
     *
     * @param id      the sensor id
     * @param ctx     the security context
     * @param dataDTO the sensor data
     * @return the response
     */
    @PUT
    @Path("{id}")
    @Operation(summary = "Submit new sensor data")
    @APIResponses(value = {
            @APIResponse(responseCode = "202", description = "The data was saved", content = @Content),
            @APIResponse(responseCode = "404", description = "A sensor with the given id does not exist",
                    content = @Content)
    })
    @RolesAllowed({"sensor", "admin"})
    @SecurityRequirement(name = "jwt")
    public Response submitData(@PathParam("id") Long id, @Context SecurityContext ctx, SensorDataDTO dataDTO) {
        final String name = ctx.getUserPrincipal().getName();

        var sensor = sensorRepo.getSensorById(id);
        if (sensor != null) {
            if (!sensor.name.equals(name)) {
                return Response.status(400, "The jwt was invalid").build();
            }

            var data = dataDTO.toBase();
            data.setSensor(sensor);

            dataRepo.persistData(data);
            return Response.accepted().build();
        } else {
            return Response.status(404).build();
        }
    }

    /**
     * Get some sensor data
     *
     * @param id     the id of the sensor to get data from
     * @param limit  the max number of values to get
     * @param offset the offset in the value list
     * @return the response data
     */
    @GET
    @Path("get/{id}")
    @Operation(description = "Get sensor data from a sensor")
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "The data was retrieved", content = @Content(
                    schema = @Schema(implementation = SensorDataDTO[].class, description = "The retrieved data")
            )),
            @APIResponse(responseCode = "404", description = "The sensor doesn't exist", content = @Content)
    })
    @PermitAll
    @Parameters(value = {
            @Parameter(name = "id", required = true, in = ParameterIn.PATH,
                    description = "The id of the sensor to get the data from",
                    schema = @Schema(implementation = Long.class, description = "The sensor's id", example = "1")
            ),
            @Parameter(name = "limit", in = ParameterIn.QUERY, description = "The max number of values to get",
                    schema = @Schema(implementation = Integer.class, description = "The number of values",
                            example = "10")
            ),
            @Parameter(name = "offset", in = ParameterIn.QUERY, description = "The offset in temperatures to get",
                    schema = @Schema(implementation = Integer.class, description = "The offset", example = "10")
            )
    })
    public Response getData(@PathParam("id") Long id,
                            @DefaultValue("-1") @QueryParam("limit") int limit,
                            @DefaultValue("-1") @QueryParam("offset") int offset) {
        var sensor = sensorRepo.findByIdOptional(id);
        if (sensor.isEmpty()) {
            return Response.status(404, "The sensor doesn't exist").build();
        }

        List<SensorDataDTO> data = dataRepo.getDataForSensor(sensor.get(), limit, offset)
                .stream()
                .map(SensorDataDTO::fromData)
                .collect(Collectors.toList());
        return Response.ok(data).build();
    }
}
