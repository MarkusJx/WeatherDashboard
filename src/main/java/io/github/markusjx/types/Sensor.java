package io.github.markusjx.types;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class Sensor implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String name;

    public Sensor() {
        id = null;
        name = null;
    }
}
