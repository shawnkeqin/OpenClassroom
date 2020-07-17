<template>
  <div>
    <h1>Search Classes</h1>
    <div style="padding: 5px 0px 10px 0px">
      <suggestedSearchButton
        :id="SUGGESTED_SEARCH_IDS.SUGGESTED_SEARCH_1"
        label="CC classes (this week)"
        :selected="SUGGESTED_SEARCH_STATE.SUGGESTED_SEARCH_1"
        @select-toggled="onSuggestedSearchSelectToggle"
      />
      <!-- <suggestedSearchButton
        :id="SUGGESTED_SEARCH_IDS.SUGGESTED_SEARCH_2"
        label="Suggested search 2"
        :selected="SUGGESTED_SEARCH_STATE.SUGGESTED_SEARCH_2"
        @select-toggled="onSuggestedSearchSelectToggle"
      /> -->
    </div>
    <a-auto-complete
      :data-source="courseList"
      :filterOption="autoCompleteCourseTitle"
      style="width:100%; margin:10px 0px 20px 0px;"
      v-model="filters.course_title"
    >
      <a-input-search
        placeholder="Search by course title"
        size="large"
        style=" height: 50px; .ant-input-lg { font-size: 18px} "
      />
    </a-auto-complete>

    <div style="display: flex;">
      <div style="width: 80%;">
        <h4 align="left">
          Results
          <a-spin v-if="$apollo.loading">
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size: 26px; padding-left: 10px"
              spin
            />
          </a-spin>
        </h4>
        <a-pagination
          style="text-align: center; margin-bottom: 20px"
          @change="onPageChange"
          showSizeChanger
          :show-total="
            (total, range) => `${range[0]}-${range[1]} of ${total} items`
          "
          :total="allResultsCount"
          :defaultPageSize="DEFAULT_PAGE_SIZE"
          :current="page"
          :pageSizeOptions="['10', '25', '50', '100']"
        />
        <div
          style="display: flex; flex-direction: column; align-items: center;"
        >
          <template v-if="$apollo.loading"><a-skeleton active/></template>
          <template v-else>
            <SeminarRequestCard
              v-for="seminar in seminarLimited"
              :key="seminar.id"
              :seminar="seminar"
              :visit="seminar.visits[0]"
              :has_consented="loggedInUser.has_consented"
            />
          </template>
        </div>
      </div>
      <div style="margin: 20px">
        <a-card style="position: sticky; top: 50px;">
          <a-form>
            <h4 align="left">Filter by</h4>
            <h5 align="left">Date range</h5>
            <a-range-picker
              style="width:auto"
              show-time
              :ranges="{
                Today: [moment(), moment()],
                'This week': [moment().startOf('week'), moment().endOf('week')],
                'This month': [
                  moment().startOf('month'),
                  moment().endOf('month')
                ]
              }"
              :format="utils.dateFormatStr"
              v-model="filters.selectedDateRange"
              class="filter-field"
            />
            <h5 align="left">Time range</h5>
            <a-time-picker
              :minute-step="30"
              use12-hours
              format="h:mm A"
              v-model="filters.startTime"
              placeholder="Start"
              style="width:100%; margin-bottom: 5px"
              valueFormat="HH:mm"
            >
            </a-time-picker>
            <a-time-picker
              :minute-step="30"
              use12-hours
              format="h:mm A"
              v-model="filters.endTime"
              placeholder="End"
              style="width:100%;"
              valueFormat="HH:mm"
              class="filter-field"
            >
            </a-time-picker>
            <h5 align="left">Instructor</h5>
            <!-- <a-form-item> -->
            <a-select
              v-model="filters.facultyName"
              show-search
              placeholder="Select or type instructor name"
              allowClear
              class="filter-field"
            >
              <a-select-option
                v-for="faculty in faculty_list"
                :value="faculty.name.toString()"
                :key="faculty.name.toString()"
              >
                {{ faculty.name.toString() }}
              </a-select-option>
            </a-select>
            <!-- </a-form-item> -->
            <h5 align="left">Tags</h5>
            <div style="width:100%; display:flex">
              <a-select
                v-model="filters.selectedTags"
                mode="tags"
                placeholder="Select a tag"
                class="filter-field"
              >
                <a-select-option
                  v-for="tag in tags_list"
                  :key="tag.label.toString()"
                >
                  {{ tag.label.toString() }}
                </a-select-option>
              </a-select>
              <a-icon
                type="down"
                style="position:absolute; right:35px; margin-top: 10px; color:rgba(0, 0, 0, 0.25)"
              />
            </div>
            <a
              href="https://library.yale-nus.edu.sg/wp-content/uploads/2014/01/campus-map_Aug2015.jpg"
              target="_blank"
              >View campus map</a
            >
          </a-form>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import utils from "@/utils";
import queries from "@/graphql/queries.gql";
import SeminarRequestCard from "./SeminarRequestCard";
import suggestedSearchButton from "./suggestedSearchButton";
import _ from "lodash";
import store from "@/store";

