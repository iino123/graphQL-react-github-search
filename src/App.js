import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import client from './client'
import { SEARCH_REPOSITORIES } from './graphql'

const DEFAULT_STATE = {  
  "first": 5,
  "after": null,
  "last": null,
  "before": null,
  "query": "フロントエンドエンジニア"
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
    
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // ここのbind(this)になる理由を調査
  }

  handleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
  }

  render() {
    const { first, after, last, before, query} = this.state
    console.log(query)
    return (
      <ApolloProvider client={client}>
        <form onSubmit={this.handleSubmit}>
          <input value={query} onChange={this.handleChange}/>
        </form>
        <Query
         query={SEARCH_REPOSITORIES}
         variables={{ first, after, last, before, query}}
        >
          {
            ({ loading, error, data }) => {
              if (loading) return 'Loading...'
              if (error) return `Error! ${error.message}`

              console.log(data)
              console.log(data.search.repositoryCount)
              const search = data.search
              const repoCount = search.repositoryCount
              const repoUnit = repoCount === 1 ? 'Repository' : 'Repositories'
              const title = `GitHub Rep Search Results - ${repoCount} ${repoUnit} `
              return <h2>{title}</h2>
            }
          }
        </Query>
      </ApolloProvider>
    )
  }
}

export default App