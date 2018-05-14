import React, { Component } from 'react'
import Teoria from './components/Teoria/Teoria.jsx'
import './index.scss'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 1000)
  }

  componentWillUnmount () {
  }

  render () {
    return this.state.loading === true
    ? (<div className='loader'>
      <h1>Cargando...</h1>
    </div>)
    : (
      <main>
        <header className='header'>
          <h2 className='header__title'>Teoría de la información</h2>
          <div className='group'>
            <p>Andrés Felipe Álvarez Caballero</p>
            <p>Juan Mateo García Ramirez</p>
            <p>Santiago Hernández Mejía</p>
          </div>
        </header>
        <Teoria />
      </main>
    )
  }
}
