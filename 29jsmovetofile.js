if (!localStorage.getItem('counter')) {  // if there is not something in local storage
    localStorage.setItem('counter', 0);
}

function count() {
    let counter = localStorage.getItem('counter');
    counter++;
    document.querySelector('h1').innerHTML = counter;
    localStorage.setItem('counter', counter);
}
document.addEventListener('DOMContentLoaded', function() { 
    document.querySelector('h1').innerHTML = localStorage.getItem('counter');
    document.querySelector('button').onclick = count; 
}); 