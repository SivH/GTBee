package com.sivh.gtbee.web.rest;

import com.sivh.gtbee.GtBeeApp;

import com.sivh.gtbee.domain.GTBactivity;
import com.sivh.gtbee.repository.GTBactivityRepository;
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

import com.sivh.gtbee.domain.enumeration.Language;
/**
 * Test class for the GTBactivityResource REST controller.
 *
 * @see GTBactivityResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = GtBeeApp.class)
public class GTBactivityResourceIntTest {

    private static final String DEFAULT_ACTIVITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ACTIVITY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Instant DEFAULT_ACTIVITY_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ACTIVITY_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_COST = 1L;
    private static final Long UPDATED_COST = 2L;

    private static final Language DEFAULT_LANGUAGE = Language.ENGLISH;
    private static final Language UPDATED_LANGUAGE = Language.GERMAN;

    @Autowired
    private GTBactivityRepository gTBactivityRepository;

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

    private MockMvc restGTBactivityMockMvc;

    private GTBactivity gTBactivity;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GTBactivityResource gTBactivityResource = new GTBactivityResource(gTBactivityRepository);
        this.restGTBactivityMockMvc = MockMvcBuilders.standaloneSetup(gTBactivityResource)
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
    public static GTBactivity createEntity(EntityManager em) {
        GTBactivity gTBactivity = new GTBactivity()
            .activityName(DEFAULT_ACTIVITY_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .activityDate(DEFAULT_ACTIVITY_DATE)
            .cost(DEFAULT_COST)
            .language(DEFAULT_LANGUAGE);
        return gTBactivity;
    }

    @Before
    public void initTest() {
        gTBactivity = createEntity(em);
    }

    @Test
    @Transactional
    public void createGTBactivity() throws Exception {
        int databaseSizeBeforeCreate = gTBactivityRepository.findAll().size();

        // Create the GTBactivity
        restGTBactivityMockMvc.perform(post("/api/gt-bactivities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gTBactivity)))
            .andExpect(status().isCreated());

        // Validate the GTBactivity in the database
        List<GTBactivity> gTBactivityList = gTBactivityRepository.findAll();
        assertThat(gTBactivityList).hasSize(databaseSizeBeforeCreate + 1);
        GTBactivity testGTBactivity = gTBactivityList.get(gTBactivityList.size() - 1);
        assertThat(testGTBactivity.getActivityName()).isEqualTo(DEFAULT_ACTIVITY_NAME);
        assertThat(testGTBactivity.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testGTBactivity.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testGTBactivity.getActivityDate()).isEqualTo(DEFAULT_ACTIVITY_DATE);
        assertThat(testGTBactivity.getCost()).isEqualTo(DEFAULT_COST);
        assertThat(testGTBactivity.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
    }

    @Test
    @Transactional
    public void createGTBactivityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = gTBactivityRepository.findAll().size();

        // Create the GTBactivity with an existing ID
        gTBactivity.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGTBactivityMockMvc.perform(post("/api/gt-bactivities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gTBactivity)))
            .andExpect(status().isBadRequest());

        // Validate the GTBactivity in the database
        List<GTBactivity> gTBactivityList = gTBactivityRepository.findAll();
        assertThat(gTBactivityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllGTBactivities() throws Exception {
        // Initialize the database
        gTBactivityRepository.saveAndFlush(gTBactivity);

        // Get all the gTBactivityList
        restGTBactivityMockMvc.perform(get("/api/gt-bactivities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gTBactivity.getId().intValue())))
            .andExpect(jsonPath("$.[*].activityName").value(hasItem(DEFAULT_ACTIVITY_NAME.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].activityDate").value(hasItem(DEFAULT_ACTIVITY_DATE.toString())))
            .andExpect(jsonPath("$.[*].cost").value(hasItem(DEFAULT_COST.intValue())))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())));
    }
    
    @Test
    @Transactional
    public void getGTBactivity() throws Exception {
        // Initialize the database
        gTBactivityRepository.saveAndFlush(gTBactivity);

        // Get the gTBactivity
        restGTBactivityMockMvc.perform(get("/api/gt-bactivities/{id}", gTBactivity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(gTBactivity.getId().intValue()))
            .andExpect(jsonPath("$.activityName").value(DEFAULT_ACTIVITY_NAME.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER.toString()))
            .andExpect(jsonPath("$.activityDate").value(DEFAULT_ACTIVITY_DATE.toString()))
            .andExpect(jsonPath("$.cost").value(DEFAULT_COST.intValue()))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGTBactivity() throws Exception {
        // Get the gTBactivity
        restGTBactivityMockMvc.perform(get("/api/gt-bactivities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGTBactivity() throws Exception {
        // Initialize the database
        gTBactivityRepository.saveAndFlush(gTBactivity);

        int databaseSizeBeforeUpdate = gTBactivityRepository.findAll().size();

        // Update the gTBactivity
        GTBactivity updatedGTBactivity = gTBactivityRepository.findById(gTBactivity.getId()).get();
        // Disconnect from session so that the updates on updatedGTBactivity are not directly saved in db
        em.detach(updatedGTBactivity);
        updatedGTBactivity
            .activityName(UPDATED_ACTIVITY_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .activityDate(UPDATED_ACTIVITY_DATE)
            .cost(UPDATED_COST)
            .language(UPDATED_LANGUAGE);

        restGTBactivityMockMvc.perform(put("/api/gt-bactivities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGTBactivity)))
            .andExpect(status().isOk());

        // Validate the GTBactivity in the database
        List<GTBactivity> gTBactivityList = gTBactivityRepository.findAll();
        assertThat(gTBactivityList).hasSize(databaseSizeBeforeUpdate);
        GTBactivity testGTBactivity = gTBactivityList.get(gTBactivityList.size() - 1);
        assertThat(testGTBactivity.getActivityName()).isEqualTo(UPDATED_ACTIVITY_NAME);
        assertThat(testGTBactivity.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testGTBactivity.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testGTBactivity.getActivityDate()).isEqualTo(UPDATED_ACTIVITY_DATE);
        assertThat(testGTBactivity.getCost()).isEqualTo(UPDATED_COST);
        assertThat(testGTBactivity.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
    }

    @Test
    @Transactional
    public void updateNonExistingGTBactivity() throws Exception {
        int databaseSizeBeforeUpdate = gTBactivityRepository.findAll().size();

        // Create the GTBactivity

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGTBactivityMockMvc.perform(put("/api/gt-bactivities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gTBactivity)))
            .andExpect(status().isBadRequest());

        // Validate the GTBactivity in the database
        List<GTBactivity> gTBactivityList = gTBactivityRepository.findAll();
        assertThat(gTBactivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGTBactivity() throws Exception {
        // Initialize the database
        gTBactivityRepository.saveAndFlush(gTBactivity);

        int databaseSizeBeforeDelete = gTBactivityRepository.findAll().size();

        // Delete the gTBactivity
        restGTBactivityMockMvc.perform(delete("/api/gt-bactivities/{id}", gTBactivity.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<GTBactivity> gTBactivityList = gTBactivityRepository.findAll();
        assertThat(gTBactivityList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GTBactivity.class);
        GTBactivity gTBactivity1 = new GTBactivity();
        gTBactivity1.setId(1L);
        GTBactivity gTBactivity2 = new GTBactivity();
        gTBactivity2.setId(gTBactivity1.getId());
        assertThat(gTBactivity1).isEqualTo(gTBactivity2);
        gTBactivity2.setId(2L);
        assertThat(gTBactivity1).isNotEqualTo(gTBactivity2);
        gTBactivity1.setId(null);
        assertThat(gTBactivity1).isNotEqualTo(gTBactivity2);
    }
}
