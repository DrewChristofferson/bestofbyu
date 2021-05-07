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
            imgsrc
            classes {
              items {
                id
                professorID
                courseID
                createdAt
                updatedAt
                course {
                  id
                  name
                  code
                  score
                  department {
                    id
                    name
                    school {
                      id
                      name
                    }
                  }
                }
              }
              nextToken
            }
            department {
              id
              name
              school {
                id
                name
              }
            }
          }
          nextToken
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
      classes {
        items {
          id
          professorID
          courseID
          createdAt
          updatedAt
          course {
            id
            name
            code
            score
            department {
              id
              name
              school {
                id
                name
              }
            }
          }
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
          school {
            id
            name
          }
          createdAt
          updatedAt
        }
        imgsrc
        score
        comments {
          nextToken
        }
        classes {
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
    name
    numCredits
    score
    code
    isGeneral
    imgsrc
    id
    generalReqID
    description
    department {
      id
      name
      school {
        id
        name
      }
    }
    classes {
      items {
        id
        courseID
        professor {
          name
          id
          score
          title
          department {
            name
            school {
              name
            }
          }
        }
      }
    }
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
          school {
            id
            name
          }
          createdAt
          updatedAt
        }
        imgsrc
        description
        score
        type
        isGeneral
        generalReqID
        classes {
          items {
            id
            professorID
            courseID
            createdAt
            updatedAt
            professor {
              id
              name
              title
              score
              department {
                name
              }
            }
          }
          nextToken
        }
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
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      name
      description
      numRatings
      numCategoryItems
      imgsrc
      createdBy
      subCategoryOptions
      customFields 
      items {
        items {
          id
          categoryID
          name
          imgsrc
          description
          content
          score
          createdBy
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
export const listCategorys = /* GraphQL */ `
  query ListCategorys(
    $id: ID
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCategorys(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        description
        numRatings
        numCategoryItems
        imgsrc
        createdBy
        items {
          items {
            id
            name
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCategoryItem = /* GraphQL */ `
  query GetCategoryItem($id: ID!) {
    getCategoryItem(id: $id) {
      id
      categoryID
      category {
        id
        name
        description
        numRatings
        numCategoryItems
        imgsrc
        createdBy
        items {
          nextToken
        }
        createdAt
        updatedAt
      }
      name
      imgsrc
      description
      content
      score
      createdBy
      SubCategory
      customFields {
        key
        value
      }
      createdAt
      updatedAt
    }
  }
`;
export const listCategoryItems = /* GraphQL */ `
  query ListCategoryItems(
    $filter: ModelCategoryItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategoryItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        categoryID
        category {
          id
          name
          description
          numRatings
          numCategoryItems
          imgsrc
          createdBy
          createdAt
          updatedAt
        }
        name
        imgsrc
        description
        content
        score
        createdBy
        SubCategory
        customFields {
          key
          value
        }
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
export const coursesByScore = /* GraphQL */ `
  query CoursesByScore(
    $type: String
    $score: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    coursesByScore(
      type: $type
      score: $score
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
          school {
            id
            name
          }
          createdAt
          updatedAt
        }
        imgsrc
        description
        score
        type
        isGeneral
        generalReqID
        classes {
          items {
            id
            professorID
            courseID
            createdAt
            updatedAt
            professor {
              id
              name
              title
              score
              department {
                name
              }
            }
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const coursesByDeptID = /* GraphQL */ `
  query CoursesByDeptID(
    $type: String
    $departmentID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    coursesByDeptID(
      type: $type
      departmentID: $departmentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
          school {
            id
            name
          }
          createdAt
          updatedAt
        }
        imgsrc
        description
        score
        type
        isGeneral
        generalReqID
        classes {
          items {
            id
            professorID
            courseID
            createdAt
            updatedAt
            professor {
              id
              name
              title
              score
              department {
                name
              }
            }
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const professorsByScore = /* GraphQL */ `
  query ProfessorsByScore(
    $type: String
    $score: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelProfessorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    professorsByScore(
      type: $type
      score: $score
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        title
        departmentID
        department {
          id
          name
          school {
            id
            name
          }
          createdAt
          updatedAt
        }
        imgsrc
        score
        comments {
          nextToken
        }
        classes {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const professorsByDeptID = /* GraphQL */ `
  query ProfessorsByDeptID(
    $type: String
    $departmentID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelProfessorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    professorsByDeptID(
      type: $type
      departmentID: $departmentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        title
        departmentID
        department {
          id
          name
          school {
            id
            name
          }
          createdAt
          updatedAt
        }
        imgsrc
        score
        comments {
          nextToken
        }
        classes {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const categoryByScore = /* GraphQL */ `
  query CategoryByScore(
    $categoryID: ID
    $score: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCategoryItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    categoryByScore(
      categoryID: $categoryID
      score: $score
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        categoryID
        category {
          id
          name
          description
          numRatings
          numCategoryItems
          imgsrc
          createdBy
          createdAt
          updatedAt
        }
        name
        imgsrc
        description
        content
        score
        createdBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchProfessors = /* GraphQL */ `
  query SearchProfessors(
    $filter: SearchableProfessorFilterInput
    $sort: SearchableProfessorSortInput
    $limit: Int
    $nextToken: String
    $from: Int
  ) {
    searchProfessors(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
    ) {
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
        classes {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`;
