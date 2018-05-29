import React, { Component, Fragment } from 'react'
import Teoria from './components/Teoria/Teoria.jsx'
import './index.scss'
import { pwa, isOnLine } from './registerServiceWorker'

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
      pwa()
      isOnLine()
    }, 1500)
  }

  componentWillUnmount () {
  }

  render () {
    return this.state.loading === true
    ? (<div className='loader'>
      <div class='sk-circle'>
        <div class='sk-circle1 sk-child' />
        <div class='sk-circle2 sk-child' />
        <div class='sk-circle3 sk-child' />
        <div class='sk-circle4 sk-child' />
        <div class='sk-circle5 sk-child' />
        <div class='sk-circle6 sk-child' />
        <div class='sk-circle7 sk-child' />
        <div class='sk-circle8 sk-child' />
        <div class='sk-circle9 sk-child' />
        <div class='sk-circle10 sk-child' />
        <div class='sk-circle11 sk-child' />
        <div class='sk-circle12 sk-child' />
      </div>
    </div>)
    : (
      <Fragment>
        <header className='header'>
          <h2 className='header__title'>Teoría de la información</h2>
          <div className='group'>
            <p>Andrés Felipe Álvarez Caballero</p>
            <p>Juan Mateo García Ramirez</p>
            <p>Santiago Hernández Mejía</p>
          </div>
        </header>
        <Teoria />
      </Fragment>
    )
  }
}
