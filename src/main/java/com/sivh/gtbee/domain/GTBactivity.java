package com.sivh.gtbee.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.sivh.gtbee.domain.enumeration.Language;

/**
 * The Employee entity.
 */
@ApiModel(description = "The Employee entity.")
@Entity
@Table(name = "gt_bactivity")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class GTBactivity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * The firstname attribute.
     */
    @ApiModelProperty(value = "The firstname attribute.")
    @Column(name = "activity_name")
    private String activityName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "activity_date")
    private Instant activityDate;

    @Column(name = "jhi_cost")
    private Long cost;

    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private Language language;

    @OneToMany(mappedBy = "gTBactivity")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Registration> registrations = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivityName() {
        return activityName;
    }

    public GTBactivity activityName(String activityName) {
        this.activityName = activityName;
        return this;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getEmail() {
        return email;
    }

    public GTBactivity email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public GTBactivity phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Instant getActivityDate() {
        return activityDate;
    }

    public GTBactivity activityDate(Instant activityDate) {
        this.activityDate = activityDate;
        return this;
    }

    public void setActivityDate(Instant activityDate) {
        this.activityDate = activityDate;
    }

    public Long getCost() {
        return cost;
    }

    public GTBactivity cost(Long cost) {
        this.cost = cost;
        return this;
    }

    public void setCost(Long cost) {
        this.cost = cost;
    }

    public Language getLanguage() {
        return language;
    }

    public GTBactivity language(Language language) {
        this.language = language;
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Set<Registration> getRegistrations() {
        return registrations;
    }

    public GTBactivity registrations(Set<Registration> registrations) {
        this.registrations = registrations;
        return this;
    }

    public GTBactivity addRegistration(Registration registration) {
        this.registrations.add(registration);
        registration.setGTBactivity(this);
        return this;
    }

    public GTBactivity removeRegistration(Registration registration) {
        this.registrations.remove(registration);
        registration.setGTBactivity(null);
        return this;
    }

    public void setRegistrations(Set<Registration> registrations) {
        this.registrations = registrations;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        GTBactivity gTBactivity = (GTBactivity) o;
        if (gTBactivity.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), gTBactivity.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "GTBactivity{" +
            "id=" + getId() +
            ", activityName='" + getActivityName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", activityDate='" + getActivityDate() + "'" +
            ", cost=" + getCost() +
            ", language='" + getLanguage() + "'" +
            "}";
    }
}
