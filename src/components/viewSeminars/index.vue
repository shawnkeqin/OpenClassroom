<template>
  <div>
    <h1>Search Courses</h1>
    <a-auto-complete
      :data-source="courseList"
      :filterOption="autoCompleteCourseTitle"
      style="width:100%; margin:10px 0px 20px 0px;"
      v-model="course_title"
    >
      <a-input-search
        placeholder="Search by course title"
        size="large"
        style=" height: 50px; .ant-input-lg { font-size: 18px} "
      />
    </a-auto-complete>

    <div>
      <a-row>
        <a-col :span="18">
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
            style="text-align: center"
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
          <a-card
            style="margin: 20px 20px 20px 0px; height: 800px; overflow: scroll"
          >
            <div v-if="$apollo.loading"><a-skeleton active /></div>
            <div v-else>
              <seminarCardRequest
                v-for="seminar in seminarLimited"
                :key="seminar.id"
                :seminar="seminar"
                class="seminar-item"
              >
              </seminarCardRequest>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-form>
              <h4 align="left">Filter by</h4>
              <p align="left">Date range</p>
              <a-range-picker
                style="width:auto"
                show-time
                :ranges="{
                  Today: [moment(TEST_DATE), moment(TEST_DATE)],
                  'Next 7 days': [
                    moment(TEST_DATE),
                    moment(TEST_DATE).add(1, 'weeks')
                  ],
                  'This month': [
                    moment(TEST_DATE).startOf('month'),
                    moment(TEST_DATE).endOf('month')
                  ]
                }"
                :format="utils.dateFormatStr"
                v-model="selectedDateRange"
              />
              <br />
              <!-- <p align="left">Timings</p> -->
              <p align="left">Start - End</p>
              <p align="left">
                <a-time-picker :open.sync="open2" v-model="start">
                  <a-button
                    slot="addon"
                    size="small"
                    type="primary"
                    @click="handleClose"
                  >
                    Ok
                  </a-button>
                </a-time-picker>
              </p>

              <p align="left">Instructor</p>
              <a-form-item>
                <a-select
                  v-model="faculty_name"
                  show-search
                  placeholder="Select or type instructor name"
                  allowClear
                >
                  <a-select-option
                    v-for="faculty in faculty_list"
                    :value="faculty.name.toString()"
                    :key="faculty.name.toString()"
                  >
                    {{ faculty.name.toString() }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <p align="left">Tags</p>
              <a-select
                v-model="selected_tags"
                mode="tags"
                style="width: 100%"
                placeholder="Select a tag"
              >
                <a-select-option
                  v-for="tag in tags_list"
                  :key="tag.label.toString()"
                >
                  {{ tag.label.toString() }}
                </a-select-option>
              </a-select>
            </a-form>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import utils from "@/utils";
import queries from "@/graphql/queries.gql";
import seminarCardRequest from "./seminarCardRequest";
const DEFAULT_PAGE_SIZE = 10;
const TEST_DATE = "08-12-2018";
export default {
  name: "viewSeminars",
  components: { seminarCardRequest },
  data() {
    return {
      TEST_DATE,
      seminar: [],
      DEFAULT_PAGE_SIZE,
      moment,
      utils,
      // form: this.$form.createForm(this, { name: "form" }),
      open2: false,
      course_title: "",
      faculty_name: undefined,
      selected_tags: [],
      selectedDateRange: [moment(TEST_DATE), moment(TEST_DATE).add(1, "weeks")],
      start: "",
      end: "",
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE
    };
  },
  apollo: {
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
      return utils.isNonEmptyArray(this.selected_tags)
        ? queries.searchSeminarsByFiltersWithTags
        : queries.searchSeminarsByFilters;
    },
    searchQueryVariables() {
      const course_title = this.course_title ? `%${this.course_title}%` : "%";
      const faculty_name = this.faculty_name || "%";
      const start_date = utils.isNonEmptyArray(this.selectedDateRange)
        ? this.selectedDateRange[0]
        : "2000-01-01";
      const end_date = utils.isNonEmptyArray(this.selectedDateRange)
        ? this.selectedDateRange[1]
        : "2050-01-01";
      return utils.isNonEmptyArray(this.selected_tags)
        ? {
            course_title,
            faculty_name,
            start_date,
            end_date,
            selected_tags: this.selected_tags
          }
        : {
            course_title,
            faculty_name,
            start_date,
            end_date
          };
    }
  },
  methods: {
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
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleClose() {
      this.open = false;
      this.open2 = false;
    }
  }
};
</script>

<style scoped>
.list-of-seminars {
  /* justify-content: center; */
  /* position: absolute; */
}
.seminar-item {
  margin: 0 10px;
}

.filter {
  position: fixed;
}
</style>
