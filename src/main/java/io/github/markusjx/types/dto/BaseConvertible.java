package io.github.markusjx.types.dto;

/**
 * Marks a data transfer object that it
 * can be converted to a base class.
 *
 * @param <T> the base class of the dto
 */
public interface BaseConvertible<T> {
    /**
     * Convert the dto to its base class
     *
     * @return the converted dto
     */
    T toBase();
}
