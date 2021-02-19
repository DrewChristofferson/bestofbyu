/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSchool = /* GraphQL */ `
  query GetSchool($id: ID!) {
    getSchool(id: $id) {
      id
      name
      departments {
        items {
          id
          name
          schoolID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listSchools = /* GraphQL */ `
  query ListSchools(
    $id: ID
    $filter: ModelSchoolFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listSchools(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        departments {
          items {
            id
            name
            professors {
              items { 
                id
                name
                title
                score
              }
              nextToken
            }
            courses {
              items {
                id
                name
                createdAt
                updatedAt
              }
              nextToken
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDepartment = /* GraphQL */ `
  query GetDepartment($id: ID!) {
    getDepartment(id: $id) {
      id
      name
      schoolID
      school {
        id
        name
        departments {
          nextToken
        }
        createdAt
        updatedAt
      }
      professors {
        items {
          id
          name
          title
          departmentID
          imgsrc
          score
          createdAt
          updatedAt
        }
        nextToken
      }
      courses {
        items {
          id
          name
          code
          numCredits
          departmentID
          imgsrc
          description
          score
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listDepartments = /* GraphQL */ `
  query ListDepartments(
    $filter: ModelDepartmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDepartments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        schoolID
        school {
          id
          name
          createdAt
          updatedAt
        }
        professors {
          items {
            id
            name
            title
            score
            department {
              name
              school {
                name
              }
            }
          }
          nextToken
        }
        courses {
          items {
            id
            name
            numCredits
            score
            description
            department {
              name
              school {
                name
              }
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProfessor = /* GraphQL */ `
  query GetProfessor($id: ID!) {
    getProfessor(id: $id) {
      id
      name
      title
      departmentID
      department {
        id
        name
        schoolID
        school {
          id
          name
          createdAt
          updatedAt
        }
        professors {
          nextToken
        }
        courses {
          nextToken
        }
        createdAt
        updatedAt
      }
      imgsrc
      score
      comments {
        items {
          id
          professorID
          content
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listProfessors = /* GraphQL */ `
  query ListProfessors(
    $filter: ModelProfessorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProfessors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        title
        departmentID
        department {
          id
          name
          schoolID
          createdAt
          updatedAt
        }
        imgsrc
        score
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      name
      code
      numCredits
      departmentID
      department {
        id
        name
        schoolID
        school {
          id
          name
          createdAt
          updatedAt
        }
        professors {
          nextToken
        }
        courses {
          nextToken
        }
        createdAt
        updatedAt
      }
      imgsrc
      description
      score
      createdAt
      updatedAt
    }
  }
`;
export const listCourses = /* GraphQL */ `
  query ListCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        code
        numCredits
        departmentID
        department {
          id
          name
          schoolID
          createdAt
          updatedAt
        }
        imgsrc
        description
        score
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRating = /* GraphQL */ `
  query GetRating($id: ID!) {
    getRating(id: $id) {
      id
      userID
      contentID
      ratingType
      createdAt
      updatedAt
    }
  }
`;
export const listRatings = /* GraphQL */ `
  query ListRatings(
    $filter: ModelRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRatings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        contentID
        ratingType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProfessorComment = /* GraphQL */ `
  query GetProfessorComment($id: ID!) {
    getProfessorComment(id: $id) {
      id
      professorID
      content
      createdAt
      updatedAt
    }
  }
`;
export const listProfessorComments = /* GraphQL */ `
  query ListProfessorComments(
    $filter: ModelProfessorCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProfessorComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        professorID
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const ratingsByUserAndContent = /* GraphQL */ `
  query RatingsByUserAndContent(
    $userID: String
    $contentID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ratingsByUserAndContent(
      userID: $userID
      contentID: $contentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        contentID
        ratingType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
