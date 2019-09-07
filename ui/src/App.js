import React, { Component } from 'react'
import './App.css';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import BipartiteGraph from './BipartiteGraph';
import { group, roundup } from 'd3-array';

class App extends Component {
  render() {
    return (
    <Query
    query={gql`
    {Person
  {
    name
    interests{
        name
        }
      }
    }
      `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error</p>;

      function unpackPerson(person)
      {
        var person_relationships = []
        var person_name = person.name;
            for(var i in person.interests){
                var topic_name = person.interests[i].name;
                person_relationships.push(
                    {person: person_name, topic: topic_name})
            }
         return person_relationships
      }

      var people_relationships = data.Person.map(unpackPerson).flat()
      var topic_relationships = people_relationships

      var group_person = group(people_relationships, d => d.person)
      var people = Array.from(group_person.keys()).map(d=> ({'name':d, 'nodeLabel':'Person'}))     

      var group_topics = group(people_relationships, d => d.topic)
      var topics = Array.from(group_topics.keys()).map(d=> ({'name':d, 'nodeLabel':'Topic'}))     
 
      var node_data = people.concat(topics)
      
      var link_data = people_relationships.map(d => ({'source':{name:d.person}, 'target':{name:d.topic}}))
      var final_data = {nodes:node_data, links: link_data}

      function arrayJoin(lookupTable, mainTable, lookupKey, mainKey, lookupColumn, newColumnName) {
        var output = []
        var lg = group(lookupTable, d => d[lookupKey]);
        for(var row in mainTable){
            var matchedRows = lg.get(mainTable[row][mainKey])
            for (var matchedRow in matchedRows){
                var newRow = Object.assign({}, mainTable[row])
                newRow[newColumnName] = matchedRows[matchedRow][lookupColumn]
                output.push(newRow)
            }
        }
        return output;
    };

    var person_to_person = arrayJoin(people_relationships, topic_relationships, "topic", "topic", "person", "person2");

    //var topic_to_topic = arrayJoin(topic_relationships, people_relationships, "person", "person", "topic", "topic2");

    var pg = rollups(person_to_person, v => v.map(w => w.topic), d => d.person, d => d.person2)
    
    function assembleProjection(groupedArray){
        var linkArray = []
        var p1 = groupedArray[0]
        for (var i in groupedArray[1]){
            var p2 = groupedArray[1][i][0]
            var topics = groupedArray[1][i][1]
            if (p1 < p2){
                linkArray.push({from:p1, to:p2, topics:topics.join(", "), topicCount:topics.length})
            }
        }

        return linkArray //people2.map(p2 => ({person1: p1, person2:p2[0]}))
    }
    var pgm = pg.map(assembleProjection)
        
    console.log(pgm)

      return (
    
      <div className='App'>
        <div className='App-header'>
          <h2>Common Interests</h2>
        </div>
        <div>
          <BipartiteGraph data={final_data} size={[800,500]} orientation={"vertical"} />
        </div>
      </div>
    )}}
    </Query>    
    )
  }

}



export default App;
