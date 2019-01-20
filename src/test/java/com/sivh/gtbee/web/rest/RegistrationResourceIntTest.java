package com.sivh.gtbee.web.rest;

import com.sivh.gtbee.GtBeeApp;

import com.sivh.gtbee.domain.Registration;
import com.sivh.gtbee.repository.RegistrationRepository;
import com.sivh.gtbee.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static com.sivh.gtbee.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the RegistrationResource REST controller.
 *
 * @see RegistrationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = GtBeeApp.class)
public class RegistrationResourceIntTest {

    private static final String DEFAULT_REGISTRATION_CODE = "AAAAAAAAAA";
    private static final String UPDATED_REGISTRATION_CODE = "BBBBBBBBBB";

    private static final Instant DEFAULT_REGISTRATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REGISTRATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restRegistrationMockMvc;

    private Registration registration;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RegistrationResource registrationResource = new RegistrationResource(registrationRepository);
        this.restRegistrationMockMvc = MockMvcBuilders.standaloneSetup(registrationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Registration createEntity(EntityManager em) {
        Registration registration = new Registration()
            .registrationCode(DEFAULT_REGISTRATION_CODE)
            .registrationDate(DEFAULT_REGISTRATION_DATE);
        return registration;
    }

    @Before
    public void initTest() {
        registration = createEntity(em);
    }

    @Test
    @Transactional
    public void createRegistration() throws Exception {
        int databaseSizeBeforeCreate = registrationRepository.findAll().size();

        // Create the Registration
        restRegistrationMockMvc.perform(post("/api/registrations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(registration)))
            .andExpect(status().isCreated());

        // Validate the Registration in the database
        List<Registration> registrationList = registrationRepository.findAll();
        assertThat(registrationList).hasSize(databaseSizeBeforeCreate + 1);
        Registration testRegistration = registrationList.get(registrationList.size() - 1);
        assertThat(testRegistration.getRegistrationCode()).isEqualTo(DEFAULT_REGISTRATION_CODE);
        assertThat(testRegistration.getRegistrationDate()).isEqualTo(DEFAULT_REGISTRATION_DATE);
    }

    @Test
    @Transactional
    public void createRegistrationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = registrationRepository.findAll().size();

        // Create the Registration with an existing ID
        registration.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegistrationMockMvc.perform(post("/api/registrations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(registration)))
            .andExpect(status().isBadRequest());

        // Validate the Registration in the database
        List<Registration> registrationList = registrationRepository.findAll();
        assertThat(registrationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllRegistrations() throws Exception {
        // Initialize the database
        registrationRepository.saveAndFlush(registration);

        // Get all the registrationList
        restRegistrationMockMvc.perform(get("/api/registrations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(registration.getId().intValue())))
            .andExpect(jsonPath("$.[*].registrationCode").value(hasItem(DEFAULT_REGISTRATION_CODE.toString())))
            .andExpect(jsonPath("$.[*].registrationDate").value(hasItem(DEFAULT_REGISTRATION_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getRegistration() throws Exception {
        // Initialize the database
        registrationRepository.saveAndFlush(registration);

        // Get the registration
        restRegistrationMockMvc.perform(get("/api/registrations/{id}", registration.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(registration.getId().intValue()))
            .andExpect(jsonPath("$.registrationCode").value(DEFAULT_REGISTRATION_CODE.toString()))
            .andExpect(jsonPath("$.registrationDate").value(DEFAULT_REGISTRATION_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRegistration() throws Exception {
        // Get the registration
        restRegistrationMockMvc.perform(get("/api/registrations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRegistration() throws Exception {
        // Initialize the database
        registrationRepository.saveAndFlush(registration);

        int databaseSizeBeforeUpdate = registrationRepository.findAll().size();

        // Update the registration
        Registration updatedRegistration = registrationRepository.findById(registration.getId()).get();
        // Disconnect from session so that the updates on updatedRegistration are not directly saved in db
        em.detach(updatedRegistration);
        updatedRegistration
            .registrationCode(UPDATED_REGISTRATION_CODE)
            .registrationDate(UPDATED_REGISTRATION_DATE);

        restRegistrationMockMvc.perform(put("/api/registrations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRegistration)))
            .andExpect(status().isOk());

        // Validate the Registration in the database
        List<Registration> registrationList = registrationRepository.findAll();
        assertThat(registrationList).hasSize(databaseSizeBeforeUpdate);
        Registration testRegistration = registrationList.get(registrationList.size() - 1);
        assertThat(testRegistration.getRegistrationCode()).isEqualTo(UPDATED_REGISTRATION_CODE);
        assertThat(testRegistration.getRegistrationDate()).isEqualTo(UPDATED_REGISTRATION_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingRegistration() throws Exception {
        int databaseSizeBeforeUpdate = registrationRepository.findAll().size();

        // Create the Registration

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistrationMockMvc.perform(put("/api/registrations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(registration)))
            .andExpect(status().isBadRequest());

        // Validate the Registration in the database
        List<Registration> registrationList = registrationRepository.findAll();
        assertThat(registrationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteRegistration() throws Exception {
        // Initialize the database
        registrationRepository.saveAndFlush(registration);

        int databaseSizeBeforeDelete = registrationRepository.findAll().size();

        // Get the registration
        restRegistrationMockMvc.perform(delete("/api/registrations/{id}", registration.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Registration> registrationList = registrationRepository.findAll();
        assertThat(registrationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Registration.class);
        Registration registration1 = new Registration();
        registration1.setId(1L);
        Registration registration2 = new Registration();
        registration2.setId(registration1.getId());
        assertThat(registration1).isEqualTo(registration2);
        registration2.setId(2L);
        assertThat(registration1).isNotEqualTo(registration2);
        registration1.setId(null);
        assertThat(registration1).isNotEqualTo(registration2);
    }
}
