<template>
  <div style="width:60rem;">
    <h1>Search Classes</h1>
    <div style="padding: 5px 0px 10px 0px">
      <suggestedSearchButton
        :id="SUGGESTED_SEARCH_IDS.SUGGESTED_SEARCH_2"
        label="This Week: CC Lectures"
        :selected="SUGGESTED_SEARCH_STATE.SUGGESTED_SEARCH_2"
        @select-toggled="onSuggestedSearchSelectToggle"
      />
      <!-- <suggestedSearchButton
        :id="SUGGESTED_SEARCH_IDS.SUGGESTED_SEARCH_1"
        label="This Week: CC Classes"
        :selected="SUGGESTED_SEARCH_STATE.SUGGESTED_SEARCH_1"
        @select-toggled="onSuggestedSearchSelectToggle"
      /> -->
    </div>
    <a-auto-complete
      :data-source="courseList"
      :filterOption="autoCompleteCourseTitle"
      style="width:100%; margin:10px 0px 20px 0px;"
      v-model="filters.course_title"
      placeholder="Search by course title"
      class="search-bar"
    >
      <!-- <a-inpuvt-search
        placeholder="Search by course title"
        size="large"
        style=".ant-input-lg { font-size: 18px; } "
      /> -->
      <a-input>
        <a-icon slot="suffix" type="search" class="certain-category-icon" />
      </a-input>
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
          <template v-if="$apollo.loading"
            ><a-skeleton style="width: 35rem;" active
          /></template>
          <template v-else>
            <template v-if="seminarLimited.length">
              <SeminarVisitRequestCard
                v-for="seminar in seminarLimited"
                :key="seminar.id"
                :seminar="seminar"
                :visit="seminar.visits[0]"
                :has_consented="loggedInUser.has_consented"
              />
            </template>
            <template v-else>
              <div style="width: 35rem;">
                <a-card hoverable>
                  <p>
                    {{ `No results.` }}
                  </p>
                </a-card>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div style="margin: 20px 0 0 20px;">
        <a-card style="position: sticky; top: 20px; padding: 0.4rem;">
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
              :disabled-date="disabledDate"
              v-model="filters.selectedDateRange"
              class="filter-field"
            />
            <h5 align="left">Time range</h5>
            <div
              style="display: flex; flex-direction: row; justify-content: space-between;"
            >
              <a-time-picker
                :minute-step="30"
                use12-hours
                format="h:mm A"
                v-model="filters.startTime"
                placeholder="Start"
                valueFormat="HH:mm"
                class="filter-field"
              >
              </a-time-picker>
              <a-time-picker
                :minute-step="30"
                use12-hours
                format="h:mm A"
                v-model="filters.endTime"
                placeholder="End"
                valueFormat="HH:mm"
                class="filter-field"
              >
              </a-time-picker>
            </div>
            <h5 align="left">Instructor</h5>
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
            <div style="margin-bottom: 20px;">
              <h5 align="left">Teaching mode</h5>
              <a-checkbox-group
                class="teaching-mode-filter"
                v-model="filters.checkedTeachingModes"
              >
                <a-checkbox
                  class="checkbox-filter"
                  :value="value"
                  v-for="{
                    value,
                    label
                  } in constants.TEACHING_MODE_CHECKBOX_OPTIONS"
                  v-bind:key="value"
                  >{{ label }}</a-checkbox
                >
              </a-checkbox-group>
            </div>
            <div>
              <h5 align="left">Additional filters</h5>
              <div>
                <a-checkbox
                  v-model="filters.lecturesOnly"
                  @change="checkedLecturesOnly"
                  class="checkbox-filter"
                  >Show CC lectures only</a-checkbox
                >
                <a-checkbox
                  v-model="filters.openOnly"
                  @change="handleCheckOpenOnly"
                  class="checkbox-filter"
                  >Show only open classes</a-checkbox
                >
              </div>
            </div>
            <div style="padding-top: 30px;">
              <a @click="mapVisible = true" href="#">
                View campus map
              </a>
            </div>
            <a-modal
              title="Campus map"
              :visible="mapVisible"
              @cancel="mapVisible = false"
              width="60vw"
              :footer="null"
            >
              <img
                src="https://library.yale-nus.edu.sg/wp-content/uploads/2014/01/campus-map_Aug2015.jpg"
                width="100%"
              />
            </a-modal>
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
import SeminarVisitRequestCard from "@/components/SeminarVisitRequestCard";
import suggestedSearchButton from "./suggestedSearchButton";
import _ from "lodash";
import store from "@/store";
import constants from "@/utils/constants";

