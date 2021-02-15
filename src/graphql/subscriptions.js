/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSchool = /* GraphQL */ `
  subscription OnCreateSchool {
    onCreateSchool {
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
export const onUpdateSchool = /* GraphQL */ `
  subscription OnUpdateSchool {
    onUpdateSchool {
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
export const onDeleteSchool = /* GraphQL */ `
  subscription OnDeleteSchool {
    onDeleteSchool {
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
export const onCreateDepartment = /* GraphQL */ `
  subscription OnCreateDepartment {
    onCreateDepartment {
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
export const onUpdateDepartment = /* GraphQL */ `
  subscription OnUpdateDepartment {
    onUpdateDepartment {
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
export const onDeleteDepartment = /* GraphQL */ `
  subscription OnDeleteDepartment {
    onDeleteDepartment {
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
export const onCreateProfessor = /* GraphQL */ `
  subscription OnCreateProfessor {
    onCreateProfessor {
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
export const onUpdateProfessor = /* GraphQL */ `
  subscription OnUpdateProfessor {
    onUpdateProfessor {
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
export const onDeleteProfessor = /* GraphQL */ `
  subscription OnDeleteProfessor {
    onDeleteProfessor {
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
export const onCreateCourse = /* GraphQL */ `
  subscription OnCreateCourse {
    onCreateCourse {
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
export const onUpdateCourse = /* GraphQL */ `
  subscription OnUpdateCourse {
    onUpdateCourse {
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
export const onDeleteCourse = /* GraphQL */ `
  subscription OnDeleteCourse {
    onDeleteCourse {
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
export const onCreateRating = /* GraphQL */ `
  subscription OnCreateRating {
    onCreateRating {
      id
      userID
      contentID
      ratingType
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRating = /* GraphQL */ `
  subscription OnUpdateRating {
    onUpdateRating {
      id
      userID
      contentID
      ratingType
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRating = /* GraphQL */ `
  subscription OnDeleteRating {
    onDeleteRating {
      id
      userID
      contentID
      ratingType
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProfessorComment = /* GraphQL */ `
  subscription OnCreateProfessorComment {
    onCreateProfessorComment {
      id
      professorID
      content
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProfessorComment = /* GraphQL */ `
  subscription OnUpdateProfessorComment {
    onUpdateProfessorComment {
      id
      professorID
      content
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProfessorComment = /* GraphQL */ `
  subscription OnDeleteProfessorComment {
    onDeleteProfessorComment {
      id
      professorID
      content
      createdAt
      updatedAt
    }
  }
`;
