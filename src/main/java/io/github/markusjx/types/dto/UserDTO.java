package io.github.markusjx.types.dto;

import io.github.markusjx.types.User;
import io.quarkus.elytron.security.common.BcryptUtil;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "A user data transfer object")
public class UserDTO implements BaseConvertible<User> {
    @Schema(description = "The users first name", example = "Some", required = true)
    public String firstName;

    @Schema(description = "The users last name", example = "Dude", required = true)
    public String lastName;

    @Schema(description = "The users email", example = "email@email.com", required = true)
    public String email;

    @Schema(description = "The users password", example = "Password", required = true)
    public String password;

    public UserDTO() {
        firstName = null;
        lastName = null;
        email = null;
        password = null;
    }

    /**
     * Check if the data in this dto is all set
     *
     * @return true if all required data is set
     */
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
