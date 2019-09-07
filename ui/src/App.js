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
    Person
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
      
      var link_data = people_relationships.map(d => ({from:d.person, to:d.topic}))
      var final_data = {nodes:node_data, links: link_data}

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
