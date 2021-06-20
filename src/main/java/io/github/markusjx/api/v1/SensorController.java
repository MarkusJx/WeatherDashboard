package io.github.markusjx.api.v1;

import io.github.markusjx.repositories.SensorRepo;
import io.github.markusjx.types.Sensor;
import io.github.markusjx.types.dto.SensorDTO;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.stream.Collectors;

@Path("/api/v1/sensor")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SensorController {
    private static final Logger logger = LoggerFactory.getLogger(SensorController.class);
    @Inject
    SensorRepo repo;

    @GET
    @Path("{id}")
    @Operation(summary = "Get a sensor by its id")
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "The sensor was found", content = @Content(
                    schema = @Schema(implementation = Sensor.class, description = "The retrieved sensor")
            )),
            @APIResponse(responseCode = "404", description = "A sensor with the given id does not exist",
                    content = @Content
            )
    })
    @RolesAllowed({"user", "admin"})
    @SecurityRequirement(name = "jwt")
    public Response getSensor(@PathParam("id") Long id, @Context SecurityContext ctx) {
        var s = repo.getSensorById(id);
        if (s != null) {
            return Response.ok(s).build();
        } else {
            return Response.status(404).build();
        }
    }

    @POST
    @Operation(summary = "Register a new sensor")
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "The operation was successful", content = @Content(
                    schema = @Schema(implementation = Integer.class, description = "The id of the generated sensor")
            ))
    })
    @RolesAllowed({"user", "admin"})
    @SecurityRequirement(name = "jwt")
    public Response add(@Context SecurityContext ctx, SensorDTO s) {
        var sensor = s.toBase();
        repo.addSensor(sensor);
        logger.info("Registering sensor with id '{}' and name '{}' by user '{}'", sensor.id, sensor.name,
                ctx.getUserPrincipal().getName());
        return Response.ok(sensor.id).build();
    }

    @GET
    @Path("count")
    @Operation(summary = "Get the number of registered sensors")
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "The operation was successful", content = @Content(
                    schema = @Schema(implementation = Long.class, description = "The number of registered sensors")
            ))
    })
    public Response getNumSensors() {
        return Response.ok(repo.numSensors()).build();
    }

    @GET
    @Path("list")
    @Operation(summary = "List all registered sensors")
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "The registered sensors", content = @Content(
                    schema = @Schema(implementation = Sensor[].class, description = "The sensors")
            ))
    })
    public Response listSensors() {
        return Response.ok(repo.findAll().stream().collect(Collectors.toList())).build();
    }

    @DELETE
    @Path("{id}")
    @Operation(summary = "Delete a sensor")
    @APIResponses(value = {
            @APIResponse(responseCode = "204", description = "The sensor was deleted", content = @Content),
            @APIResponse(responseCode = "404", description = "A sensor with that id doesn't exist", content = @Content)
    })
    @RolesAllowed({"user", "admin"})
    @SecurityRequirement(name = "jwt")
    public Response removeSensor(@PathParam("id") Long id, @Context SecurityContext ctx) {
        var s = repo.getSensorById(id);

        if (s != null) {
            logger.info("Removing sensor with id '{}' by user '{}'", id, ctx.getUserPrincipal().getName());
            repo.removeSensor(s);
            return Response.noContent().build();
        } else {
            return Response.status(404).build();
        }
    }
}
