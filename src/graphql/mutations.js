/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSchool = /* GraphQL */ `
  mutation CreateSchool(
    $input: CreateSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    createSchool(input: $input, condition: $condition) {
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
export const updateSchool = /* GraphQL */ `
  mutation UpdateSchool(
    $input: UpdateSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    updateSchool(input: $input, condition: $condition) {
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
export const deleteSchool = /* GraphQL */ `
  mutation DeleteSchool(
    $input: DeleteSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    deleteSchool(input: $input, condition: $condition) {
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
export const createDepartment = /* GraphQL */ `
  mutation CreateDepartment(
    $input: CreateDepartmentInput!
    $condition: ModelDepartmentConditionInput
  ) {
    createDepartment(input: $input, condition: $condition) {
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
          isGeneral
          generalReqID
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
export const updateDepartment = /* GraphQL */ `
  mutation UpdateDepartment(
    $input: UpdateDepartmentInput!
    $condition: ModelDepartmentConditionInput
  ) {
    updateDepartment(input: $input, condition: $condition) {
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
          isGeneral
          generalReqID
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
export const deleteDepartment = /* GraphQL */ `
  mutation DeleteDepartment(
    $input: DeleteDepartmentInput!
    $condition: ModelDepartmentConditionInput
  ) {
    deleteDepartment(input: $input, condition: $condition) {
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
          isGeneral
          generalReqID
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
export const createProfessor = /* GraphQL */ `
  mutation CreateProfessor(
    $input: CreateProfessorInput!
    $condition: ModelProfessorConditionInput
  ) {
    createProfessor(input: $input, condition: $condition) {
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
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateProfessor = /* GraphQL */ `
  mutation UpdateProfessor(
    $input: UpdateProfessorInput!
    $condition: ModelProfessorConditionInput
  ) {
    updateProfessor(input: $input, condition: $condition) {
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
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteProfessor = /* GraphQL */ `
  mutation DeleteProfessor(
    $input: DeleteProfessorInput!
    $condition: ModelProfessorConditionInput
  ) {
    deleteProfessor(input: $input, condition: $condition) {
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
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createClass = /* GraphQL */ `
  mutation CreateClass(
    $input: CreateClassInput!
    $condition: ModelClassConditionInput
  ) {
    createClass(input: $input, condition: $condition) {
      id
      professorID
      courseID
      professor {
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
      course {
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
        isGeneral
        generalReqID
        classes {
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
export const updateClass = /* GraphQL */ `
  mutation UpdateClass(
    $input: UpdateClassInput!
    $condition: ModelClassConditionInput
  ) {
    updateClass(input: $input, condition: $condition) {
      id
      professorID
      courseID
      professor {
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
      course {
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
        isGeneral
        generalReqID
        classes {
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
export const deleteClass = /* GraphQL */ `
  mutation DeleteClass(
    $input: DeleteClassInput!
    $condition: ModelClassConditionInput
  ) {
    deleteClass(input: $input, condition: $condition) {
      id
      professorID
      courseID
      professor {
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
      course {
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
        isGeneral
        generalReqID
        classes {
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
export const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    createCourse(input: $input, condition: $condition) {
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
      isGeneral
      generalReqID
      classes {
        items {
          id
          professorID
          courseID
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
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
      id
      name
      code
      numCredits
      departmentID
      type
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
      isGeneral
      generalReqID
      difficultyOne
      difficultyTwo
      difficultyThree
      difficultyFour
      difficultyFive
      classes {
        items {
          id
          professorID
          courseID
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
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
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
      isGeneral
      generalReqID
      classes {
        items {
          id
          professorID
          courseID
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
export const createRating = /* GraphQL */ `
  mutation CreateRating(
    $input: CreateRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    createRating(input: $input, condition: $condition) {
      id
      userID
      contentID
      ratingType
      createdAt
      updatedAt
    }
  }
`;
export const updateRating = /* GraphQL */ `
  mutation UpdateRating(
    $input: UpdateRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    updateRating(input: $input, condition: $condition) {
      id
      userID
      contentID
      ratingType
      createdAt
      updatedAt
    }
  }
`;
export const deleteRating = /* GraphQL */ `
  mutation DeleteRating(
    $input: DeleteRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    deleteRating(input: $input, condition: $condition) {
      id
      userID
      contentID
      ratingType
      createdAt
      updatedAt
    }
  }
`;
export const createProfessorComment = /* GraphQL */ `
  mutation CreateProfessorComment(
    $input: CreateProfessorCommentInput!
    $condition: ModelProfessorCommentConditionInput
  ) {
    createProfessorComment(input: $input, condition: $condition) {
      id
      professorID
      content
      createdAt
      updatedAt
    }
  }
`;
export const updateProfessorComment = /* GraphQL */ `
  mutation UpdateProfessorComment(
    $input: UpdateProfessorCommentInput!
    $condition: ModelProfessorCommentConditionInput
  ) {
    updateProfessorComment(input: $input, condition: $condition) {
      id
      professorID
      content
      createdAt
      updatedAt
    }
  }
`;
export const deleteProfessorComment = /* GraphQL */ `
  mutation DeleteProfessorComment(
    $input: DeleteProfessorCommentInput!
    $condition: ModelProfessorCommentConditionInput
  ) {
    deleteProfessorComment(input: $input, condition: $condition) {
      id
      professorID
      content
      createdAt
      updatedAt
    }
  }
`;
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
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
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
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
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
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
export const createCategoryItem = /* GraphQL */ `
  mutation CreateCategoryItem(
    $input: CreateCategoryItemInput!
    $condition: ModelCategoryItemConditionInput
  ) {
    createCategoryItem(input: $input, condition: $condition) {
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
      SubCategory
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const updateCategoryItem = /* GraphQL */ `
  mutation UpdateCategoryItem(
    $input: UpdateCategoryItemInput!
    $condition: ModelCategoryItemConditionInput
  ) {
    updateCategoryItem(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteCategoryItem = /* GraphQL */ `
  mutation DeleteCategoryItem(
    $input: DeleteCategoryItemInput!
    $condition: ModelCategoryItemConditionInput
  ) {
    deleteCategoryItem(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
