var instance = new ParallelLinksExample('example1');

document.getElementById("radio-exact").checked = true;

function radioChange(element) {
  instance.setCalculationExact(element.value === 'e');
}