import { neo4jgraphql } from "neo4j-graphql-js";

export const typeDefs = `
type Match {
  id: Int! @cypher(statement:"RETURN toString({this}.id) AS id")
  description: String
  round: String
  date: String @cypher(statement:"RETURN toString({this}.date) AS date")
  homeScore: Int @cypher(statement: "RETURN CASE WHEN exists({this}.h_score) THEN {this}.h_score ELSE null END AS homeScore")
  awayScore: Int @cypher(statement: "RETURN CASE WHEN exists({this}.a_score) THEN {this}.a_score ELSE null END AS awayScore")
  homePenalties: Int @cypher(statement: "WITH {this} AS this MATCH (this)-[:HOME_TEAM]->()-[playedIn:PLAYED_IN]->(this) RETURN CASE WHEN exists(playedIn.penalties) THEN playedIn.penalties ELSE null END AS homePenalties")
  awayPenalties: Int @cypher(statement: "WITH {this} AS this MATCH (this)-[:AWAY_TEAM]->()-[playedIn:PLAYED_IN]->(this) RETURN CASE WHEN exists(playedIn.penalties) THEN playedIn.penalties ELSE null END AS awayPenalties")
  homeTeam: Country @relation(name: "HOME_TEAM", direction: "OUT")
  awayTeam: Country @relation(name: "AWAY_TEAM", direction: "OUT")
  worldCup: WorldCup @relation(name: "CONTAINS_MATCH", direction: "IN")
  winner: Country @cypher(statement: """WITH {this} AS this
                                        MATCH (team1)-[t1Played:PLAYED_IN]->(this)<-[t2Played:PLAYED_IN]-(team2)
                                        WHERE id(team1) < id(team2)
                                        RETURN CASE
                                        WHEN t1Played.score > t2Played.score THEN team1
                                        WHEN t1Played.score < t2Played.score THEN team2
                                        WHEN t1Played.score = t2Played.score AND t1Played.penalties > t2Played.penalties THEN team1
                                        WHEN t1Played.score = t2Played.score AND t1Played.penalties < t2Played.penalties THEN team2
                                        ELSE null END AS winner
                                     """)
  goals: [Goal] @cypher(statement: "WITH {this} AS this MATCH (this)<-[:IN_MATCH]-()-[:SCORED_GOAL]->(goal) RETURN goal")
  appearances: [Appearance] @cypher(statement: "WITH {this} AS this MATCH (this)<-[:IN_MATCH]-(app:Appearance) RETURN app")
}

type Goal {
  type: String
  time: String
  scorer: Player @cypher(statement: "WITH {this} AS this MATCH (this)<-[:SCORED_GOAL]-()<--(p:Player) RETURN p")
}

type WorldCup {
  year: Int!,
  name: String,
  host: [Country] @relation(name: "HOSTED_BY", direction: "OUT")
  matches(first: Int = 10, offset: Int = 0, round: String): [Match] @relation(name: "CONTAINS_MATCH", direction: "OUT")
}

type Country {
  id: ID! @cypher(statement:"RETURN toString({this}.id) AS id")
  code: String
  name: String
  hostedWorldCups: [WorldCup] @relation(name: "HOSTED_BY", direction: "IN")
}

type Player {
  id: ID! @cypher(statement:"RETURN toString({this}.id) AS id")
  name: String
  dob: String @cypher(statement:"RETURN toString({this}.dob) AS dob")
  squads: [Squad] @relation(name: "IN_SQUAD", direction: "OUT")
  appearances: [Appearance] @cypher(statement:"WITH {this} AS this MATCH (this)-[:STARTED|:SUBSTITUTE]->(app) RETURN app AS allMatches")
  goals(year: [Int]): Int @cypher(statement: """WITH {this} AS this
                                              MATCH (this)-->(stats)-[:SCORED_GOAL]->(goal),
                                                    (stats)-[:IN_MATCH]->()<-[:CONTAINS_MATCH]-(wc:WorldCup)
                                              WHERE goal.type IN ['goal', 'penalty'] AND wc.year = $year
                                              RETURN count(*) AS goals
                                          """)
  allGoals: Int @cypher(statement: """WITH {this} AS this
                                              MATCH (this)-->(stats)-[:SCORED_GOAL]->(goal),
                                                    (stats)-[:IN_MATCH]->()<-[:CONTAINS_MATCH]-(wc:WorldCup)
                                              WHERE goal.type IN ['goal', 'penalty']
                                              RETURN count(*) AS goals
                                          """)
}

type Appearance {
  name: ID!
  allGoals: Int @cypher(statement:"WITH {this} AS this RETURN size([(this)-[:SCORED_GOAL]->(goal) WHERE goal.type in ['goal', 'penalty'] | goal]) AS goals")
  penalties: Int @cypher(statement:"WITH {this} AS this RETURN size([(this)-[:SCORED_GOAL]->(goal) WHERE goal.type in ['penalty'] | goal]) AS penalties")
  ownGoals: Int @cypher(statement:"WITH {this} AS this RETURN size([(this)-[:SCORED_GOAL]->(goal) WHERE goal.type in ['owngoal'] | goal]) AS ownGoals")
  match: Match @relation(name: "IN_MATCH", direction: "OUT")
  opposition: Country @cypher(statement:"WITH {this} AS this MATCH (this)-[:IN_MATCH]->(m)<-[:PLAYED_IN]-(team) WHERE not (team)-[:NAMED_SQUAD]->()<-[:IN_SQUAD]-()--(this) RETURN team AS opposition")
  player: Player @cypher(statement:"WITH {this} AS this MATCH (this)<-[:STARTED|:SUBSTITUTE]-(player) RETURN player")
  type: String @cypher(statement:"WITH {this} AS this MATCH (this)<-[app:STARTED|:SUBSTITUTE]-(player) RETURN type(app)")
}

type Squad {
  name: ID!
  year: Int
  country: Country @relation(name: "NAMED_SQUAD", direction: "IN")
  players: [Player] @relation(name: "IN_SQUAD", direction: "IN")
}

type Query {
    matches(id: Int, description: String, first: Int = 10, offset: Int = 0): [Match]
    worldcups(year: Int): [WorldCup]
    countries(name: String): [WorldCup]
    players(name: String, first: Int = 10, offset: Int = 0): [Player]
}
`;

