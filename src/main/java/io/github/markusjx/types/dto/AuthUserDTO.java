package io.github.markusjx.types.dto;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

public class AuthUserDTO {
    @Schema(description = "The users email address", required = true, minLength = 3, example = "email@email.com")
    public final String email;

    @Schema(description = "The users password", required = true, minLength = 8, example = "Password")
    public final String password;

    @Schema(description = "Whether to keep the user signed in", required = true, example = "false")
    public final boolean keepSignedIn;

    public AuthUserDTO() {
        email = null;
        password = null;
        keepSignedIn = false;
    }
}
