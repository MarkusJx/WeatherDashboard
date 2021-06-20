package io.github.markusjx.api.v1;

import io.github.markusjx.repositories.SensorRepo;
import io.github.markusjx.repositories.UserRepo;
import io.github.markusjx.types.dto.AuthSensorDTO;
import io.github.markusjx.types.dto.AuthUserDTO;
import io.github.markusjx.types.dto.UserDTO;
import io.smallrye.jwt.auth.principal.JWTParser;
import io.smallrye.jwt.auth.principal.ParseException;
import io.smallrye.jwt.build.Jwt;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;

import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.Serializable;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Path("/api/v1/auth")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@SecurityScheme(bearerFormat = "jwt", securitySchemeName = "jwt", type = SecuritySchemeType.HTTP, scheme = "bearer")
public class AuthController implements Serializable {
    private static final String AUTH_COOKIE = "authentication";
    private static final String SES_COOKIE = "session";
    private static final String ISSUER = "web_weather";
    @Inject
    SensorRepo sensorRepo;
    @Inject
    UserRepo userRepo;
    @Inject
    JWTParser parser;

    @POST
    @Path("refreshTokens")
    @Produces(MediaType.TEXT_PLAIN)
    @Operation(description = "Refresh all tokens")
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "The operation was successful", content = @Content(
                    schema = @Schema(implementation = String.class, description = "The new auth token")
            )),
            @APIResponse(responseCode = "400", description = "The request was invalid", content = @Content),
            @APIResponse(responseCode = "401", description = "The user is not authorized to access this",
                    content = @Content)
    })
    public Response refreshTokens(@CookieParam(SES_COOKIE) String session, @CookieParam(AUTH_COOKIE) String persistent) {
        JsonWebToken sessionToken = null;
        JsonWebToken persistentToken = null;
        if (session != null) {
            try {
                sessionToken = parser.parse(session);
            } catch (ParseException ignored) {
                // Ignored
            }
        }

        if (persistent != null) {
            try {
                persistentToken = parser.parse(persistent);
            } catch (ParseException ignored) {
                // Ignored
            }
        }

        if (persistentToken == null && sessionToken == null) {
            return Response
                    .status(401, "No cookies are set")
                    .cookie(removeCookie(SES_COOKIE))
                    .cookie(removeCookie(AUTH_COOKIE))
                    .build();
        }

        if (persistentToken != null && sessionToken != null && !persistentToken.getSubject().equals(sessionToken.getSubject())) {
            return Response
                    .status(400, "The subjects did not match")
                    .cookie(removeCookie(SES_COOKIE))
                    .cookie(removeCookie(AUTH_COOKIE))
                    .build();
        }

        final String email = sessionToken != null ? sessionToken.getSubject() : persistentToken.getSubject();
        var user = userRepo.findByEmail(email);
        if (user.isEmpty()) {
            return Response
                    .status(401, "The user doesn't exist")
                    .cookie(removeCookie(SES_COOKIE))
                    .cookie(removeCookie(AUTH_COOKIE))
                    .build();
        }

        return generateTokens(email, user.get().getRole(), persistentToken != null);
    }

    @POST
    @Path("authSensor")
    @RolesAllowed({"user", "admin"})
    @Operation(description = "Get an auth token for a sensor")
    @Produces(MediaType.TEXT_PLAIN)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "The operation was successful", content = @Content(
                    schema = @Schema(implementation = String.class)
            )),
            @APIResponse(responseCode = "400", description = "The request was invalid", content = @Content),
            @APIResponse(responseCode = "401", description = "The user is not authorized to access this",
                    content = @Content)
    })
    @SecurityRequirement(name = "jwt")
    public Response getSensorToken(@Context SecurityContext ctx, AuthSensorDTO data) {
        if (data.sensorId == null) {
            return Response.status(400, "The 'sensorId' parameter must not be null").build();
        }

        var sensor = sensorRepo.getSensorById(data.sensorId);
        if (sensor == null) {
            return Response.status(400, "A sensor with that id doesn't exist").build();
        }

        var builder = Jwt.issuer(ISSUER)
                .issuedAt(Instant.now())
                .groups("sensor")
                .upn(sensor.name)
                .subject(data.sensorId.toString());

        if (data.expiration != null) {
            builder.expiresAt(data.expiration);
        }

        return Response.ok(builder.sign()).build();
    }

    private NewCookie createJwtCookie(String jwt, String name, Date expiration) {
        return new NewCookie(
                name,
                jwt,
                "/",
                "",
                1,
                "",
                -1,
                expiration,
                false,
                true
        );
    }

    private NewCookie removeCookie(String name) {
        return new NewCookie(name, null, "/", "", 1, "", -1, Date.from(Instant.now()), false, true);
    }

    private Response generateTokens(String email, String role, boolean keepSignedIn) {
        var expiration = Instant.now().plus(7, ChronoUnit.DAYS);
        var jwt = Jwt.issuer(ISSUER)
                .subject(email)
                .expiresAt(expiration)
                .issuedAt(Instant.now())
                .groups(role)
                .sign();

        var sesJwt = Jwt.issuer(ISSUER)
                .subject(email)
                .expiresAt(Instant.now().plus(1, ChronoUnit.DAYS))
                .issuedAt(Instant.now())
                .groups(role)
                .sign();

        var resJwt = Jwt.issuer(ISSUER)
                .subject(email)
                .expiresAt(Instant.now().plus(5, ChronoUnit.MINUTES))
                .issuedAt(Instant.now())
                .groups(role)
                .sign();

        var res = Response
                .ok(resJwt)
                .cookie(createJwtCookie(sesJwt, SES_COOKIE, null));

        if (keepSignedIn) {
            res.cookie(createJwtCookie(jwt, AUTH_COOKIE, Date.from(expiration)));
        } else {
            res.cookie(removeCookie(AUTH_COOKIE));
        }

        return res.build();
    }

    @POST
    @Path("authUser")
    @Produces(MediaType.TEXT_PLAIN)
    @Operation(description = "Authenticate a user")
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "The user was signed in", content = @Content(
                    schema = @Schema(implementation = String.class)
            )),
            @APIResponse(responseCode = "400", description = "The request was invalid", content = @Content),
            @APIResponse(responseCode = "401", description = "The user's email/password was invalid", content = @Content)
    })
    public Response authUser(AuthUserDTO user) throws GeneralSecurityException {
        if (user.email == null || user.password == null) {
            return Response.status(400, "The email or password was null").build();
        }

        var userOptional = userRepo.findByEmail(user.email);
        if (userOptional.isEmpty()) {
            return Response.status(401, "Invalid credentials").build();
        }

        var u = userOptional.get();
        if (!u.verifyPassword(user.password)) {
            return Response.status(401, "Invalid credentials").build();
        } else {
            return generateTokens(user.email, u.getRole(), user.keepSignedIn);
        }
    }

    @POST
    @Path("registerUser")
    @Operation(description = "Register a new user")
    @APIResponses(value = {
            @APIResponse(responseCode = "204", description = "The user was registered", content = @Content),
            @APIResponse(responseCode = "400", description = "The request was invalid", content = @Content)
    })
    public Response registerUser(UserDTO userDto) {
        if (!userDto.ok()) {
            return Response.status(400, "The request was invalid").build();
        }

        var user = userDto.toBase();
        if (userRepo.userExists(user)) {
            return Response.status(400, "A user with that email already exists").build();
        }

        userRepo.addUser(user);
        return Response.noContent().build();
    }

    @GET
    @Path("logout")
    @Operation(description = "Log out the current user by deleting the session cookies")
    @APIResponses(value = {
            @APIResponse(responseCode = "204", description = "The user was logged out", content = @Content),
            @APIResponse(responseCode = "401", description = "No user is logged in", content = @Content)
    })
    public Response logout(@CookieParam(SES_COOKIE) String session, @CookieParam(AUTH_COOKIE) String auth) {
        if (session == null && auth == null) {
            return Response.status(401, "No user is logged in").build();
        }

        return Response
                .noContent()
                .cookie(removeCookie(SES_COOKIE))
                .cookie(removeCookie(AUTH_COOKIE))
                .build();
    }
}