const DEFAULT_PAGE_SIZE = 10;
const TEST_DATE = "2020-08-09";
const SUGGESTED_SEARCH_1 = "SUGGESTED_SEARCH_1";
const SUGGESTED_SEARCH_2 = "SUGGESTED_SEARCH_2";
const DEFAULT_FILTERS = {
  courseTitle: undefined,
  selectedDateRange: [],
  startTime: null,
  endTime: null,
  facultyName: undefined,
  selectedTags: []
};
const SUGGESTED_SEARCH_FILTERS = {
  [SUGGESTED_SEARCH_1]: {
    selectedDateRange: [
      moment(TEST_DATE).startOf("week"),
      moment(TEST_DATE).endOf("week")
    ],
    selectedTags: ["Common Curriculum"]
  },
  [SUGGESTED_SEARCH_2]: {}
};
export default {
  name: "viewSeminars",
  components: { SeminarRequestCard, suggestedSearchButton },
  data() {
    return {
      loggedInUser: {},
      TEST_DATE,
      seminar: [],
      DEFAULT_PAGE_SIZE,
      moment,
      utils,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      // Search filters
      filters: _.cloneDeep(DEFAULT_FILTERS),
      SUGGESTED_SEARCH_IDS: {
        SUGGESTED_SEARCH_1,
        SUGGESTED_SEARCH_2
      },
      SUGGESTED_SEARCH_STATE: {
        [SUGGESTED_SEARCH_1]: false,
        [SUGGESTED_SEARCH_2]: true
      },
      SUGGESTED_SEARCH_FILTERS: _.cloneDeep(SUGGESTED_SEARCH_FILTERS)
    };
  },
  apollo: {
    loggedInUser: {
      query: queries.getFacultyById,
      variables() {
        return {
          faculty_id: store.state.loggedInUser
        };
      },
      update: data => data.faculty_by_pk
    },
    courses: {
      query: queries.getCourseList,
      update: data => data.course
    },
    seminar: {
      query() {
        return this.searchQuery;
      },
      variables() {
        return this.searchQueryVariables;
      }
    },
    faculty_list: {
      query: queries.getFacultyList,
      update: data => data.faculty
    },
    tags_list: {
      query: queries.getTagsList,
      update: data => data.tag
    }
  },
  watch: {
    seminar() {
      this.page = 1;
    },
    filters: {
      handler(newFilters) {
        // Check if new filter still matches current suggested search, if any.
        _.entries(SUGGESTED_SEARCH_FILTERS).forEach(([key, suggested]) => {
          suggested = _.assign(_.cloneDeep(DEFAULT_FILTERS), suggested);
          if (
            this.SUGGESTED_SEARCH_STATE[key] === true &&
            _.isEqual(newFilters, suggested) == false
          ) {
            this.SUGGESTED_SEARCH_STATE[key] = false;
          }
        });
      },
      // This observes nested properties of filter.
      deep: true
    }
  },
  computed: {
    courseList() {
      return utils.isNonEmptyArray(this.courses)
        ? this.courses.map(c => c.title)
        : [];
    },
    allResultsCount() {
      return utils.isNonEmptyArray(this.seminar) ? this.seminar.length : 0;
    },
    seminarLimited() {
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      return utils.isNonEmptyArray(this.seminar)
        ? this.seminar.slice(start, end)
        : [];
    },
    searchQuery() {
      return utils.isNonEmptyArray(this.filters.selectedTags)
        ? queries.searchSeminarsByFiltersWithTags
        : queries.searchSeminarsByFilters;
    },
    searchQueryVariables() {
      const course_title = this.filters.course_title
        ? `%${this.filters.course_title}%`
        : "%";
      const faculty_name = this.filters.facultyName || "%";
      const start_date = utils.isNonEmptyArray(this.filters.selectedDateRange)
        ? this.filters.selectedDateRange[0]
        : "2000-01-01";
      const end_date = utils.isNonEmptyArray(this.filters.selectedDateRange)
        ? this.filters.selectedDateRange[1]
        : "2050-01-01";
      const start_time = this.filters.startTime || "00:00";
      const end_time = this.filters.endTime || "23:59";
      return utils.isNonEmptyArray(this.filters.selectedTags)
        ? {
            course_title,
            faculty_name,
            start_date,
            end_date,
            start_time,
            end_time,
            selected_tags: this.filters.selectedTags,
            visitor_id: store.state.loggedInUser,
            semester_code: process.env.VUE_APP_SEMESTER_CODE
          }
        : {
            course_title,
            faculty_name,
            start_date,
            end_date,
            start_time,
            end_time,
            visitor_id: store.state.loggedInUser,
            semester_code: process.env.VUE_APP_SEMESTER_CODE
          };
    }
  },
  methods: {
    // onManualFilterChange() {
    //   Object.keys(this.SUGGESTED_SEARCH_STATE).forEach(
    //     key => (this.SUGGESTED_SEARCH_STATE[key] = FALSE)
    //   );
    // },
    onSuggestedSearchSelectToggle(data) {
      // Update which button is selected.
      const new_button_state = {};
      Object.keys(this.SUGGESTED_SEARCH_STATE).forEach(key => {
        new_button_state[key] = false;
      });
      if (data.value === true) {
        new_button_state[data.id] = true;
      }
      this.SUGGESTED_SEARCH_STATE = new_button_state;
      // Update filter values
      const new_filters = { ...DEFAULT_FILTERS };
      if (data.value) {
        Object.assign(new_filters, SUGGESTED_SEARCH_FILTERS[data.id]);
      }
      this.filters = new_filters;
    },
    autoCompleteCourseTitle(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.pageSize = pageSize;
    },
    handleClose() {
      this.open = false;
      this.open2 = false;
    }
  }
};
</script>

<style scoped>
.filter {
  position: fixed;
}
.filter-field {
  margin-bottom: 20px;
}
.suggested-search-option {
  font-size: 30px;
}
.suggested-search-option .anticon-close {
  font-size: 30px;
}
</style>