export const resolvers = {
  Query: {
    matches: neo4jgraphql,
    worldcups: neo4jgraphql,
    countries: neo4jgraphql,
    players: neo4jgraphql
  }
};

var neo4j =
{
  "Stadium": {
    "count": 192,
    "relationships": {
      "PLAYED_IN_STADIUM": {
        "count": 100,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Match",
          "ExtraTime",
          "Penalties"
        ]
      }
    },
    "type": "node",
    "properties": {
      "name": {
        "existence": false,
        "type": "STRING",
        "indexed": true,
        "unique": true
      }
    },
    "labels": []
  },
  "HOME_TEAM": {
    "type": "relationship",
    "count": 972,
    "properties": {

    }
  },
  "Player": {
    "count": 7868,
    "relationships": {
      "SUBSTITUTE": {
        "count": 218,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Appearance"
        ]
      },
      "STARTED": {
        "count": 252,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Appearance"
        ]
      },
      "IN_SQUAD": {
        "count": 3028,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Squad"
        ]
      }
    },
    "type": "node",
    "properties": {
      "name": {
        "existence": false,
        "type": "STRING",
        "indexed": true,
        "unique": false
      },
      "position": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "id": {
        "existence": false,
        "type": "INTEGER",
        "indexed": true,
        "unique": true
      },
      "dob": {
        "existence": false,
        "type": "UNKNOWN",
        "indexed": false,
        "unique": false
      }
    },
    "labels": []
  },
  "NAMED_SQUAD": {
    "type": "relationship",
    "count": 457,
    "properties": {

    }
  },
  "SUBSTITUTE": {
    "type": "relationship",
    "count": 18813,
    "properties": {

    }
  },
  "ExtraTime": {
    "count": 60,
    "relationships": {
      "HOME_TEAM": {
        "count": 2059,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Country"
        ]
      },
      "PLAYED_IN_STADIUM": {
        "count": 385,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Stadium"
        ]
      },
      "AWAY_TEAM": {
        "count": 1224,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Country"
        ]
      },
      "PLAYED_IN": {
        "count": 76098,
        "properties": {
          "penalties": {
            "type": "INTEGER",
            "existence": false,
            "array": false
          },
          "score": {
            "type": "INTEGER",
            "existence": false,
            "array": false
          }
        },
        "direction": "in",
        "labels": [
          "Country"
        ]
      },
      "CONTAINS_MATCH": {
        "count": 42882,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "WorldCup"
        ]
      }
    },
    "type": "node",
    "properties": {
      "date": {
        "existence": false,
        "type": "UNKNOWN",
        "indexed": false,
        "unique": false
      },
      "a_score": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      },
      "description": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "id": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      },
      "round": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "h_score": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      }
    },
    "labels": []
  },
  "HOSTED_BY": {
    "type": "relationship",
    "count": 22,
    "properties": {

    }
  },
  "PLAYED_IN": {
    "type": "relationship",
    "count": 1768,
    "properties": {
      "penalties": {
        "type": "INTEGER",
        "existence": false,
        "array": false
      },
      "score": {
        "type": "INTEGER",
        "existence": false,
        "array": false
      }
    }
  },
  "Appearance": {
    "count": 37353,
    "relationships": {
      "SCORED_GOAL": {
        "count": 6,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Goal"
        ]
      },
      "SUBSTITUTE": {
        "count": 790,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Player"
        ]
      },
      "IN_MATCH": {
        "count": 4383,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Match"
        ]
      },
      "STARTED": {
        "count": 1054,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Player"
        ]
      }
    },
    "type": "node",
    "properties": {
      "name": {
        "existence": false,
        "type": "STRING",
        "indexed": true,
        "unique": false
      }
    },
    "labels": []
  },
  "CONTAINS_MATCH": {
    "type": "relationship",
    "count": 884,
    "properties": {

    }
  },
  "WorldCup": {
    "count": 21,
    "relationships": {
      "CONTAINS_MATCH": {
        "count": 884,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Match",
          "ExtraTime",
          "Penalties"
        ]
      },
      "HOSTED_BY": {
        "count": 30,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Country"
        ]
      },
      "FOR_WORLD_CUP": {
        "count": 100,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Squad"
        ]
      }
    },
    "type": "node",
    "properties": {
      "name": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "year": {
        "existence": false,
        "type": "INTEGER",
        "indexed": true,
        "unique": true
      }
    },
    "labels": []
  },
  "Match": {
    "count": 884,
    "relationships": {
      "HOME_TEAM": {
        "count": 2845,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Country"
        ]
      },
      "PLAYED_IN_STADIUM": {
        "count": 596,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Stadium"
        ]
      },
      "AWAY_TEAM": {
        "count": 1633,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Country"
        ]
      },
      "PLAYED_IN": {
        "count": 76098,
        "properties": {
          "penalties": {
            "type": "INTEGER",
            "existence": false,
            "array": false
          },
          "score": {
            "type": "INTEGER",
            "existence": false,
            "array": false
          }
        },
        "direction": "in",
        "labels": [
          "Country"
        ]
      },
      "CONTAINS_MATCH": {
        "count": 42882,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "WorldCup"
        ]
      },
      "IN_MATCH": {
        "count": 100,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Appearance"
        ]
      }
    },
    "type": "node",
    "properties": {
      "date": {
        "existence": false,
        "type": "UNKNOWN",
        "indexed": false,
        "unique": false
      },
      "a_score": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      },
      "description": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "id": {
        "existence": false,
        "type": "INTEGER",
        "indexed": true,
        "unique": true
      },
      "round": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "h_score": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      }
    },
    "labels": []
  },
  "IN_SQUAD": {
    "type": "relationship",
    "count": 10092,
    "properties": {

    }
  },
  "SCORED_GOAL": {
    "type": "relationship",
    "count": 2392,
    "properties": {

    }
  },
  "PLAYED_IN_STADIUM": {
    "type": "relationship",
    "count": 972,
    "properties": {

    }
  },
  "Penalties": {
    "count": 28,
    "relationships": {
      "HOME_TEAM": {
        "count": 1034,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Country"
        ]
      },
      "PLAYED_IN_STADIUM": {
        "count": 182,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Stadium"
        ]
      },
      "AWAY_TEAM": {
        "count": 580,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Country"
        ]
      },
      "PLAYED_IN": {
        "count": 76098,
        "properties": {
          "penalties": {
            "type": "INTEGER",
            "existence": false,
            "array": false
          },
          "score": {
            "type": "INTEGER",
            "existence": false,
            "array": false
          }
        },
        "direction": "in",
        "labels": [
          "Country"
        ]
      },
      "CONTAINS_MATCH": {
        "count": 42882,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "WorldCup"
        ]
      }
    },
    "type": "node",
    "properties": {
      "date": {
        "existence": false,
        "type": "UNKNOWN",
        "indexed": false,
        "unique": false
      },
      "a_score": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      },
      "description": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "id": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      },
      "round": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "h_score": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      }
    },
    "labels": []
  },
  "Goal": {
    "count": 2392,
    "relationships": {
      "SCORED_GOAL": {
        "count": 8,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Appearance"
        ]
      }
    },
    "type": "node",
    "properties": {
      "type": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "time": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      }
    },
    "labels": []
  },
  "AWAY_TEAM": {
    "type": "relationship",
    "count": 972,
    "properties": {

    }
  },
  "STARTED": {
    "type": "relationship",
    "count": 18540,
    "properties": {

    }
  },
  "Country": {
    "count": 84,
    "relationships": {
      "HOME_TEAM": {
        "count": 100,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Match",
          "ExtraTime",
          "Penalties"
        ]
      },
      "NAMED_SQUAD": {
        "count": 457,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "Squad"
        ]
      },
      "HOSTED_BY": {
        "count": 24,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "WorldCup"
        ]
      },
      "AWAY_TEAM": {
        "count": 100,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Match",
          "ExtraTime",
          "Penalties"
        ]
      },
      "PLAYED_IN": {
        "count": 3536,
        "properties": {
          "penalties": {
            "type": "INTEGER",
            "existence": false,
            "array": false
          },
          "score": {
            "type": "INTEGER",
            "existence": false,
            "array": false
          }
        },
        "direction": "out",
        "labels": [
          "Match",
          "ExtraTime",
          "Penalties"
        ]
      }
    },
    "type": "node",
    "properties": {
      "name": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      },
      "id": {
        "existence": false,
        "type": "INTEGER",
        "indexed": true,
        "unique": true
      },
      "code": {
        "existence": false,
        "type": "STRING",
        "indexed": false,
        "unique": false
      }
    },
    "labels": []
  },
  "FOR_WORLD_CUP": {
    "type": "relationship",
    "count": 457,
    "properties": {

    }
  },
  "Squad": {
    "count": 457,
    "relationships": {
      "NAMED_SQUAD": {
        "count": 4377,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Country"
        ]
      },
      "FOR_WORLD_CUP": {
        "count": 3200,
        "properties": {

        },
        "direction": "out",
        "labels": [
          "WorldCup"
        ]
      },
      "IN_SQUAD": {
        "count": 230,
        "properties": {

        },
        "direction": "in",
        "labels": [
          "Player"
        ]
      }
    },
    "type": "node",
    "properties": {
      "name": {
        "existence": false,
        "type": "STRING",
        "indexed": true,
        "unique": true
      },
      "year": {
        "existence": false,
        "type": "INTEGER",
        "indexed": false,
        "unique": false
      }
    },
    "labels": []
  },
  "IN_MATCH": {
    "type": "relationship",
    "count": 37353,
    "properties": {

    }
  }
}