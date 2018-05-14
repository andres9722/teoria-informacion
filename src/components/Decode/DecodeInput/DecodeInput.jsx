import './DecodeInput.scss'
import React, { Component } from 'react'

export default class DecodeInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      simbols: {},
      text: []
    }

    this.onSetSimbol = this.onSetSimbol.bind(this)
  }

  onSetSimbol () {
    let simbol = {
      character: this.inputCharacter.value,
      code: this.inputSimbol.value
    }

    this.props.onSetSimbol(simbol)
  }

  render () {
    return (
      <form className='form' onChange={this.onSetSimbol}>
        <input className='form__input' type='text' placeholder='Simbolo' ref={el => { this.inputCharacter = el }} />
        <input className='form__input' type='text' placeholder='Código' ref={el => { this.inputSimbol = el }} />
      </form>
    )
  }
}
