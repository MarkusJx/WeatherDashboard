package io.github.markusjx.repositories;

import io.github.markusjx.types.User;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.Optional;

@ApplicationScoped
public class UserRepo implements PanacheRepository<User> {
    @Inject
    EntityManager em;

    @Transactional
    public void addUser(User user) {
        this.persist(user);
    }

    public boolean userExists(User user) {
        return userEmailExists(user.getEmail());
    }

    public boolean userEmailExists(String email) {
        return em.createQuery("select count(u) from User as u where u.email = :email", Long.class)
                .setParameter("email", email)
                .getSingleResult() > 0;
    }

    public Optional<User> findByEmail(String email) {
        return this.find("email", email).firstResultOptional();
    }
}
