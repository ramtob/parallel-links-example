import ParallelLinksExample from './ParallelLinksExample.js';
import './style.css';

var element = document.createElement('div');
element.id = 'example1';
document.body.appendChild(element);

var instance = new ParallelLinksExample('example1');

element = document.createElement('button');
element.onclick = () => {instance.stop()};
element.innerHTML = "Stop";
document.body.appendChild(element);

element = document.createElement('button');
element.onclick = () => {instance.restart()};
element.innerHTML = "Start";
document.body.appendChild(element);