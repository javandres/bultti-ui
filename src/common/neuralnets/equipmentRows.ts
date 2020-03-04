import brain from 'brain.js'
import training_true from '../../data/training_true.json'
import training_false from '../../data/training_false.json'
import { toString } from 'lodash'

const brainConfig = {
  binaryThresh: 0.5,
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid',
}

export const equipmentRowsNet = () => {
  // create a simple feed forward neural network with backpropagation
  const net = new brain.NeuralNetwork(brainConfig as brain.INeuralNetworkOptions)

  net.train([
    ...training_false.map((row) => ({ input: (row || []).map((val) => toString(val)), output: [0] })),
    ...training_true.map((row) => ({ input: row.map((val) => toString(val)), output: [1] })),
  ])

  return net
}
