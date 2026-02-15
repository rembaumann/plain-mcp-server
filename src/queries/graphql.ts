// Raw GraphQL queries for Plain API operations not covered by the SDK

export const SEARCH_THREADS_QUERY = `
  query searchThreads($query: String!, $first: Int, $after: String) {
    searchThreads(searchQuery: { query: $query }, first: $first, after: $after) {
      edges {
        node {
          id
          externalId
          title
          previewText
          status
          statusChangedAt {
            iso8601
          }
          priority
          assignee {
            id
            fullName
            email {
              email
            }
          }
          customer {
            id
            fullName
            shortName
            email {
              email
            }
          }
          labels {
            id
            labelType {
              name
            }
          }
          createdAt {
            iso8601
          }
          updatedAt {
            iso8601
          }
          createdBy {
            ... on UserActor { user { fullName } }
            ... on CustomerActor { customer { fullName } }
            ... on MachineUserActor { machineUser { fullName } }
            ... on SystemActor { systemId: system }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_THREAD_TIMELINE_QUERY = `
  query getThreadTimeline($threadId: ID!, $first: Int, $after: String) {
    thread(threadId: $threadId) {
      id
      externalId
      title
      previewText
      status
      statusChangedAt {
        iso8601
      }
      priority
      assignee {
        id
        fullName
        email {
          email
        }
      }
      customer {
        id
        fullName
        shortName
        email {
          email
        }
      }
      labels {
        id
        labelType {
          name
        }
      }
      createdAt {
        iso8601
      }
      updatedAt {
        iso8601
      }
      timelineEntries(first: $first, after: $after) {
        edges {
          node {
            id
            timestamp {
              iso8601
            }
            entry {
              __typename
              ... on ChatEntry {
                chatId: id
                text
              }
              ... on EmailEntry {
                emailId: id
                subject
                textContent
                to
                from {
                  email
                  name
                }
              }
              ... on NoteEntry {
                noteId: id
                text
              }
              ... on CustomTimelineEntry {
                customId: id
                title
                components {
                  __typename
                  ... on ComponentText {
                    text
                  }
                }
              }
              ... on StatusChangedEntry {
                previousStatus
                nextStatus
              }
              ... on AssignmentChangedEntry {
                previousAssignee {
                  fullName
                }
                nextAssignee {
                  fullName
                }
              }
              ... on PriorityChangedEntry {
                previousPriority
                nextPriority
              }
              ... on LabelsChangedEntry {
                previousLabels {
                  labelType {
                    name
                  }
                }
                nextLabels {
                  labelType {
                    name
                  }
                }
              }
            }
            actor {
              __typename
              ... on UserActor { user { fullName } }
              ... on CustomerActor { customer { fullName } }
              ... on MachineUserActor { machineUser { fullName } }
              ... on SystemActor { systemId: system }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const SEARCH_CUSTOMERS_QUERY = `
  query searchCustomers($query: String!, $first: Int, $after: String) {
    searchCustomers(searchQuery: { query: $query }, first: $first, after: $after) {
      edges {
        node {
          id
          fullName
          shortName
          email {
            email
            isVerified
          }
          externalId
          status
          createdAt {
            iso8601
          }
          updatedAt {
            iso8601
          }
          markedAsSpamAt {
            iso8601
          }
          company {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_THREAD_CLUSTERS_QUERY = `
  query getThreadClusters($timeRange: ThreadClusterTimeRange!) {
    threadClusters(timeRange: $timeRange) {
      clusters {
        id
        title
        description
        threadCount
        threads {
          id
          title
          previewText
          status
          priority
          createdAt {
            iso8601
          }
        }
      }
    }
  }
`;

export const TIME_SERIES_METRIC_QUERY = `
  query timeSeriesMetric($metricType: TimeSeriesMetricType!, $timeRange: MetricTimeRange!) {
    timeSeriesMetric(metricType: $metricType, timeRange: $timeRange) {
      dataPoints {
        timestamp {
          iso8601
        }
        value
      }
    }
  }
`;

export const SINGLE_VALUE_METRIC_QUERY = `
  query singleValueMetric($metricType: SingleValueMetricType!, $timeRange: MetricTimeRange!) {
    singleValueMetric(metricType: $metricType, timeRange: $timeRange) {
      value
    }
  }
`;
