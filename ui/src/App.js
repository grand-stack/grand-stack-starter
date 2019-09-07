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
      {
Person
  {
    name
    interests{
      Topic{
        name
        interestingTo{
          name
        }
        }
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
        var name1 = person.name;
          for(var i in person.interests){
              var topic = person.interests[i].Topic;
                  var topic_name = topic.name;
              for(var it in topic.interestingTo){
                  var name2 = topic.interestingTo[it].name;
                        person_relationships.push(
                          {person1: name1, topic: topic_name, person2: name2})
                      }
              }
         return person_relationships
      
      }

      var people_relationships = data.Person.map(unpackPerson).flat()

      var group_name1 = group(people_relationships, d => d.name1)
      var people = group_name1.keys().map(obj=> ({'name':obj.name, 'nodeLabel':'Person'}))     

      var group_topics = group(people_relationships, d => d.topic)
      var topics = group_topics.keys().map(obj=> ({'name':obj.name, 'nodeLabel':'Topic'}))     
 
      var node_data = people.concat(topics)
      
      var group_person_topic = group(people_relationships, d => d.name1, d => d.topic)
      console.log(group_person_topic)

      var final_data = {nodes:node_data, links: []]}

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
