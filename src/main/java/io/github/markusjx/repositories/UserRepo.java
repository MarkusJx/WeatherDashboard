package io.github.markusjx.repositories;

import io.github.markusjx.types.User;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.Optional;

/**
 * The user repository
 */
@ApplicationScoped
public class UserRepo implements PanacheRepository<User> {
    /**
     * The entity manager
     */
    @Inject
    EntityManager em;

    /**
     * Add a new user
     *
     * @param user the user to persist
     */
    @Transactional
    public void addUser(User user) {
        this.persist(user);
    }

    /**
     * Check if a user exists
     *
     * @param user the user to check
     * @return true if a user with that email exists
     */
    public boolean userExists(User user) {
        return userEmailExists(user.getEmail());
    }

    /**
     * Check if an email exists
     *
     * @param email the email to check
     * @return true if a user with the id exists
     */
    public boolean userEmailExists(String email) {
        return em.createQuery("select count(u) from User as u where u.email = :email", Long.class)
                .setParameter("email", email)
                .getSingleResult() > 0;
    }

    /**
     * Find a user by their email address
     *
     * @param email the email to search for
     * @return the user
     */
    public Optional<User> findByEmail(String email) {
        return this.find("email", email).firstResultOptional();
    }
}