const DEFAULT_PAGE_SIZE = 10;
const TEST_DATE = "2020-08-10";
const SUGGESTED_SEARCH_1 = "SUGGESTED_SEARCH_1";
const SUGGESTED_SEARCH_2 = "SUGGESTED_SEARCH_2";
const DEFAULT_FILTERS = {
  courseTitle: undefined,
  selectedDateRange: [moment(TEST_DATE), moment(TEST_DATE).add(7, "d")],
  startTime: null,
  endTime: null,
  facultyName: undefined,
  selectedTags: [],
  checkedTeachingModes: [],
  lecturesOnly: false,
  openOnly: false
};
const SUGGESTED_SEARCH_FILTERS = {
  [SUGGESTED_SEARCH_1]: {
    // selectedDateRange: [
    //   moment(TEST_DATE).startOf("week"),
    //   moment(TEST_DATE).endOf("week")
    // ],
    selectedTags: ["Common Curriculum"]
  },
  [SUGGESTED_SEARCH_2]: {
    // selectedDateRange: [
    //   moment(TEST_DATE).startOf("week"),
    //   moment(TEST_DATE).endOf("week")
    // ],
    lecturesOnly: true
  }
};

export default {
  name: "viewSeminars",
  components: {
    // SeminarRequestCard,
    SeminarVisitRequestCard,
    suggestedSearchButton
  },
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
      // Search filters, default plus initial filter.
      filters: _.assign(
        _.cloneDeep(DEFAULT_FILTERS),
        SUGGESTED_SEARCH_FILTERS.SUGGESTED_SEARCH_2
      ),
      SUGGESTED_SEARCH_IDS: {
        SUGGESTED_SEARCH_1,
        SUGGESTED_SEARCH_2
      },
      SUGGESTED_SEARCH_STATE: {
        [SUGGESTED_SEARCH_1]: false,
        [SUGGESTED_SEARCH_2]: true
      },
      SUGGESTED_SEARCH_FILTERS: _.cloneDeep(SUGGESTED_SEARCH_FILTERS),
      constants,
      mapVisible: false
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
      update: data => data.faculty_by_pk,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    courses: {
      query: queries.getCourseList,
      variables: { semester_code: process.env.VUE_APP_SEMESTER_CODE },
      update: data => data.course,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    seminar: {
      query() {
        return this.searchQuery;
      },
      variables() {
        return this.searchQueryVariables;
      },
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    faculty_list: {
      query: queries.getFacultyList,
      update: data => data.faculty,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    tags_list: {
      query: queries.getTagsList,
      update: data => data.tag,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    }
  },
  watch: {
    // seminar() {
    //   this.page = 1;
    // },
    searchQuery() {
      this.page = 1;
    },
    searchQueryVariables() {
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
            // this.SUGGESTED_SEARCH_STATE[key] = false;
            this.SUGGESTED_SEARCH_STATE = _.assign(
              _.cloneDeep(this.SUGGESTED_SEARCH_STATE),
              { [key]: false }
            );
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
      console.log(this.filters.openOnly);
      return utils.isNonEmptyArray(this.filters.selectedTags)
        ? this.filters.openOnly
          ? queries.searchOpenSeminarsByFiltersWithTags
          : queries.searchSeminarsByFiltersWithTags
        : this.filters.openOnly
        ? queries.searchOpenSeminarsByFilters
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
      // Default is none checked, but that means include all. If there is one or more specific values selected, then use those values.
      const teaching_modes =
        !this.filters.checkedTeachingModes ||
        this.filters.checkedTeachingModes.length == 0
          ? constants.TEACHING_MODE_LABELS
          : this.filters.checkedTeachingModes;
      const include_cc_lectures = this.filters.lecturesOnly ? "CC" : "%";
      const queryVars = {
        course_title,
        faculty_name,
        start_date,
        end_date,
        start_time,
        end_time,
        visitor_id: store.state.loggedInUser,
        semester_code: process.env.VUE_APP_SEMESTER_CODE,
        teaching_modes,
        include_cc_lectures
      };
      if (utils.isNonEmptyArray(this.filters.selectedTags)) {
        queryVars.selected_tags = this.filters.selected_tags;
      }
      return queryVars;
    }
  },
  methods: {
    // onManualFilterChange() {
    //   Object.keys(this.SUGGESTED_SEARCH_STATE).forEach(
    //     key => (this.SUGGESTED_SEARCH_STATE[key] = FALSE)
    //   );
    // },;
    handleCheckOpenOnly(val) {
      console.log(val);
      console.log(this.filters.openOnly);
    },
    checkedLecturesOnly(data) {
      console.log(data.target.checked);
    },
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
    },
    disabledDate(cur) {
      return cur < moment().startOf("day");
    }
  }
};
</script>

<style scoped>
.search-bar >>> .ant-input {
  font-size: 1rem;
  padding: 1.2rem;
}
.search-bar >>> .ant-select-selection__rendered {
  height: 2.4rem;
}
.filter {
  position: fixed;
}
.filter-field {
  margin-bottom: 20px;
}
.teaching-mode-filter {
  display: block;
}
.checkbox-filter {
  display: block;
  color: rgba(0, 0, 0, 0.54);
  margin-left: 0px;
}
</style>;
