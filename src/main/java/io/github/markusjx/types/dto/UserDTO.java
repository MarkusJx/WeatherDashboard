package io.github.markusjx.types.dto;

import io.github.markusjx.types.User;
import io.quarkus.elytron.security.common.BcryptUtil;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public class UserDTO implements BaseConvertible<User> {
    @Schema(description = "The users first name", example = "Some", required = true)
    public final String firstName;

    @Schema(description = "The users last name", example = "Dude", required = true)
    public final String lastName;

    @Schema(description = "The users email", example = "email@email.com", required = true)
    public final String email;

    @Schema(description = "The users password", example = "Password", required = true)
    public final String password;

    public UserDTO() {
        firstName = null;
        lastName = null;
        email = null;
        password = null;
    }

    public boolean ok() {
        return firstName != null && lastName != null && email != null && password != null;
    }

    @Override
    public User toBase() {
        var u = new User();
        u.setId(null);
        u.setFirstName(this.firstName);
        u.setLastName(this.lastName);
        u.setEmail(this.email);
        u.setRole("user");
        if (this.password != null) {
            u.setPassword(BcryptUtil.bcryptHash(this.password));
        } else {
            u.setPassword(null);
        }
        return u;
    }
}
