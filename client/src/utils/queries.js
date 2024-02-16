import { gql } from "@apollo/client";

export const QUERY_ME = gql`
        {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
        `
