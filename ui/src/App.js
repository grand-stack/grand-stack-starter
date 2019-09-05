import React, { Component } from 'react'
import './App.css';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import BipartiteGraph from './BipartiteGraph'

class App extends Component {
  render() {
    return (
    <Query
    query={gql`
      {
          Person {
            name
            interests
              { 
                name
              }
          }
        }  
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error</p>;

      var people = data.Person.map(obj=> ({'name':obj.name, 'nodeLabel':'Person'}))
      var topics = data.Person.map(obj=>obj.interests.map(obj2 => obj2.name)).flat()
      var unique_topics = [...new Set(topics)].map(topic => ({'name':topic, 'nodeLabel':'Topic'}))
      var node_data = people.concat(unique_topics)
      
      var links_data = []
      for (var person in data.Person)
        {var person_data = data.Person[person];
           for (var interest in person_data.interests){
             links_data.push({'source':person_data.name, 'target':person_data.interests[interest].name})
           }
           }
      var final_data = {nodes:node_data, links: links_data}

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
