package io.github.markusjx.types;

import io.quarkus.security.jpa.Password;
import io.quarkus.security.jpa.Roles;
import io.quarkus.security.jpa.UserDefinition;
import io.quarkus.security.jpa.Username;
import org.wildfly.security.password.PasswordFactory;
import org.wildfly.security.password.interfaces.BCryptPassword;
import org.wildfly.security.password.util.ModularCrypt;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Objects;

/**
 * A user
 */
@Entity
@UserDefinition
public class User implements Serializable {
    /**
     * The id of the user.
     * Will be generated on user creation.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * The first name of the user
     */
    @Column(nullable = false)
    private String firstName;

    /**
     * The last name of the user
     */
    @Column(nullable = false)
    private String lastName;

    /**
     * The email of the user
     */
    @Id
    @Username
    @Column(nullable = false)
    private String email;

    /**
     * The user's password.
     * Will be hashed using bcrypt.
     */
    @Password
    @Column(nullable = false)
    private String password;

    /**
     * The role of the user
     */
    @Column
    @Roles
    private String role;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    /**
     * Verify the password of the user
     *
     * @param password the password to verify against the stored password
     * @return true if the given password matches the stored password
     * @throws InvalidKeySpecException  if the given password is not supported or could be decoded
     * @throws NoSuchAlgorithmException if the given algorithm has no available implementations
     * @throws InvalidKeyException      if the stored password is not supported by the bcrypt algorithm
     */
    public boolean verifyPassword(String password) throws InvalidKeySpecException, NoSuchAlgorithmException, InvalidKeyException {
        // convert encrypted password string to a password key
        var rawPassword = ModularCrypt.decode(this.password);

        // create the password factory based on the bcrypt algorithm
        var factory = PasswordFactory.getInstance(BCryptPassword.ALGORITHM_BCRYPT);

        // create encrypted password based on stored string
        BCryptPassword restored = (BCryptPassword) factory.translate(rawPassword);

        // verify restored password against original
        return factory.verify(restored, password.toCharArray());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        var user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(firstName, user.firstName) &&
                Objects.equals(lastName, user.lastName) &&
                Objects.equals(email, user.email) &&
                Objects.equals(password, user.password) &&
                Objects.equals(role, user.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, email, password, role);
    }
}
