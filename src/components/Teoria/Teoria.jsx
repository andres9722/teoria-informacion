import './Teoria.scss'
import React, { Component } from 'react'
import Decode from '../Decode/Decode.jsx'

export default class Teoria extends Component {
  constructor (props) {
    super(props)

    this.state = {
      text: '',
      numberLetters: 0,
      numberSpaces: 0,
      letterInfo: [],
      entropy: 0,
      huffman: [],
      file: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnReset = this.handleOnReset.bind(this)
    this.detectedFile = this.detectedFile.bind(this)
  }

  handleOnChange (e) {
    let text = e.target.value
    this.generateHuffman(text)
    let sim = /\s+/gi
    let numberLetters = text.trim().replace(sim, ' ').split('').length
    let numberSpaces = text.split(' ').length - 1

    let letters = text.split('')

    let letterFreq = {}

    letters.forEach(letter => {
      if (!letterFreq[letter]) {
        letterFreq[letter] = 0
      }

      letterFreq[letter] += 1
    })

    let letterInfo = []

    for (const key in letterFreq) {
      if (letterFreq.hasOwnProperty(key)) {
        const freq = letterFreq[key]
        let prob = (freq / numberLetters)
        letterInfo.push({'Caracter': key, 'Frecuencia': freq, 'Probabilidad': prob})
      }
    }

    let entropy = 0

    letterInfo.forEach(letter => {
      entropy += letter.Probabilidad * Math.log2(1 / letter.Probabilidad)
    })

    this.setState({
      text: text,
      numberLetters: numberLetters,
      numberSpaces: numberSpaces,
      letterFrequency: letterFreq,
      letterInfo: letterInfo,
      entropy: entropy
    })

    if (e.target.value === '') {
      this.setState({
        text: '',
        numberLetters: 0,
        numberSpaces: 0,
        letterFrequency: {},
        letterInfo: [],
        entropy: 0,
        huffman: null
      })
    }
  }

  generateHuffman (text) {
    let characterFrequencyHash = populateCharacterFrequencyHash(text)
    let huffmanPriorityQueue = fillHuffmanPriorityQueue(characterFrequencyHash)
    let huffmanTree = buildHuffmanTree(huffmanPriorityQueue)
    let huffmanEncodingTable = new HuffmanEncodingTable()
    huffmanEncodingTable.generateEncodingTableRecursively(huffmanTree)

    function populateCharacterFrequencyHash (text) {
      let characterFrequency = {}

      for (let i = 0; i < text.length; i++) {
        let character = text.charAt(i)
        if (characterFrequency[character] === undefined) {
          characterFrequency[character] = 1
        } else {
          let currentCharacterFrequency = characterFrequency[character]
          characterFrequency[character]++
        }
      }

      return characterFrequency
    }

    function fillHuffmanPriorityQueue (characterFrequencyHash) {
      let queueToFill = new HuffmanPriorityQueueClass()

      for (let hashKey in characterFrequencyHash) {
        let newNode = newHuffmanLeadNode(hashKey, characterFrequencyHash[hashKey])
        queueToFill.insert(newNode)
      }

      return queueToFill
    }

    function HuffmanPriorityQueueClass () {
      this.queue = new Array(null)
      this.ROOT = 1

      this.insert = function (newNode) {
        this.queue.push(newNode)
        for (let nodeLocation = this.queue.length - 1; nodeLocation > this.ROOT; nodeLocation = Math.floor(nodeLocation / 2)) {
          if (this.isLessThan(this.queue[nodeLocation], this.queue[Math.floor(nodeLocation / 2)])) {
            this.swap(nodeLocation, Math.floor(nodeLocation / 2))
          }
        }
      }

      this.isLessThan = function (oneNode, anotherNode) {
        if (oneNode === undefined || anotherNode === undefined) {
          return false
        }
        if (oneNode.frequency < anotherNode.frequency) {
          return true
        } else if (oneNode.frequency > anotherNode.frequency) {
          return false
        } else if (oneNode.character < anotherNode.character) {
          return true
        } else {
          return false
        }
      }

      this.swap = function (nodeLocation, nodeDestination) {
        let temporaryNode = this.queue[nodeLocation]
        this.queue[nodeLocation] = this.queue[nodeDestination]
        this.queue[nodeDestination] = temporaryNode
      }

      this.removeSmallestFrequencyNode = function () {
        let smallestFrequencyNode = this.queue[this.ROOT]
        let lastNodeTest = this.queue.pop()
        if (this.queue.length > this.ROOT) {
          this.queue[this.ROOT] = lastNodeTest
        }
        let nodeLocation = this.ROOT
        while (nodeLocation < this.queue.length - 1) {
          let leftChildNodeLocation = (nodeLocation * 2)
          let rightChildNodeLocation = ((nodeLocation * 2) + 1)

          let leftChildLessThanRight
          if (this.queue[rightChildNodeLocation] === undefined) {
            leftChildLessThanRight = true
          } else if (this.isLessThan(this.queue[leftChildNodeLocation], this.queue[rightChildNodeLocation])) {
            leftChildLessThanRight = true
          } else {
            leftChildLessThanRight = false
          }

          if (leftChildLessThanRight && this.isLessThan(this.queue[leftChildNodeLocation], this.queue[nodeLocation])) {
            this.swap(leftChildNodeLocation, nodeLocation)
          } else if (!leftChildLessThanRight && this.isLessThan(this.queue[rightChildNodeLocation], this.queue[nodeLocation])) {
            this.swap(rightChildNodeLocation, nodeLocation)
          } else {
            break
          }
        }
        return smallestFrequencyNode
      }
    }

    function newHuffmanLeadNode (character, frequency) {
      return new HuffmanNode(character, frequency, 'Leaf', null, null)
    }

    function HuffmanNode (character, frequency, type, childLeft, childRight) {
      this.character = character
      this.frequency = frequency
      this.type = type
      this.childLeft = childLeft
      this.childRight = childRight
    }

    function buildHuffmanTree (huffmanPriorityQueue) {
      while (huffmanPriorityQueue.queue.length - 1 > huffmanPriorityQueue.ROOT) {
        let temporaryLeftNode = huffmanPriorityQueue.removeSmallestFrequencyNode()
        let temporaryRightNode = huffmanPriorityQueue.removeSmallestFrequencyNode()
        let newNodeFrequency = temporaryLeftNode.frequency + temporaryRightNode.frequency
        let temporaryBodyNode = newHuffmanBodyNode(newNodeFrequency, temporaryLeftNode, temporaryRightNode)
        huffmanPriorityQueue.insert(temporaryBodyNode)
      }
      return huffmanPriorityQueue.queue[huffmanPriorityQueue.ROOT]
    }

    function newHuffmanBodyNode (frequency, childLeft, childRight) {
      return new HuffmanNode('', frequency, 'Body', childLeft, childRight)
    }

    function HuffmanEncodingTable () {
      this.binaryOutput = ''
      this.table = new Array()
      this.characterEncodingHash = {}

      this.generateEncodingTableRecursively = function (huffmanTree) {
        if (huffmanTree !== undefined) {
          if (huffmanTree.type === 'Leaf') {
            this.addTableEntry(huffmanTree.character, huffmanTree.frequency, this.binaryOutput)
            this.binaryOutput = this.binaryOutput.substring(0, this.binaryOutput.length - 1)
            return
          }

          this.binaryOutput += '0'
          this.generateEncodingTableRecursively(huffmanTree.childLeft)

          this.binaryOutput += '1'
          this.generateEncodingTableRecursively(huffmanTree.childRight)

          this.binaryOutput = this.binaryOutput.substring(0, this.binaryOutput.length - 1)
        }
      }

      this.addTableEntry = function (newCharacter, newFrequency, newBinary) {
        let newEncodingTableEntry = new Array(newCharacter, newFrequency, newBinary)
        this.table.push(newEncodingTableEntry)
      }
    }

    this.setState({
      huffman: huffmanEncodingTable
    })
  }

  handleOnReset () {
    this.inputElement.value = null

    this.setState({
      text: '',
      numberLetters: 0,
      numberSpaces: 0,
      letterFrequency: {},
      letterInfo: [],
      entropy: 0,
      huffman: null
    })
  }

  detectedFile (e) {
    e.preventDefault()
    let reader = new FileReader()

    reader.onload = () => {
      let text = reader.result
      this.inputElement.value = text
      this.setState({
        text: text
      })
    }

    reader.readAsText(e.target.files[0])
    e.target.value = null
  }

  render () {
    return (
      <section className='teoria__container l-container'>
        <div>
          <h3 className='teoria__title'>Pon tu texto</h3>
          <textarea autoFocus id='teoria__input' rows='5' className='teoria__input' type='text' placeholder='Texto'
            onChange={this.handleOnChange} onMouseEnter={this.handleOnChange} ref={el => { this.inputElement = el }} />
          <label className='upload__label'> Seleccionar archivo
            <input id='upload__input' className='upload__input' type='file' accept='text/plain' onChange={this.detectedFile} />
          </label>
          <p className='teoria__subtitle'> <b>Generación código Huffman:</b></p>
          <table className='table'>
            <thead>
              <tr>
                <th>Caracter</th>
                <th>Frecuencia</th>
                <th>Código fuente</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.text
                ? this.state.huffman
                ? this.state.huffman.table.map(character => {
                  return (
                    <tr key={character[0]} className='table__row'>
                      <td className='table__item'> {character[0] === ' ' ? 'Espacio' : character[0]}</td>
                      <td className='table__item'> {character[1]}</td>
                      <td className='table__item'> {character[2]}</td>
                    </tr>
                  )
                })
                  : null
                  : null
                }
            </tbody>
          </table>

          <br />

          <p className='teoria__subtitle'> <b>Decodificador:</b></p>
          <Decode />
        </div>
        <div className='teoria__section'>
          <p className='teoria__text'> <b>Texto:</b> {this.state.text} </p>
          <p className='teoria__text'> <b>Número de caracteres:</b> {this.state.numberLetters}</p>
          <p className='teoria__text'> <b>Número de espacios:</b> {this.state.numberSpaces}</p>
          <p className='teoria__text'> <b>Total:</b> {this.state.numberSpaces + this.state.numberLetters}</p>
          <p className='teoria__text'> <b>Entropía:</b> {this.state.entropy.toFixed(5)} bits por simbolo</p>

          <table className='table'>
            <thead>
              <tr>
                <th>Caracter</th>
                <th>Frecuencia</th>
                <th>Probabilidad</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.letterInfo.map(letter => {
                  return (
                    <tr key={letter.Caracter} className='table__row'>
                      <td className='table__item'> {letter.Caracter === ' ' ? 'Espacio' : letter.Caracter}</td>
                      <td className='table__item'> {letter.Frecuencia}</td>
                      <td className='table__item'> {letter.Probabilidad.toFixed(5)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <button className='button__reset' onClick={this.handleOnReset}>Reset</button>
      </section>
    )
  }
}
