const RED_COLOR_OPTION = 'red-button'
const GREEN_COLOR_OPTION = 'green-button'
const BLUE_COLOR_OPTION = 'blue-button'
const YELLOW_COLOR_OPTION = 'yellow-button'

const COLOR_OPTIONS_ARRAY = [
  RED_COLOR_OPTION, // 0
  GREEN_COLOR_OPTION, // 1
  BLUE_COLOR_OPTION, // 2
  YELLOW_COLOR_OPTION // 3
]

let ARRAY_COLOR_STEPS_LIMIT = 5

let colorArray = []
let userStep = 0
let userCanPlay = false

// Funciones que ejecuten los distintos mecanismos que necesitamos

function playSound() {
  const audioElement = document.getElementById('sound');
  audioElement.play();
  console.log('se reprodujo el sonido');
}

async function startGame() {
  await makeRandomColorArray(ARRAY_COLOR_STEPS_LIMIT); //secuencia de 5 pasos al inicio del juego
  await showToUserColorArray();
}

async function continueGame() { // Continuar el juego agregando más pasos a la secuencia
  ARRAY_COLOR_STEPS_LIMIT++; // Incrementar la longitud de la secuencia
  await makeRandomColorArray(ARRAY_COLOR_STEPS_LIMIT);
  showToUserColorArray(); // Mostrar la nueva secuencia al usuario
}



function restartGame() { // Reiniciar el juego
  userStep = 0
  userCanPlay = false
  hideFeedback()

  startGame()
}

function makeRandomColorArray() { // Generar el arreglo de pasos
  colorArray = []
  for (let i=0; i<ARRAY_COLOR_STEPS_LIMIT; i++) {
    const colorNumber = Math.floor(Math.random() * 4) // Seleccionar un número entero aleatorio entre 0 y 3
    const colorSelected = COLOR_OPTIONS_ARRAY[colorNumber]

    colorArray.push(colorSelected)
  }
}

function showToUserColorArray() { // Mostrarle al usuario esos pasos
  const fullopacityClass = 'fullopacity'
  const gameControlsElementId = 'game-controls-element'
  const gameControlsElement = document.getElementById(gameControlsElementId)

  for (let i=0; i < colorArray.length; i++) {
    const callback = () => {
      const elementId = colorArray[i]
      const elementSelected = document.getElementById(elementId)

      elementSelected.classList.add(fullopacityClass)

      setTimeout(() => {
        elementSelected.classList.remove(fullopacityClass)

        if (i === colorArray.length - 1) {
          userCanPlay = true
          gameControlsElement.style.pointerEvents = 'all'
        }
      }, 1000)
    }

    const time = i * 2000;
    setTimeout(callback, time)
  }
}

function checkUserStep(elementId) { // Verificar si el usuario ingresó correctamente el color
  if (colorArray[userStep] === elementId) { // Checkea si le acertó
    if (userStep < colorArray.length - 1) { // Checkea si no es el último elemento
      showCanContinueFeedback()
    } else {
      showSuccessFeedback()
      setGameToRestart()
    }

    userStep++
  } else {
    showErrorFeedback()
    setGameToRestart()
  }
}

function hideFeedback() {
  const MESSAGE_TO_USER_ELEMENT_ID = 'message-to-user'
  const messageToUserElement = document.getElementById(MESSAGE_TO_USER_ELEMENT_ID)

  messageToUserElement.textContent = ''
}

function showSuccessFeedback() { // Mostrar al usuario que ganó
  const MESSAGE_TO_USER_ELEMENT_ID = 'message-to-user'
  const messageToUserElement = document.getElementById(MESSAGE_TO_USER_ELEMENT_ID)

  messageToUserElement.textContent = '¡Ganaste!'
  playSound();
}

function showCanContinueFeedback() { // Mostrar al usuario que viene bien
  const MESSAGE_TO_USER_ELEMENT_ID = 'message-to-user'
  const messageToUserElement = document.getElementById(MESSAGE_TO_USER_ELEMENT_ID)

  messageToUserElement.textContent = 'Correcto, podés continuar...'
  playSound();
}

function showErrorFeedback() { // Mostrar al usuario que perdió
  const MESSAGE_TO_USER_ELEMENT_ID = 'message-to-user'
  const messageToUserElement = document.getElementById(MESSAGE_TO_USER_ELEMENT_ID)

  messageToUserElement.textContent = 'Perdiste'
}

function setGameToRestart() {
  const gameControlsElementId = 'game-controls-element';
  const startGameButtonElementId = 'start-game';

  const startGameButtonElement = document.getElementById(startGameButtonElementId);
  const gameControlsElement = document.getElementById(gameControlsElementId);

  gameControlsElement.style.pointerEvents = 'none';
  showElement(startGameButtonElement);
  startGameButtonElement.textContent = 'Reiniciar';
  playSound(); // Añadir sonido al reiniciar el juego

  startGameButtonElement.onclick = function() {
    restartGame();
    continueGame(); // Llamar a continueGame() después de reiniciar el juego
    startGameButtonElement.onclick = null; // Deshabilitar el evento de clic después del reinicio
  };
}




function showElement(element) {
  element.style.display = 'block'
}

function hideElement(element) {
  element.style.display = 'none'
}

function activateClickedStyles(element) {  
  const CLICKED_CLASS = 'clicked'

  element.classList.add(CLICKED_CLASS)

  setTimeout(() => {
    element.classList.remove(CLICKED_CLASS)
  }, 1000)
}

function setColorButtonEventListeners() {
  for (let i=0; i<COLOR_OPTIONS_ARRAY.length; i++) {
    const buttonElementId = COLOR_OPTIONS_ARRAY[i]
    const colorElement = document.getElementById(buttonElementId)

    colorElement.addEventListener('click', () => {
      if (userCanPlay) {
        checkUserStep(buttonElementId)
        activateClickedStyles(colorElement)
      } else {
        console.log('El usuario aún no puede jugar')
      }
    })
  }
}

function main() {
  const startGameButton = document.getElementById('start-game')

  startGameButton.addEventListener('click', () => {
    startGame()
    hideElement(startGameButton)
    playSound();
  })

  setColorButtonEventListeners()
}

main();