const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')
const { gql } = require('@apollo/client')

export const getSeedMutations = async () => {
  const res = await fetch(
    'https://cdn.neo4jlabs.com/data/grandstack_businesses.csv'
  )
  const body = await res.text()
  const records = parse(body, { columns: true })
  const mutations = generateMutations(records)

  return mutations
}

const generateMutations = (records) => {
  return records.map((rec) => {
    Object.keys(rec).map((k) => {
      if (k === 'latitude' || k === 'longitude' || k === 'reviewStars') {
        rec[k] = parseFloat(rec[k])
      } else if (k === 'reviewDate') {
        const dateParts = rec[k].split('-')
        rec['year'] = parseInt(dateParts[0])
        rec['month'] = parseInt(dateParts[1])
        rec['day'] = parseInt(dateParts[2])
      } else if (k === 'categories') {
        rec[k] = rec[k].split(',')
      }
    })

    return {
      mutation: gql`
        mutation mergeReviews(
          $userId: ID!
          $userName: String!
          $businessId: ID!
          $businessName: String!
          $businessCity: String!
          $businessState: String!
          $businessAddress: String!
          $latitude: Float!
          $longitude: Float!
          $reviewId: ID!
          $reviewText: String
          $reviewDate: DateTime
          $reviewStars: Float
          $categories: [String!]!
        ) {
          user: mergeUser(userId: $userId, name: $userName) {
            userId
          }
          business: mergeBusiness(
            businessId: $businessId
            name: $businessName
            address: $businessAddress
            city: $businessCity
            state: $businessState
            latitude: $latitude
            longitude: $longitude
          ) {
            businessId
          }

          businessCategories: mergeBusinessCategory(
            categories: $categories
            businessId: $businessId
          ) {
            businessId
          }

          reviews: createReviews(
            input: {
              reviewId: $reviewId
              stars: $reviewStars
              text: $reviewText
              date: $reviewDate
              business: { connect: { where: { businessId: $businessId } } }
              user: { connect: { where: { userId: $userId } } }
            }
          ) {
            reviews {
              reviewId
              date
            }
          }
        }
      `,
      variables: rec,
    }
  })
}
