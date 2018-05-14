import './Decode.scss'
import React, { Component, Fragment } from 'react'
import DecodeInput from './DecodeInput/DecodeInput.jsx'

export default class Decode extends Component {
  constructor (props) {
    super(props)

    this.state = {
      counter: [],
      simbols: [],
      text: []
    }

    this.handleOnAddSimbol = this.handleOnAddSimbol.bind(this)
    this.handleOnSetSimbol = this.handleOnSetSimbol.bind(this)
    this.handleOnChangeCode = this.handleOnChangeCode.bind(this)
    this.handleOnReset = this.handleOnReset.bind(this)
    this.handleOnRemoveSimbol = this.handleOnRemoveSimbol.bind(this)
  }

  handleOnReset () {
    this.setState({
      counter: [],
      simbols: [],
      text: []
    })

    this.textArea.value = ''
  }

  handleOnAddSimbol () {
    let prevState = this.state.counter
    prevState.push(1)

    this.setState({
      counter: prevState
    })
  }

  handleOnRemoveSimbol () {
    let prevState = this.state.counter
    console.log(prevState)
    prevState.pop()
    prevState = this.state.counter
    this.setState({
      counter: prevState
    })
  }

  handleOnSetSimbol (simbol) {
    let prevState = this.state.simbols

    if (simbol.character !== '' && simbol.code !== '') {
      prevState.forEach(simbolState => {
        if (simbolState.character === simbol.character) {
          simbolState.code = simbol.code
        }
      })

      prevState.push({character: simbol.character, code: simbol.code})

      let hash = {}
      prevState = prevState.filter(current => {
        let exists = !hash[current.code] || false
        hash[current.code] = true
        return exists
      })

      this.setState({
        simbols: prevState
      })
    }
  }

  handleOnChangeCode (e) {
    let prevState = this.state.simbols
    let value = e.target.value
    console.log(value)

    prevState.forEach(simbol => {
      console.log(simbol)
      if (simbol.code === value && simbol.code.length === value.length) {
        this.setState({
          text: this.state.text.concat([simbol.character])
        })
      }
    })

    if (this.textArea.value === '') {
      this.setState({
        text: ''
      })
    }
  }

  render () {
    return (
      <div className='decode'>
        {
            this.state.counter.length
            ? this.state.counter.map((note, i) => (
              <Fragment key={i}>
                <DecodeInput onSetSimbol={this.handleOnSetSimbol} />
              </Fragment>
            ))
            : <p>No hay simbolos!</p>
          }
        <button className='form__button' onClick={this.handleOnAddSimbol}>Agregar</button>
        <button className='form__button form__button--delete' onClick={this.handleOnRemoveSimbol}>Eliminar</button>
        <textarea className='form__input' cols='2' rows='2' placeholder='Código' onChange={this.handleOnChangeCode} ref={el => { this.textArea = el }} />
        <p className='decode__result'> <b>Resultado:</b> {this.state.text} </p>
        <button className='form__button' onClick={this.handleOnReset}>Reset</button>
      </div>
    )
  }
}
